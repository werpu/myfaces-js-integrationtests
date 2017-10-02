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


import {PolyFills} from "./Polyfills";
import {LangTypes} from "./LangTypes";
import JSFErrorData = LangTypes.JSFErrorData;
import MyFacesErrorData = LangTypes.MyFacesErrorData;
import FormDataDecorator = LangTypes.FormDataDecorator;
import FormDataDecoratorArray = LangTypes.FormDataDecoratorArray;
import FormDataDecoratorString = LangTypes.FormDataDecoratorString;
import FormDataDecoratorOther = LangTypes.FormDataDecoratorOther;
import XMLErrorMessage = LangTypes.XMLErrorMessage;
import XMLContent = LangTypes.XMLContent;
import {Monadish} from "./Monad";
import Optional = Monadish.Optional;

import {Messages_de} from "../i18n/Messages_de";
import {Messages_es} from "../i18n/Messages_es";
import {Messages_fr} from "../i18n/Messages_fr";
import {Messages_it} from "../i18n/Messages_it";
import {Messages} from "../i18n/Messages";
import CancellablePromise = Monadish.CancellablePromise;
import Config = Monadish.Config;


export class Lang {

    private static LANGUAGE_MAPS: { [key: string]: any } = {
        "de": Messages_de,
        "es": Messages_es,
        "fr": Messages_fr,
        "it": Messages_it
    };



    private installedLocale: Messages;
    private nameSpace = "impl/util/Lang/";


    private static _instance;
    static get instance() {
        if (!Lang._instance) {
            Lang._instance = new Lang();
        }
        return Lang._instance;
    }

    private constructor() {
        PolyFills.init();
        this.initLocale();
    }

    /**
     * returns a given localized message upon a given key
     * basic java log like templating functionality is included
     *
     * @param {String} key the key for the message
     * @param {String} defaultMessage optional default message if none was found
     *
     * Additionally you can pass additional arguments, which are used
     * in the same way java log templates use the params
     *
     * @param templateParams the param list to be filled in
     */
    getMessage(key: string, defaultMessage?: string, ...templateParams: Array<string>): string {

        let msg = this.installedLocale[key] || defaultMessage || key + " - undefined message";

        //we now make a simple templating replace of {0}, {1} etc... with their corresponding
        //arguments
        for (let cnt = 0; templateParams && cnt < templateParams.length; cnt++) {
            msg = msg.replace(new RegExp(["\\{", cnt, "\\}"].join(""), "g"), templateParams[cnt]);
        }

        return msg;
    }


    /**
     * String to array function performs a string to array transformation
     * @param {String} it the string which has to be changed into an array
     * @param {RegExp} splitter our splitter reglar expression
     * @return an array of the splitted string
     */
    strToArray(it: string, splitter: string): Array<string> {
        //	summary:
        //		Return true if it is a String

        if (!splitter) {
            throw this.makeException(new Error(), null, null, "Lang.js", "strToArray", this.getMessage("ERR_PARAM_STR_RE", null, "myfaces.impl._util._Lang.strToArray", "splitter"));
        }
        let retArr = it.split(splitter);
        for (let cnt = 0; cnt < retArr.length; cnt++) {
            retArr[cnt] = this.trim(retArr[cnt]);
        }
        return retArr;
    }

    /**
     * hyperfast trim
     * http://blog.stevenlevithan.com/archives/faster-trim-javascript
     * crossported from dojo
     */
    trim(str: string): string {
        str = str.replace(/^\s\s*/, '');
        let ws = /\s/, i = str.length;

        while (ws.test(str.charAt(--i))) {
            //do nothing
        }
        return str.slice(0, i + 1);
    }


    /**
     * Backported from dojo
     * a failsafe string determination method
     * (since in javascript String != "" typeof alone fails!)
     * @param it {|Object|} the object to be checked for being a string
     * @return true in case of being a string false otherwise
     */
    isString(it?: any): boolean {
        //	summary:
        //		Return true if it is a String
        return !!arguments.length && it != null && (typeof it == "string" || it instanceof String); // Boolean
    }

    /**
     * hitch backported from dojo
     * hitch allows to assign a function to a dedicated scope
     * this is helpful in situations when function reassignments
     * can happen
     * (notably happens often in lazy xhr code)
     *
     * @param {Function} scope of the function to be executed in
     * @param {Function} method to be executed, the method must be of type function
     *
     * @return whatever the executed method returns
     */
    hitch(scope: Function, method: Function): Function {
        return !scope ? method : function () {
            return method.apply(scope, arguments || []);
        }; // Function
    }

    /**
     * Helper function to merge two maps
     * into one
     * @param {Object} dest the destination map
     * @param {Object} src the source map
     * @param {boolean} overwrite if set to true the destination is overwritten if the keys exist in both maps
     * @param blockFilter
     * @param whitelistFilter
     **/
    mixMaps<T>(dest: { [key: string]: T }, src: { [key: string]: T }, overwrite: boolean, blockFilter?: Function, whitelistFilter?: Function): { [key: string]: T } {
        if (!dest || !src) {
            throw this.makeException(new Error(), null, null, this.nameSpace, "mixMaps", this.getMessage("ERR_PARAM_MIXMAPS", null, "_Lang.mixMaps"));
        }
        let UNDEF = "undefined";
        for (let key in src) {
            if (!src.hasOwnProperty(key)) continue;
            if (blockFilter && blockFilter[key]) {
                continue;
            }
            if (whitelistFilter && !whitelistFilter[key]) {
                continue;
            }
            if (!overwrite) {
                /**
                 *we use exists instead of booleans because we cannot rely
                 *on all values being non boolean, we would need an getIf
                 *operator in javascript to shorten this :-(
                 */
                dest[key] = (UNDEF != typeof dest[key]) ? dest[key] : src[key];
            } else {
                dest[key] = (UNDEF != typeof src[key]) ? src[key] : dest[key];
            }
        }
        return dest;
    }

    /**
     * generic object to array conversion method which
     * transforms any object to something array laike
     * @param obj
     * @param offset
     * @param pack
     * @returns an array converted from the object
     */
    objToArray<T>(obj: any, offset?: number, pack?: Array<T>): Array<T> {
        if (!obj) {
            return pack || null;
        }
        //since offset is numeric we cannot use the shortcut due to 0 being false
        //special condition array delivered no offset no pack
        if (obj instanceof Array && !offset && !pack)  return obj;
        let finalOffset = ('undefined' != typeof offset || null != offset) ? offset : 0;
        let finalPack = pack || [];
        try {
            return finalPack.concat(Array.prototype.slice.call(obj, finalOffset));
        } catch (e) {
            //ie8 (again as only browser) delivers for css 3 selectors a non convertible object
            //we have to do it the hard way
            //ie8 seems generally a little bit strange in its behavior some
            //objects break the function is everything methodology of javascript
            //and do not implement apply call, or are pseudo arrays which cannot
            //be sliced
            for (let cnt = finalOffset; cnt < obj.length; cnt++) {
                finalPack.push(obj[cnt]);
            }
            return finalPack;
        }
    }

    /**
     * foreach implementation utilizing the
     * ECMAScript wherever possible
     * with added functionality
     *
     * @param arr the array to filter
     * @param callbackfn
     * @param startPos
     * @param scope the closure to apply the function to, with the syntax defined by the ecmascript functionality
     * function (element<,key, array>)
     * <p />
     * optional params
     * <p />
     * <ul>
     *      <li>param startPos (optional) the starting position </li>
     *      <li>param scope (optional) the scope to apply the closure to  </li>
     * </ul>
     */
    arrForEach<T>(arr: any, callbackfn: (value: T, index: number, array: T[]) => void, startPos?: number, scope?: Function) {
        if (!arr || !arr.length) return;
        let startPosFinal = startPos || 0;
        let thisObj = scope;
        //check for an existing foreach mapping on array prototypes
        //IE9 still does not pass array objects as result for dom ops
        let convertedArr: Array<T> = this.objToArray<T>(arr);
        (startPos) ? convertedArr.slice(startPosFinal).forEach(callbackfn, thisObj) : convertedArr.forEach(callbackfn, thisObj);
    }

    /**
     * checks if an array contains an element
     * @param {Array} arr   array
     * @param {String} str string to check for
     */
    contains<T>(arr: T[], str: string) {
        if (!arr || !str) {
            throw this.makeException(new Error(), null, null, this.nameSpace, "contains", this.getMessage("ERR_MUST_BE_PROVIDED", null, "_Lang.contains", "arr {array}", "str {string}"));
        }
        return this.arrIndexOf(arr, str) != -1;
    }

    /**
     * adds a EcmaScript optimized indexOf to our mix,
     * checks for the presence of an indexOf functionality
     * and applies it, otherwise uses a fallback to the hold
     * loop method to determine the index
     *
     * @param arr the array
     * @param element the index to search for
     * @param fromIndex
     */
    arrIndexOf<T>(arr: any, element: T, fromIndex ?: number): number {
        if (!arr || !arr.length) return -1;
        let pos = fromIndex || 0;
        arr = this.objToArray<T>(arr);
        return arr.indexOf(element, pos);
    }

    /**
     * filter implementation utilizing the
     * ECMAScript wherever possible
     * with added functionality
     *
     * @param arr the array to filter
     * @param scope the closure to apply the function to, with the syntax defined by the ecmascript functionality
     * function (element<,key, array>)
     * <p />
     * additional params
     * <ul>
     *  <li> startPos (optional) the starting position</li>
     *  <li> scope (optional) the scope to apply the closure to</li>
     * </ul>
     */
    arrFilter<T>(arr: any, callbackfn: (value: T, index?: number, array?: T[]) => boolean, startPos ?: number, scope ?: Function) {
        if (!arr || !arr.length) return [];
        let arrFinal = this.objToArray<T>(arr);
        return ((startPos) ? arrFinal.slice(startPos).filter(callbackfn, scope) : arrFinal.filter(callbackfn, scope));
    }

    /**
     * helper to automatically apply a delivered arguments map or array
     * to its destination which has a field "_"<key> and a full field
     *
     * @param dest the destination object
     * @param args the arguments array or map
     * @param argNames the argument names to be transferred
     */
    /**
     * helper to automatically apply a delivered arguments map or array
     * to its destination which has a field "_"<key> and a full field
     *
     * @param dest the destination object
     * @param args the arguments array or map
     * @param argNames the argument names to be transferred
     */
    applyArgs<T>(dest: any, args: { [key: string]: T } | Array<T>, argNames?: Array<string>): any {
        let UDEF = 'undefined';
        if (argNames) {
            for (let cnt = 0; cnt < (<Array<T>>args).length; cnt++) {
                //dest can be null or 0 hence no shortcut
                if (UDEF != typeof dest["_" + argNames[cnt]]) {
                    dest["_" + argNames[cnt]] = args[cnt];
                }
                if (UDEF != typeof dest[argNames[cnt]]) {
                    dest[argNames[cnt]] = args[cnt];
                }
            }
        } else {
            for (let key in args) {
                if (!args.hasOwnProperty(key)) continue;
                if (UDEF != typeof dest["_" + key]) {
                    dest["_" + key] = args[key];
                }
                if (UDEF != typeof dest[key]) {
                    dest[key] = args[key];
                }
            }
        }
        return dest;
    }

    /**
     * transforms a key value pair into a string
     * @param key the key
     * @param val the value
     * @param delimiter the delimiter
     */
    keyValToStr(key: string, val: string, delimiter ?: string) {
        let ret = [];
        ret.push(key);
        ret.push(val);
        let finalDelimiter = delimiter || "\n";
        ret.push(finalDelimiter);
        return ret.join("");
    }

    parseXML(txt: string): Optional<Node> {
        try {
            let parser = new DOMParser();
            return Optional.fromNullable(parser.parseFromString(txt, "text/xml"));
        } catch (e) {
            //undefined internal parser error
            return Optional.absent;
        }
    }

    serializeXML(xmlNode: Node | CDATASection, escape?: boolean): string {
        if (!escape) {
            if ((<CDATASection>xmlNode).data) return (<CDATASection>xmlNode).data; //CDATA block has raw data
            if (xmlNode.textContent) return xmlNode.textContent; //textNode has textContent
        }
        return (new XMLSerializer()).serializeToString(xmlNode);
    }

    serializeChilds(xmlNode: Node): string {
        let buffer = [];
        if (!xmlNode.childNodes) return "";
        for (let cnt = 0; cnt < xmlNode.childNodes.length; cnt++) {
            buffer.push(this.serializeXML(xmlNode.childNodes[cnt]));
        }
        return buffer.join("");
    }

    isXMLParseError(xmlContent: Node): boolean {
        //no xml content
        if (xmlContent == null) return true;
        let findParseError = function (node) {
            if (!node || !node.childNodes) return false;
            for (let cnt = 0; cnt < node.childNodes.length; cnt++) {
                let childNode = node.childNodes[cnt];
                if (childNode.tagName && childNode.tagName == "parsererror") return true;
            }
            return false;
        };


        return !xmlContent ||
            ((<any>xmlContent).parseError && (<any>xmlContent).parserError.errorCode) || findParseError(xmlContent);
    }

    /**
     * determines the correct event depending
     * on the browsers state
     *
     * @param evt incoming event object (note not all browsers
     * have this)
     *
     * @return an event object no matter what is incoming
     */
    getEvent(evt: Event): Event {
        let retVal: Event = (!evt) ? window.event || <Event>{} : evt;
        return retVal;
    }

    /**
     * cross port from the dojo lib
     * browser save event resolution
     * @param evt the event object
     * (with a fallback for ie events if none is present)
     */
    getEventTarget(evt: Event): Event {
        //ie6 and 7 fallback
        evt = this.getEvent(evt);
        /**
         * evt source is defined in the jsf events
         * seems like some component authors use our code
         * so we add it here see also
         * https://issues.apache.org/jira/browse/MYFACES-2458
         * not entirely a bug but makes sense to add this
         * behavior. I dont use it that way but nevertheless it
         * does not break anything so why not
         * */
        let t = evt.srcElement || evt.target || (<any>evt).source || null;
        while ((t) && (t.nodeType != 1)) {
            t = t.parentNode;
        }
        return t;
    }

    /**
     * equalsIgnoreCase, case insensitive comparison of two strings
     *
     * @param source
     * @param destination
     */
    equalsIgnoreCase(source: string, destination: string): boolean {
        //either both are not set or null
        if (!source && !destination) {
            return true;
        }
        //source or dest is set while the other is not
        if (!source || !destination) return false;
        //in any other case we do a strong string comparison
        return source.toLowerCase() === destination.toLowerCase();
    }

    fetchXMLErrorMessage(text: string, xmlContent: Node): Optional<XMLErrorMessage> {

        let findParseError = (node: Node): Optional<XMLErrorMessage> => {
            if (!node || !node.childNodes) return null;
            for (let cnt = 0; cnt < node.childNodes.length; cnt++) {
                let childNode = node.childNodes[cnt];
                if ((<any>childNode).tagName && (<any>childNode).tagName == "parsererror") {
                    let errorMessage = this.serializeXML(childNode.childNodes[0]);
                    //we now have to determine the row and column position
                    let lastLineArr: string[] = errorMessage.split("\n");
                    let lastLine = lastLineArr[lastLineArr.length - 1];
                    let positions = lastLine.match(/[^0-9]*([0-9]+)[^0-9]*([0-9]+)[^0-9]*/);

                    let retVal = new XMLErrorMessage(errorMessage, -1, -1, this.serializeXML(childNode.childNodes[1].childNodes[0]));


                    if (positions) {
                        retVal.line = Math.max(0, parseInt(positions[1]) - 1);
                        retVal.linePos = Math.max(0, parseInt(positions[2]) - 1);
                    }


                    return Optional.fromNullable(retVal);
                }
            }
            return Optional.absent;
        };


        let retVal = Optional.fromNullable(new XMLErrorMessage("", -1, -1, ""));

        let xmlNode: Optional<XMLContent> = Optional.fromNullable(<XMLContent> xmlContent);

        if (!xmlContent) {
            //chrome does not deliver any further data
            retVal = Optional.fromNullable((this.trim(text || "").length > 0) ? this.applyArgs(retVal.value, {
                errorMessage: "Illegal response",
                sourceText: ""
            }) : this.applyArgs(retVal, {errorMessage: "Empty Response", sourceText: ""}));
        } else if (xmlNode.getIf("parseError", "errorCode").isPresent()) {
            retVal = Optional.fromNullable(this.applyArgs(retVal.value, {
                errorMessage: xmlNode.value.parseError.reason,
                line: Math.max(0, xmlNode.value.parseError.line - 1),
                linePos: Math.max(0, xmlNode.value.parseError.linepos - 1),
                sourceText: xmlNode.value.parseError.srcText
            }));
        } else {
            retVal = findParseError(xmlContent);
        }
        //we have a line number we now can format the source accordingly
        if (retVal.getIf("line").isPresent()) {
            let source = retVal.value.sourceText || "";
            let sourceArr = source.split("\n");
            if (sourceArr.length - 1 < retVal.value.line) return retVal;
            source = sourceArr[retVal.value.line];
            let secondLine: string[] = [];
            let lineLen = (retVal.value.linePos - 2);
            for (let cnt = 0; cnt < lineLen; cnt++) {
                secondLine.push(" ");
            }
            secondLine.push("^^");
            retVal.value.sourceText = source;
            retVal.value.visualError = secondLine.join("");
        }
        return retVal;
    }


    /**
     * creates a neutral form data wrapper over an existing form Data element
     * the wrapper delegates following methods, append
     * and adds makeFinal as finalizing method which returns the final
     * send representation of the element
     *
     * @param formData an array
     */
    createFormDataDecorator(formData: any): FormDataDecorator {
        //we simulate the dom level 2 form element here
        let bufInstance: FormDataDecorator = null;

        if (formData instanceof Array) {
            bufInstance = new FormDataDecoratorArray(formData);
        } else if (this.isString(formData)) {
            bufInstance = new FormDataDecoratorString(<string>formData);
        } else {
            bufInstance = new FormDataDecoratorOther(formData);
        }
        return bufInstance;
    }


    /**
     * creates an exeption with additional internal parameters
     * for extra information
     *
     * @param {String} title the exception title
     * @param {String} name  the exception name
     * @param {String} callerCls the caller class
     * @param {String} callFunc the caller function
     * @param {String} message the message for the exception
     */
    makeException(error: Error, title: string, name: string, callerCls: string, callFunc: string, message: string): JSFErrorData {
        return new JSFErrorData(name || "clientError", title || "", message || "",
            new MyFacesErrorData(name || "clientError", title || "clientError", callerCls || this.nameSpace, callFunc || ("" + (<any>arguments).caller.toString()))
        );

    }

    /*
     * Promise wrappers for timeout and interval
     */
    timeout(timeout: number): CancellablePromise {
        let handler: number = null;
        return new CancellablePromise((apply: Function, reject: Function) => {
            handler = setTimeout(() => {
                apply();
            }, timeout)
        }, () => {
            if (handler) {
                clearTimeout(handler);
                handler = null;
            }
        });
    }



    interval(timeout: number): CancellablePromise {
        let handler: number = null;
        return new CancellablePromise((apply: Function, reject: Function) => {
            handler = setInterval(() => {
                apply();
            }, timeout)
        }, () => {
            if (handler) {
                clearInterval(handler);
                handler = null;
            }
        });
    }


    /**
     * fetches a global config entry
     * @param {String} configName the name of the configuration entry
     * @param {Object} defaultValue
     *
     * @return either the config entry or if none is given the default value
     */
    public getGlobalConfig(configName: string, defaultValue: string): string {
        /**
         * note we could use exists but this is an heavy operation, since the config name usually
         * given this function here is called very often
         * is a single entry without . in between we can do the lighter shortcut
         */
        var myfaces = Config.fromNullable(<any>window);
        return myfaces.getIf("myfaces", "config", configName).get(defaultValue).value;
    }

    /**
     * gets the local or global options with local ones having higher priority
     * if no local or global one was found then the default value is given back
     *
     * @param {String} configName the name of the configuration entry
     * @param {String} localOptions the local options root for the configuration myfaces as default marker is added implicitely
     *
     * @param {Object} defaultValue
     *
     * @return either the config entry or if none is given the default value
     */
    public getLocalOrGlobalConfig(localOptions: Config, configName: string, defaultValue: any): any {
        /*use(myfaces._impl._util)*/
        let local = Config.fromNullable(localOptions);
        let global = Config.fromNullable(window);

        let MYFACES = "myfaces";
        let CONFIG = "config";

        //we use a monadic structure here to have a more readable code for accessing the config values
        //it either is a <local>myfaces.config.<configName> value or window.myfaces.config.<configName> or a default value

        return local.getIf(MYFACES, CONFIG, configName).get(global.getIf(MYFACES, CONFIG, configName)).get(defaultValue).value;
    };

    /**
     * (re)inits the currently installed
     * messages so that after loading the main scripts
     * a new locale can be installed optionally
     * to our i18n subsystem
     *
     * @param newLocale locale override
     */
    private initLocale(newLocale ?: any) {
        if (newLocale) {
            this.installedLocale = new newLocale();
            return;
        }

        let language: string = this.language;
        let languageClass = (language) ? Lang.LANGUAGE_MAPS[language] : Messages;
        languageClass = (languageClass) ? languageClass : Messages;

        this.installedLocale = new languageClass();
    }

    private get language(): string {
        //TODO global config override

        let language: string = ("undefined" != typeof (<any>navigator).languages) ? (<any>navigator).languages[0] : navigator.language;
        language = language.split("-")[0];
        return language;
    }






}