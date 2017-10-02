export module _Queue {
    "use strict";

    export class Queue<T> {
        //faster queue by http://safalra.com/web-design/javascript/queues/Queue.js
        //license public domain
        //The trick is to simply reduce the number of slice and slice ops to a bare minimum.

        private q:T[] = [];
        private space:number = 0;
        private size:number = -1;

        constructor() {
        }

        /**
         * @return the length of the queue as integer
         */
        length():number {
            return this.q.length - this.space;
        }

        /**
         * @return true if the current queue is empty false otherwise
         */
        isEmpty():boolean {
            // return true if the queue is empty, and false otherwise
            return (this.q.length == 0);
        }

        /**
         * Sets the current queue to a new size, all overflow elements at the end are stripped
         * automatically
         *
         * @param {int} newSize as numeric value
         */
        setQueueSize(newSize:number) {
            this.size = newSize;
            this.readjust();
        }

        /**
         * adds a listener to the queue
         *
         * @param element the listener to be added
         */
        enqueue(element:T) {
            this.q.push(element);
            //qeuesize is bigger than the limit we drop one element so that we are
            //back in line
            this.readjust();
        }

        private readjust() {
            var size = this.size;
            while (size && size > -1 && this.length() > size) {
                this.dequeue();
            }
        }

        /**
         * removes a listener form the queue
         *
         * @param element the listener to be removed
         */
        remove(element:T) {
            /*find element in queue*/
            var index = this.indexOf(element);
            /*found*/
            if (index != -1) {
                this.q.splice(index, 1);
            }
        }


        /**
         * dequeues the last element in the queue
         * @return {Object} element which is dequeued
         */
        dequeue():T {
            // initialise the element to return to be undefined
            var element = null;

            // check whether the queue is empty
            var qLen = this.q.length;
            var queue = this.q;

            if (qLen) {
                // fetch the oldest element in the queue
                element = queue[this.space];
                // update the amount of space and check whether a shift should occur
                //added here a max limit of 30
                //now bit shift left is a tad faster than multiplication on most vms and does the same
                //unless we run into a bit skipping which is impossible in our usecases here
                if ((++this.space) << 1 >= qLen) {

                    // set the queue equal to the non-empty portion of the queue
                    this.q = queue.slice(this.space);

                    // reset the amount of space at the front of the queue
                    this.space = 0;
                }
            }
            // return the removed element
            return element;
        }


        each(callbackfn:(value:T, index:number, array:T[]) => void) {
            this.q.forEach(callbackfn);
        }

        arrFilter(callbackfn:(value:T, index:number, array:T[]) => boolean) {
            return this.q.filter(callbackfn);
        }

        /**
         * @param element
         * @return the current index of the element in the queue or -1 if it is not found
         */
        indexOf(element: T) {
            return this.q.indexOf(element);
        }

        /**
         * resets the queue to initial empty state
         */
        cleanup() {
            this.q = [];
            this.space = 0;
        }
    }

}