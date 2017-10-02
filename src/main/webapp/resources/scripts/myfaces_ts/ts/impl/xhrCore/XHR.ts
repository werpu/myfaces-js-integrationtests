/* Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to you under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


import {Monadish} from "../util/Monad";
import Promise = Monadish.Promise;

import CancellablePromise = Monadish.CancellablePromise;
export enum XHRErrorTypes {
    ERROR, TIMEOUT, ABORT
}

export class XHR {

    private xhr = new XMLHttpRequest();

    private method: string = "POST";
    private async : boolean;
    private url: string;

    private applyFunc: Function;
    private rejectFunc: Function;

    public constructor(method: string, url: string, async: boolean) {
        this.xhr.onreadystatechange = () => this.onReadyStateChange();
        this.method = method;
        this.url = url;
        this.async = async;
        this.xhr.open(this.method, this.url, this.async);

        var _t = this;
        this.xhr.onerror = () =>  this.onError();
        this.xhr.ontimeout = () =>  this.onTimeout();
        this.xhr.onabort = () => this.onAbort();
        this.xhr.onload = function() {
            _t.onLoad((<XMLHttpRequest>this).response);
        };
    }

    send(formData): CancellablePromise {
        if(this.applyFunc) {
            throw Error("Send already in progress");
        }
        this.xhr.send(formData);
        var retVal: any =  new CancellablePromise((apply: Function, reject: Function) => {
            this.applyFunc = apply;
            this.rejectFunc = reject;
        }, () => { this.cancel() });

        return retVal;
    }

    cancel() {
        this.xhr.abort();
        this.rejectFunc();
    }

    private onReadyStateChange(): any {

    }


    private onAbort() {
        this.rejectFunc(XHRErrorTypes.ABORT);
    }

    private onError() {
        this.rejectFunc(XHRErrorTypes.ERROR);
    }

    private onTimeout() {
        this.rejectFunc(XHRErrorTypes.TIMEOUT);
    }

    private onLoad(response: any) {
        this.applyFunc(response);
        this.applyFunc = null;
    }

    get value() :XMLHttpRequest {
        return this.xhr;
    }


}