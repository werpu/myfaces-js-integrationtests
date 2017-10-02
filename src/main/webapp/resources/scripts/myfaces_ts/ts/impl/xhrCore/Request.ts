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
import {Lang} from "../util/Lang";
import {jsf} from "../../api/jsf";
import {XHR} from "./XHR";


import CancellablePromise = Monadish.CancellablePromise;
import Optional = Monadish.Optional;
import {Impl} from "../Impl";
import Config = Monadish.Config;
/**
 * central requestInternal handler
 */
export class RequestQueue {

    private currentRequest: Promise;
    private ongoingRequests: number = 0;
    private aborted = false;
    private currentDelay: CancellablePromise;

    _PAR_ERRORLEVEL = "errorlevel";
    _PAR_QUEUESIZE = "queuesize";
    _PAR_PPS = "pps";
    _PAR_TIMEOUT = "timeout";
    _PAR_DELAY = "delay";

    private static _instance: RequestQueue;

    static get instance() {
        if (!RequestQueue._instance) {
            RequestQueue._instance = new RequestQueue();
        }
        return RequestQueue._instance;
    }

    private constructor() {

    }


    request(url: string, sourceForm: any, context: Config, delay?: number, timeout?: number, max?: number): void {
        if (this.currentDelay) {
            this.currentDelay.cancel();
            this.currentDelay = null;
        }

        var oDelay = Optional.fromNullable(delay);
        if (oDelay.get(0).value  > 0) {
            this.currentDelay = Lang.instance.timeout(delay).then(() => {
                this.requestInternal(url, sourceForm, context, timeout);
            }).finally(() => {
                this.currentDelay = null;
            })
        } else {
            if (max && max < this.ongoingRequests) {
                this.requestInternal(url, sourceForm, context, timeout);
            }
        }

    }

    private requestInternal(url: string, sourceForm: any, context: Config, timeout ?: number): void {
        try {
            /**
             * Spec. 13.3.1
             * Collect and encode input elements.
             * Additionally the hidden element javax.faces.ViewState
             *
             *
             * @return  an element of formDataWrapper
             * which keeps the final Send Representation of the
             */
            let formData = Lang.instance.createFormDataDecorator(jsf.getViewState(sourceForm));
            formData = Lang.instance.mixMaps(formData, context.getIf("passThrgh").value);

            //no more queuing over a queue we can use promises to achieve the same
            var xhr = new XHR("POST", url, true);


            let reqestDone = () => {
                this.ongoingRequests--;
                if (this.ongoingRequests == 0) {
                    this.currentRequest = null;
                    this.aborted = false;
                }
            };

            let sendRequests = (): CancellablePromise => {
                this.ongoingRequests++;
                var myXHR =  xhr.send(formData).then((response: any) => {
                    try {
                        if (!this.aborted) {
                            console.debug(response);
                        }
                        //handle response
                        jsf.ajax.response(xhr, context.value);
                    } catch (e) {
                        //Todo handle error and abort rest of the queue
                        this.aborted = true;
                    } finally {
                        xhr = null;
                        reqestDone();
                    }
                    return true;
                }).catch(()=> {
                    xhr = null;
                    reqestDone();
                });

                if(timeout && timeout > 0) {
                    Lang.instance.timeout(timeout).then(() => {
                        if(xhr) {
                            xhr.cancel();
                        }
                    });
                }
                return myXHR;
            };
            if (this.currentRequest) {
                this.currentRequest.then(() => {
                    if (!this.aborted) {
                        return sendRequests();
                    }
                });
            } else {
                this.currentRequest = sendRequests().finally(() => {
                    this.currentRequest = null;
                    this.aborted = false;
                });
            }
        } catch (e2) {
            //should never happen, this is an uncontrolled error, we do a hard recovery here
            //and let the queue roll out to get a hopefully recoverable state
            //however it is better to do a page refresh after we reach this condition
            //TODO error message
            this.currentRequest = null;
        }
    }


    private getArguments(source: HTMLElement | string, sourceForm: HTMLElement, context: any, passThrgh: any): any {

        /** @ignore */
        let _Lang = Lang.instance,
            applyCfg = this.applyConfig,
            //RT does not have this references, hence no hitch needed
            getCfg = _Lang.getLocalOrGlobalConfig,
            ret = {
                "source": source,
                "sourceForm": sourceForm,
                "context": context,
                "passThrough": passThrgh
            };

        //we now mix in the config settings which might either be set globally
        //or pushed in under the context myfaces.<contextValue> into the current request
        applyCfg(ret, context, "alarmThreshold", this._PAR_ERRORLEVEL);
        applyCfg(ret, context, "queueSize", this._PAR_QUEUESIZE);
        applyCfg(ret, context, "timeout", this._PAR_TIMEOUT);
        applyCfg(ret, context, "delay", this._PAR_DELAY);

        //now partial page submit needs a different treatment
        //since pps == execute strings
        let excecute = Config.fromNullable(passThrgh).getIf(Impl.Implementation.instance.P_EXECUTE);
        if (getCfg(context, this._PAR_PPS, false)
            && excecute.isPresent() && excecute.value.length > 0) {

            ret['partialIdsArray'] = excecute.value.split(" ");
        }
        return ret;
    }

    /**
     * helper method to apply a config setting to our varargs param list
     *
     * @param destination the destination map to receive the setting
     * @param context the current context
     * @param destParm the destination param of the destination map
     * @param srcParm the source param which is the key to our config setting
     */
    applyConfig(destination, context, destParm, srcParm) {

        /** @ignore */
        var getConfig = Lang.instance.getLocalOrGlobalConfig;
        if (Optional.fromNullable(getConfig(context, srcParm, null).isPresent())) {
            Config.fromNullable(destination).apply("destParam", getConfig(context, srcParm, null).value);
        }
    }


}