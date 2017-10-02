///<reference path='../_ext/Dom.d.ts'/>

import jsf = require("../api/jsf");
import Queue = require("../_supportive/_Queue");
import myfacesConfig = require("../api/myfaces");
import {Lang} from "./util/Lang";
import {Dom} from "./util/Dom";
import {Monadish} from "./util/Monad";
import {myfaces} from "../api/myfaces";
import {RequestQueue} from "./xhrCore/Request";
import {DomQuery} from "./util/Nodes";
import {ErrorData, EventData, IListener, ListenerQueue} from "./util/ListenerQueue";
import {Response} from "./xhrCore/Response";


export module Impl {
    "use strict";
    import Optional = Monadish.Optional;
    import config = myfaces.config;
    import Config = Monadish.Config;

    var globalConfig = myfacesConfig.myfaces.config;


    export class Implementation {

        /*internal identifiers for options*/
        IDENT_ALL = "@all";
        IDENT_NONE = "@none";
        IDENT_THIS = "@this";
        IDENT_FORM = "@form";

        /*
         * [STATIC] constants
         */

        P_PARTIAL_SOURCE = "javax.faces.source";
        P_VIEWSTATE = "javax.faces.ViewState";
        P_AJAX = "javax.faces.partial.ajax";
        P_EXECUTE = "javax.faces.partial.execute";
        P_RENDER = "javax.faces.partial.render";
        P_EVT = "javax.faces.partial.event";

        /* message types */
        ERROR = "error";
        EVENT = "event";

        /* event emitting stages */
        BEGIN = "begin";
        COMPLETE = "complete";
        SUCCESS = "success";

        /*ajax errors spec 14.4.2*/
        HTTPERROR = "httpError";
        EMPTY_RESPONSE = "emptyResponse";
        MALFORMEDXML = "malformedXML";
        SERVER_ERROR = "serverError";
        CLIENT_ERROR = "clientError";
        TIMEOUT_EVENT = "timeout";


        /*error reporting threshold*/
        _threshold = "ERROR";

        /*blockfilter for the passthrough filtering; the attributes given here
         * will not be transmitted from the options into the passthrough*/
        _BLOCKFILTER = {onerror: 1, onevent: 1, render: 1, execute: 1, myfaces: 1};


        private static _instance: Implementation = null;
        private projectStage: string = null;
        private separator: string = null;


        private eventQueue = new ListenerQueue<EventData>();
        private errorQueue = new ListenerQueue<ErrorData>();

        private constructor() {
        }

        static get instance(): Implementation {
            if (this._instance) {
                return this.instance;
            }
            this._instance = new Implementation();
            return this._instance;
        }

        /**
         * @return the project stage also emitted by the server:
         * it cannot be cached and must be delivered over the server
         * The value for it comes from the requestInternal parameter of the jsf.js script called "stage".
         */
        getProjectStage(): string {
            if (globalConfig.projectStage !== null) {
                return globalConfig.projectStage;
            }
            if (this.projectStage !== null) {
                return this.projectStage;
            }


            var scriptTags = document.querySelectorAll("script");
            var found: boolean = false;
            var allowedProjectStages = {STG_PROD: 1, "Development": 1, "SystemTest": 1, "UnitTest": 1};

            /* run through all script tags and try to find the one that includes jsf.js */
            for (var i = 0; i < scriptTags.length && !found; i++) {
                if (scriptTags[i].src.search(/\/javax\.faces\.resource\/jsf\.js.*ln=javax\.faces/) != -1) {
                    var result = scriptTags[i].src.match(/stage=([^&;]*)/);
                    found = true;
                    if (result) {
                        // we found stage=XXX
                        // return only valid values of ProjectStage
                        this.projectStage = (allowedProjectStages[result[1]]) ? result[1] : null;

                    }
                }
            }
            return this.projectStage;
        }

        /**
         * fetches the separator char from the given script tags
         *
         * @return {char} the separator char for the given script tags
         */
        getSeparatorChar(): string {
            if (globalConfig.separator !== null) {
                return globalConfig.separator;
            }
            if (this.separator) {
                return this.separator;
            }

            var scriptTags = document.getElementsByTagName("script");
            var found = false;

            for (var i = 0; i < scriptTags.length && !found; i++) {
                if (scriptTags[i].src.search(/\/javax\.faces\.resource.*\/jsf\.js.*separator/) != -1) {
                    found = true;
                    var result = scriptTags[i].src.match(/separator=([^&;]*)/);
                    this.separator = decodeURIComponent(result[1]);
                }
            }

            this.separator = this.separator || ":";
            return this.separator;
        }

        chain(source: any, event: Event, funcs ?: Array<Function | string>): boolean {
            for (var cnt = 0; funcs && cnt < funcs.length; cnt++) {
                let ret: any;
                if ("string" != typeof funcs[cnt]) {
                    ret = (<Function>funcs[cnt]).call(source, event);
                } else {
                    //either a function or a string can be passed in case of a string we have to wrap it into another function
                    ret = new Function("event", <string> funcs[cnt]).call(source, event);
                }
                if (ret === false) {
                    return false;
                }
            }
            return true;
        }


        /**
         * this function has to send the ajax requests
         *
         * following request conditions must be met:
         * <ul>
         *  <li> the request must be sent asynchronously! </li>
         *  <li> the request must be a POST!!! request </li>
         *  <li> the request url must be the form action attribute </li>
         *  <li> all requests must be queued with a client side request queue to ensure the request ordering!</li>
         * </ul>
         *
         * @param {String|Node} elem any dom element no matter being it html or jsf, from which the event is emitted
         * @param {|Event|} event any javascript event supported by that object
         * @param {|Object|} options  map of options being pushed into the ajax cycle
         *
         *
         * a) transformArguments out of the function
         * b) passThrough handling with a map copy with a filter map block map
         */
        request(el: HTMLElement, event?: Event, opts?: { [key: string]: string | Function | { [key: string]: string | Function } }) {

            /*namespace remap for our local function context we mix the entire function namespace into
             *a local function variable so that we do not have to write the entire namespace
             *all the time
             **/
            var WINDOW_ID = "javax.faces.windowId";

            //options not set we define a default one with nothing
            let options = new Config(opts || {});
            let elem = DomQuery.byId(el);
            /*assert if the onerror is set and once if it is set it must be of type function*/
            Lang.instance.assertType(options.getIf("onerror").value, "function");
            /*assert if the onevent is set and once if it is set it must be of type function*/
            Lang.instance.assertType(options.getIf("onevent").value, "function");


            /*preparations for jsf 2.2 windowid handling*/
            //pass the window id into the options if not set already
            if (options.getIf("windowId").isAbsent()) {
                var windowId = Dom.instance.getWindowId();
                (windowId) ? options.apply(WINDOW_ID).value = windowId : null;
            } else {
                options.apply(WINDOW_ID).value = options.getIf("windowId").value;
                delete options.value.windowId;
            }

            /**
             * we cross reference statically hence the mapping here
             * the entire mapping between the functions is stateless
             */
            //null definitely means no event passed down so we skip the ie specific checks
            if ('undefined' == typeof event) {
                event = window.event || null;
            }

            //improve the error messages if an empty elem is passed
            if (elem.isAbsent()) {
                throw Lang.instance.makeException(new Error(), "ArgNotSet", null, "Impl", "request", Lang.instance.getMessage("ERR_MUST_BE_PROVIDED1", "{0}: source  must be provided", "jsf.ajax.request", "source element id"));
            }


            var elementId = elem.id;

            /*
             * We make a copy of our options because
             * we should not touch the incoming params!
             */
            var passThrgh = Lang.instance.mixMaps({}, options, true, this._BLOCKFILTER);

            if (event) {
                passThrgh[this.P_EVT] = event.type;
            }

            /**
             * ajax pass through context with the source
             * onevent and onerror
             */
            let context = {};
            let ctx = new Config(context);
            ctx.apply("source").value = elem;
            ctx.apply("onevent").value = options.getIf("onevent").value;
            ctx.apply("onerror").value = options.getIf("onerror").value;
            ctx.apply("myfaces").value = options.getIf("myfaces").value;

            ctx.apply("delay").value = options.getIf("delay").value;


            /**
             * fetch the parent form
             *
             * note we also add an override possibility here
             * so that people can use dummy forms and work
             * with detached objects
             */
            var form =  DomQuery.querySelectorAll("#"+(ctx.getIf("myfaces","form").value || "__mf_none__")).presentOrElse(this.getForm(elem.value[0], event)).value[0];


            /**
             * binding contract the javax.faces.source must be set
             */
            ctx.apply("passThrgh", this.P_PARTIAL_SOURCE).value = elementId;
            /**
             * javax.faces.partial.ajax must be set to true
             */
            ctx.apply("passThrgh", this.P_AJAX).value = elementId;



            if (options.getIf("execute").isPresent()) {
                /*the options must be a blank delimited list of strings*/
                /*compliance with Mojarra which automatically adds @this to an execute
                 * the spec rev 2.0a however states, if none is issued nothing at all should be sent down
                 */
                if ((<string>options.getIf("execute").value).indexOf("@this") == -1) {
                    options.apply("execute").value = options.getIf("execute").value + " @this";
                }
                this.transformList(ctx.getIf("passThrgh"), this.P_EXECUTE, <string> options.getIf("execute").value, form, elementId);
            } else {
                ctx.apply("passThrgh", this.P_EXECUTE).value = elementId;
            }

            if (options.getIf("render").isPresent()) {
                this.transformList(ctx.getIf("passThrgh"), this.P_RENDER, <string>  options.getIf("render").value, form, elementId);
            }

            RequestQueue.instance.request()

            //additional meta information to speed things up, note internal non jsf
            //pass through options are stored under _mfInternal in the context
            //context._mfInternal = {};
            //var mfInternal = context._mfInternal;

            //mfInternal["_mfSourceFormId"] = form.id;
            //mfInternal["_mfSourceControlId"] = elementId;
            //mfInternal["_mfTransportType"] = transportType;

            //mojarra compatibility, mojarra is sending the form id as well
            //this is not documented behavior but can be determined by running
            //mojarra under blackbox conditions
            //i assume it does the same as our formId_submit=1 so leaving it out
            //wont hurt but for the sake of compatibility we are going to add it
            ctx.apply("passThrgh",form.id).value = form.id;

            //delay handling is an experimental feature which will most likely
            //make it into jsf 2.2
            /* jsf2.2 only: options.delay || */
          /*  var delayTimeout = Lang.instance.getLocalOrGlobalConfig(context, "delay", false);

            //TODO emit the request accordingly into the request queue and attach the params to the request for further processing
            RequestQueue.instance.request()

            if (delayTimeout) {
                this._delayTimeout = setTimeout(_Lang.hitch(this, function () {
                    this._transport[transportType](elem, form, context, passThrgh);
                }), delayTimeout);
            } else {
                this._transport[transportType](elem, form, context, passThrgh);
            }*/

        }


        /**
         * transforms the list to the expected one
         * with the proper none all form and this handling
         * (note we also could use a simple string replace but then
         * we would have had double entries under some circumstances)
         *
         * @param passThrgh
         * @param target
         * @param srcStr
         * @param form
         * @param elementId
         */
        private transformList(passThrgh: Config, target: string, srcStr: string, form: HTMLElement, elementId: string): Config {
            let _Lang = Lang.instance;
            //this is probably the fastest transformation method
            //it uses an array and an index to position all elements correctly
            //the offset variable is there to prevent 0 which results in a javascript
            //false
            srcStr = _Lang.trim(srcStr);
            let offset = 1,
                vals = (srcStr) ? srcStr.split(/\s+/) : [],
                idIdx = (vals.length) ? _Lang.arrToMap(vals, offset) : {},

                //helpers to improve speed and compression
                none = idIdx[this.IDENT_NONE],
                all = idIdx[this.IDENT_ALL],
                theThis = idIdx[this.IDENT_THIS],
                theForm = idIdx[this.IDENT_FORM];

            if (none) {
                //in case of none nothing is returned
                if(passThrgh.getIf("target").isPresent()) {
                    delete passThrgh.value.target;
                }
                return passThrgh;
            }
            if (all) {
                //in case of all only one value is returned
                passThrgh.apply("target").value = this.IDENT_ALL;
                return passThrgh;
            }

            if (theForm) {
                //the form is replaced with the proper id but the other
                //values are not touched
                vals[theForm - offset] = form.id;
            }
            if (theThis && !idIdx[elementId]) {
                //in case of this, the element id is set
                vals[theThis - offset] = elementId;
            }

            //the final list must be blank separated
            passThrgh.apply("target").value  = vals.join(" ");
            return passThrgh;
        }

        /**
         * Spec. 13.3.3
         * Examining the response markup and updating the DOM tree
         * @param {XMLHttpRequest} request - the ajax request
         * @param {Object} context - the ajax context
         */
        response(request:XMLHttpRequest, context:{[key: string]: any}) {
            Response.processResponse(request, context);
        }

        addOnError(errorListener: IListener<ErrorData>) {
            /*error handling already done in the assert of the queue*/
            this.errorQueue.enqueue(errorListener);
        }

        addOnEvent(eventListener: IListener<EventData>) {
            /*error handling already done in the assert of the queue*/
            this.eventQueue.enqueue(eventListener);
        }

        /**
         * sends an event
         */
        sendEvent(/*Object*/request: XMLHttpRequest, /*Object*/ context: { [key: string]: any }, /*event name*/ name: string) {
            let _Lang = Lang.instance;
            let eventData = new EventData();
            let UNKNOWN = _Lang.getMessage("UNKNOWN");

            let req = new Config(request);

            eventData.type = this.EVENT;

            eventData.status = name;
            eventData.source = context.source;

            if (name !== this.BEGIN) {

                try {
                    eventData.responseCode = req.getIf("status").value;
                    eventData.responseText = req.getIf("responseText").value;
                    eventData.responseXML = req.getIf("responseXML").value;

                } catch (e) {
                    var impl = _Lang.getGlobalConfig("jsfAjaxImpl", this);
                    impl.sendError(request, context, this.CLIENT_ERROR, "ErrorRetrievingResponse",
                        _Lang.getMessage("ERR_CONSTRUCT", e.toString()));

                    //client errors are not swallowed
                    throw e;
                }

            }

            /**/
            if (context.onevent) {
                /*calling null to preserve the original scope*/
                context.onevent.call(null, eventData);
            }

            /*now we serve the queue as well*/
            this.eventQueue.broadcastEvent(eventData);
        }


        /**
         * implementation triggering the error chain
         *
         * @param {Object} request the request object which comes from the xhr cycle
         * @param {Object} context (Map) the context object being pushed over the xhr cycle keeping additional metadata
         * @param {String} name the error name
         * @param {String} serverErrorName the server error name in case of a server error
         * @param {String} serverErrorMessage the server error message in case of a server error
         * @param {String} caller optional caller reference for extended error messages
         * @param {String} callFunc optional caller Function reference for extended error messages
         *
         *  handles the errors, in case of an onError exists within the context the onError is called as local error handler
         *  the registered error handlers in the queue receiv an error message to be dealt with
         *  and if the projectStage is at development an alert box is displayed
         *
         *  note: we have additional functionality here, via the global config myfaces.config.defaultErrorOutput a function can be provided
         *  which changes the default output behavior from alert to something else
         *
         *
         */
        sendError(request: XMLHttpRequest,context: {[key: string]: any}, name: string, serverErrorName?: string, serverErrorMessage?: string, caller?: string, callFunc?: string) {
            let _Lang = Lang.instance;
            let UNKNOWN = _Lang.getMessage("UNKNOWN");

            let eventData = new ErrorData();
            //we keep this in a closure because we might reuse it for our serverErrorMessage
            let malFormedMessage = function() {
                return (name && name === this.MALFORMEDXML) ? _Lang.getMessage("ERR_MALFORMEDXML") : "";
            };
            let ctx = new Config(context);

            //by setting unknown values to unknown we can handle cases
            //better where a simulated context is pushed into the system
            eventData.type = this.ERROR;

            eventData.status = name || UNKNOWN;
            eventData.serverErrorName = serverErrorName || UNKNOWN;
            eventData.serverErrorMessage = serverErrorMessage || UNKNOWN;



            try {
                eventData.source = ctx.getIf("source").presentOrElse(UNKNOWN).value;
                eventData.responseCode = ctx.getIf("status").presentOrElse(UNKNOWN).value;
                eventData.responseText = ctx.getIf("responseText").presentOrElse(UNKNOWN).value;
                eventData.responseXML = ctx.getIf("responseXML").presentOrElse(UNKNOWN).value;
            } catch (e) {
                // silently ignore: user can find out by examining the event data
            }
            //extended error message only in dev mode
            if(jsf.getProjectStage() === "Development") {
                eventData.serverErrorMessage = eventData.serverErrorMessage || "";
                eventData.serverErrorMessage = (caller)?  eventData.serverErrorMessage + "\nCalling class: "+caller:eventData.serverErrorMessage;
                eventData.serverErrorMessage = (callFunc)? eventData.serverErrorMessage + "\n Calling function: "+callFunc :eventData.serverErrorMessage;
            }

            /**/
            if (ctx.getIf("onerror").isPresent()) {
                context.onerror(eventData);
            }

            /*now we serve the queue as well*/
            this.errorQueue.broadcastEvent(eventData);

            if (jsf.getProjectStage() === "Development" && !this.errorQueue.length && ctx.getIf("onerror").isAbsent()) {
                var DIVIDER = "--------------------------------------------------------",
                    defaultErrorOutput = Lang.instance.getGlobalConfig("defaultErrorOutput", alert),
                    finalMessage = [],
                    //we remap the function to achieve a better compressability
                    pushMsg = (item: any) => {finalMessage.push(item);};

                (serverErrorMessage) ? pushMsg(_Lang.getMessage("MSG_ERROR_MESSAGE") +" "+ serverErrorMessage +"\n") : null;

                pushMsg(DIVIDER);

                (caller)? pushMsg("Calling class:"+ caller): null;
                (callFunc)? pushMsg("Calling function:"+ callFunc): null;
                (name) ? pushMsg(_Lang.getMessage("MSG_ERROR_NAME") +" "+name ): null;
                (serverErrorName && name != serverErrorName) ? pushMsg("Server error name: "+ serverErrorName ) : null;


                pushMsg(malFormedMessage());
                pushMsg(DIVIDER);
                pushMsg(_Lang.getMessage("MSG_DEV_MODE"));
                defaultErrorOutput(finalMessage.join("\n"));
            }
        }




        /**
         * fetches the form in an unprecise manner depending
         * on an element or event target
         *
         * @param elem
         * @param event
         */
        private getForm(elem: HTMLElement, event?: Event) {
            var _Lang = Lang.instance;

            let queryElem = new DomQuery(elem);
            var form = queryElem.parents("form").presentOrElse(queryElem.byTagName("form", true));

            if (form.isAbsent() && event) {
                //in case of no form is given we retry over the issuing event
                let eventTarget = new DomQuery(_Lang.getEventTarget(event));
                let form = eventTarget.parents("form").presentOrElse(eventTarget.byTagName("form", true));


                if (form.isAbsent()) {
                    throw _Lang.makeException(new Error(), null, null, "Impl", "getForm", _Lang.getMessage("ERR_FORM"));
                }
            } else if (form.isAbsent()) {
                throw _Lang.makeException(new Error(), null, null, "Impl", "getForm", _Lang.getMessage("ERR_FORM"));
            }
            return form.value;
        }

    }
}