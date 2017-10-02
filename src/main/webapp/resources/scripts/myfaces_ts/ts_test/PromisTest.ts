///<reference path="../typings/index.d.ts"/>
///<reference path="../ts/impl/util/Monad.ts"/>
///<reference path="../ts/impl/util/LangTypes.ts"/>

import {Monadish} from "../ts/impl/util/Monad";
import Optional = Monadish.Optional;
import Promise = Monadish.Promise;



describe('promise tests', () => {

    /*it('simple promise no async', () => {
        let applyPromise = new Promise((apply: Function, reject: Function) => {
          apply(1);
        });

        applyPromise.then((data: any): Promise => {
            expect(data).toBe(1);
            return null;
        });
    });*/

    it('simple promise', () => {
        jasmine.clock().install();
        let applyPromise = new Promise((apply: Function, reject: Function) => {
            setTimeout(() => {
                apply(1);
            },  1);

        });
        let finallyCalled = false;
        let thenCalled = false;
        applyPromise.then((data: any): any => {
            thenCalled = true;
            expect(data).toBe(1);
        }).finally(() => {
            finallyCalled = true
        });
        jasmine.clock().tick(2);
        expect(thenCalled).toBe(true);
        expect(finallyCalled).toBe(true);
    });




    it('simple promise failure', () => {

        let applyPromise = new Promise((apply: Function, reject: Function) => {
            setTimeout(() => {
                reject(1);
            },  1);

        });
        let finallyCalled = false;
        let thenCalled = false;
        applyPromise.catch((data: any): void => {
            thenCalled = true;
            expect(data).toBe(1);
        }).finally(() => {
            finallyCalled = true
        });
        jasmine.clock().tick(2);
        expect(thenCalled).toBe(true);
        expect(finallyCalled).toBe(true);
    });


    it('chained promise', () => {

        let applyPromise = new Promise((apply: Function, reject: Function) => {
            setTimeout(() => {
                apply(1);
            },  1);

        });
        let finallyCalled = false;
        let thenCalled = false;
        let then2Called = false;
        applyPromise.then((data: any): any => {
            thenCalled = true;
            expect(data).toBe(1);
            return 2;
        }).then((data: any): any => {
            then2Called = true;
            expect(data).toBe(2);
        }).finally(() => {
            finallyCalled = true
        });
        jasmine.clock().tick(2);
        expect(thenCalled).toBe(true);
        expect(then2Called).toBe(true);
        expect(finallyCalled).toBe(true);
    });


    it("Promise all test", () => {
        let applyPromise = new Promise((apply: Function, reject: Function) => {
            setTimeout(() => {
                apply(1);
            },  1);

        });
        let applyPromise2 = new Promise((apply: Function, reject: Function) => {
            setTimeout(() => {
                apply(2);
            },  1);

        });
        let applyPromise3 = Promise.all(applyPromise, applyPromise2);

        let finallyCalled = false;
        let thenCalled = false;
        let then2Called = false;

        applyPromise.then((data: any): any => {
            thenCalled = true;
            expect(data).toBe(1);
            return 2;
        });
        applyPromise2.then((data: any): any => {
            then2Called = true;
            expect(data).toBe(2);
            return 2;
        });

        applyPromise3.finally(() => {
            finallyCalled = true;
        });


        jasmine.clock().tick(4);
        expect(thenCalled).toBe(true);
        expect(then2Called).toBe(true);
        expect(finallyCalled).toBe(true);
    });

    it("Promise race test", () => {
        let applyPromise = new Promise((apply: Function, reject: Function) => {
            setTimeout(() => {
                apply(1);
            },  1);

        });
        let applyPromise2 = new Promise((apply: Function, reject: Function) => {
            setTimeout(() => {
                apply(2);
            },  6);

        });
        let applyPromise3 = Promise.race(applyPromise, applyPromise2);

        let finallyCalled = false;
        let thenCalled = false;
        let then2Called = false;

        applyPromise.then((data: any): any => {
            thenCalled = true;
            expect(data).toBe(1);
            return 2;
        });
        applyPromise2.then((data: any): any => {
            then2Called = true;
            expect(data).toBe(2);
            return 2;
        });

        applyPromise3.then((val: any):any => {
            finallyCalled = true;
        });


        jasmine.clock().tick(4);

        expect(thenCalled || then2Called).toBe(true);
        expect(then2Called).toBe(false);
        expect(finallyCalled).toBe(true);
    });

    it("Promise chain test", () => {
        var chainExecuted = false;
        let applyPromise = new Promise((apply: Function, reject: Function) => {
            setTimeout(() => {
                apply(1);
            },  1);

        });
        applyPromise.then(() => {
            return new Promise((apply: Function, reject: Function) => {
                setTimeout(() => {
                    apply(2);
                },  6);

            })
        }).then(() => {
            chainExecuted = true;
        });
        jasmine.clock().tick(8);
        expect(chainExecuted).toBe(true);

    });

    it("Promise chain2 test", () => {
        var chainExecuted = false;
        let applyPromise = new Promise((apply: Function, reject: Function) => {
            setTimeout(() => {
                reject(1);
            },  1);

        });
        applyPromise.catch(() => {
            return new Promise((apply: Function, reject: Function) => {
                setTimeout(() => {
                    apply(2);
                },  6);

            })
        }).then(() => {
            chainExecuted = true;
        });
        jasmine.clock().tick(8);
        expect(chainExecuted).toBe(true);
    });

    it("Promise chain3 test", () => {
        var chainExecuted = false;
        var promise2Called = false;
        var promise3Called = false;
        var promise4Called = false;

        let applyPromise = new Promise((apply: Function, reject: Function) => {
            setTimeout(() => {
                reject(1);
            },  1);

        }).catch(() => {
            return new Promise((apply: Function, reject: Function) => {
                setTimeout(() => {
                    apply(2);
                },  6);

            })
        }).then(() => {
            chainExecuted = true;
            return Promise.reject(true);
        }).catch((val: any) => {
            promise4Called = val;
        });

        let applyPromise2 = new Promise((apply: Function, reject: Function) => {
            setTimeout(() => {
                reject(1);
            },  1);

        }).then(() => {
            promise2Called = true;
        });
        let applyPromise3 = Promise.all(applyPromise, applyPromise2).then(() => {
            promise3Called = true;
        });

        jasmine.clock().tick(8);
        expect(chainExecuted).toBe(true);
        expect(promise3Called).toBe(true);
        expect(promise4Called).toBe(true);
    });

    it("Promise resolve test", () => {
        var promisCalled = false;
        var original = Promise.resolve(true);
        var cast = Promise.resolve(original);
        cast.then(function(v) {
            promisCalled = true;
            expect(v).toBe(true);
        });


        jasmine.clock().tick(8);
        expect(promisCalled).toBe(true);
    });

    it("Promise reject test", () => {
        var promisCalled = false;
        var original = Promise.resolve(true);
        var original2 = Promise.resolve(original);
        var cast = Promise.reject(original2);
        cast.catch(function(v) {
            promisCalled = true;
            expect(v).toBe(true);
        });


        jasmine.clock().tick(8);
        expect(promisCalled).toBe(true);
    });

});


