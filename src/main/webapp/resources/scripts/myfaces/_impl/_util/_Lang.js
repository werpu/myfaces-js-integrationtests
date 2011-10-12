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


/*
 theoretically we could save some code
 by
 defining the parent object as
 var parent = new Object();
 parent.prototype = new myfaces._impl.core._Runtime();
 extendClass(function () {
 }, parent , {
 But for now we are not doing it the little bit of saved
 space is not worth the loss of readability
 */


/**
 * @memberOf myfaces._impl
 * @namespace
 * @name _util
 */



/**
 * @class
 * @name _Lang
 * @memberOf myfaces._impl._util
 * @extends myfaces._impl.core._Runtime
 * @namespace
 * @description Object singleton for Language related methods, this object singleton
 * decorates the namespace myfaces._impl.core._Runtime and adds a bunch of new methods to
 * what _Runtime provided
 * */
var _Lang = myfaces._impl.core._Runtime.singletonDelegateObj("myfaces._impl._util._Lang", myfaces._impl.core._Runtime,
        /**
         * @lends myfaces._impl._util._Lang.prototype
         */
        {

    _processedExceptions: {},

    _installedLocale: null,

    /**
     * returns a given localized message upon a given key
     * basic java log like templating functionality is included
     *
     * @param {String} key the key for the message
     * @param {String} optional default message if none was found
     *
     * Additionally you can pass additional arguments, which are used
     * in the same way java log templates use the params
     *
     * @param key
     */
    getMessage: function(key, defaultMessage /*,vararg templateParams*/) {
        if(!this._installedLocale) {
            //we first try to install language and variant, if that one fails
            //we try to install the language only, and if that one fails
            //we install the base messages
            this.initLocale();
        }

        var msg = this._installedLocale[key] || defaultMessage || key + " - undefined message";
        for(var cnt = 2; cnt < arguments.length; cnt++) {
          msg = msg.replace(new RegExp(["\\{",cnt-2,"\\}"].join(""),"g"),new String(arguments[cnt]));   
        }
        return msg;
    },

    /**
     * (re)inits the currently installed
     * messages so that after loading the main scripts
     * a new locale can be installed optionally
     * to our i18n subsystem
     *
     * @param newLocale locale override 
     */
    initLocale: function(newLocale) {
        if(newLocale) {
            this._installedLocale = new newLocale();
            return;
        }
        var language_Variant = this._callDelegate("getLanguage", this._callDelegate("getGlobalConfig","locale")); 
        var langStr = language_Variant ? language_Variant.language:"";
        var variantStr = language_Variant ? [language_Variant.language,"_",language_Variant.variant||""].join(""):"";

        var i18nRoot = myfaces._impl.i18n;
        var i18nHolder = i18nRoot["Messages_"+variantStr] ||
                         i18nRoot["Messages_"+langStr]    ||
                         i18nRoot.Messages;

        this._installedLocale = new i18nHolder();
    },


    isExceptionProcessed: function(e) {
        return !! this._processedExceptions[e.toString()];
    },

    setExceptionProcessed: function(e) {
        this._processedExceptions[e.toString()] = true;
    },

    clearExceptionProcessed: function() {
        //ie again
        for (var key in this._processedExceptions) {
            this._processedExceptions[key] = null;
        }
        this._processedExceptions = {};
    },

    fetchNamespace : function(namespace) {
        if (!namespace || !this.isString(namespace)) {
            throw Error(this.getMessage("ERR_MUST_STRING",null,"_Lang.fetchNamespace","namespace"));
        }
        return this._callDelegate("fetchNamespace", namespace);
    },

    reserveNamespace : function(namespace) {
        if (!this.isString(namespace)) {
            throw Error(this.getMessage("ERR_MUST_STRING",null,"_Lang.reserveNamespace", "namespace"));
        }
        return this._callDelegate("reserveNamespace", namespace);
    },

    globalEval : function(code) {
        if (!this.isString(code)) {
            throw Error(this.getMessage("ERR_MUST_STRING",null,"_Lang.globalEval", "code"));
        }
        return this._callDelegate("globalEval", code);
    },


    /**
     * determines the correct event depending
     * on the browsers state
     *
     * @param evt incoming event object (note not all browsers
     * have this)
     *
     * @return an event object no matter what is incoming
     */
    getEvent: function(evt) {
        evt = (!evt) ? window.event || {} : evt;
        return evt;
    },

    /**
     * cross port from the dojo lib
     * browser save event resolution
     * @param evt the event object
     * (with a fallback for ie events if none is present)
     */
    getEventTarget: function(evt) {
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
        var t = evt.srcElement || evt.target || evt.source || null;
        while ((t) && (t.nodeType != 1)) {
            t = t.parentNode;
        }
        return t;
    },

    /**
     * consume event in a browser independend manner
     * @param event the event which should not be propagated anymore
     */
    consumeEvent: function(event) {
        //w3c model vs ie model again
        event = event || window.event;
        (event.stopPropagation) ? event.stopPropagation() : event.cancelBubble = true;
    },

    /**
     * equalsIgnoreCase, case insensitive comparison of two strings
     *
     * @param source
     * @param destination
     */
    equalsIgnoreCase: function(source, destination) {
        //either both are not set or null
        if (!source && !destination) {
            return true;
        }
        //source or dest is set while the other is not
        if (!source || !destination) return false;

        //in any other case we do a strong string comparison
        return source.toLowerCase() === destination.toLowerCase();
    },

    /**
     * escapes a strings special chars (crossported from dojo 1.3+)
     *
     * @param str the string
     *
     * @param except a set of exceptions
     */
    escapeString: function(/*String*/str, /*String?*/except) {
        //	summary:
        //		Adds escape sequences for special characters in regular expressions
        // except:
        //		a String with special characters to be left unescaped

        return str.replace(/([\.$?*|:{}\(\)\[\]\\\/\+^])/g, function(ch) {
            if (except && except.indexOf(ch) != -1) {
                return ch;
            }
            return "\\" + ch;
        }); // String
    },

    /**
     @see this._RT.extendClass
     */
    /*extendClass : function(newClass, extendsClass, functionMap, inherited) {
     return this._RT.extendClass(newClass, extendsClass, functionMap, inherited);
     },*/

    //core namespacing and inheritance done, now to the language extensions

    /**
     * Save document.getElementById (this code was ported over from dojo)
     * the idea is that either a string or domNode can be passed
     * @param {Object} reference the reference which has to be byIded
     */
    byId : function(/*object*/ reference) {
        if (!reference) {
            throw Error(this.getMessage("ERR_REF_OR_ID",null,"_Lang.byId","reference"));
        }
        return (this.isString(reference)) ? document.getElementById(reference) : reference;
    },

    /**
     * Helper function to provide a trim with a given splitter regular expression
     * @param {String} it the string to be trimmed
     * @param {RegExp} splitter the splitter regular expressiion
     *
     * FIXME is this still used?
     */
    trimStringInternal : function(it, splitter) {
        return this.strToArray(it, splitter).join(splitter);
    },

    /**
     * String to array function performs a string to array transformation
     * @param {String} it the string which has to be changed into an array
     * @param {RegExp} splitter our splitter reglar expression
     * @return an array of the splitted string
     */
    strToArray : function(/*string*/ it, /*regexp*/ splitter) {
        //	summary:
        //		Return true if it is a String

        if (!this.isString(it)) {
            throw Error(this.getMessage("ERR_PARAM_STR",null, "myfaces._impl._util._Lang.strToArray", "it"));
        }
        if (!splitter) {
            throw Error(this.getMessage("ERR_PARAM_STR_RE",null, "myfaces._impl._util._Lang.strToArray", "splitter"));
        }
        var retArr = it.split(splitter);
        var len = retArr.length;
        for (var cnt = 0; cnt < len; cnt++) {
            retArr[cnt] = this.trim(retArr[cnt]);
        }
        return retArr;
    },

    /**
     * hyperfast trim
     * http://blog.stevenlevithan.com/archives/faster-trim-javascript
     * crossported from dojo
     */
    trim : function(/*string*/ str) {
        if (!this.isString(str)) {
            throw Error(this.getMessage("ERR_PARAM_STR",null,"_Lang.trim", "str"));
        }
        str = str.replace(/^\s\s*/, '');
        var ws = /\s/;
        var i = str.length;
        while (ws.test(str.charAt(--i))){
            //do nothing
        }
        return str.slice(0, i + 1);
    },

    /**
     * Backported from dojo
     * a failsafe string determination method
     * (since in javascript String != "" typeof alone fails!)
     * @param it {|Object|} the object to be checked for being a string
     * @return true in case of being a string false otherwise
     */
    isString: function(/*anything*/ it) {
        //	summary:
        //		Return true if it is a String
        return !!arguments.length && it != null && (typeof it == "string" || it instanceof String); // Boolean
    },
    /**
     * hitch backported from dojo
     * hitch allows to assign a function to a dedicated scope
     * this is helpful in situations when function reassignments
     * can happen
     * (notably happens often in lazy xhr code)
     *
     * @param {Function} scope of the function to be executed in
     * @param {Function} method to be executed
     *
     * @return whatevery the executed method returns
     */
    hitch : function(/*Object*/scope, /*Function|String*/method /*,...*/) {
        //	summary:
        //		Returns a function that will only ever execute in the a given scope.
        //		This allows for easy use of object member functions
        //		in callbacks and other places in which the "this" keyword may
        //		otherwise not reference the expected scope.
        //		Any number of default positional arguments may be passed as parameters
        //		beyond "method".
        //		Each of these values will be used to "placehold" (similar to curry)
        //		for the hitched function.
        //	scope:
        //		The scope to use when method executes. If method is a string,
        //		scope is also the object containing method.
        //	method:
        //		A function to be hitched to scope, or the name of the method in
        //		scope to be hitched.
        //	example:
        //	|	myfaces._impl._util._Lang.hitch(foo, "bar")();
        //		runs foo.bar() in the scope of foo
        //	example:
        //	|	myfaces._impl._util._Lang.hitch(foo, myFunction);
        //		returns a function that runs myFunction in the scope of foo
        if (arguments.length > 2) {
            return this._hitchArgs._hitchArgs.apply(this._hitchArgs, arguments); // Function
        }
        if (!method) {
            method = scope;
            scope = null;
        }
        if (this.isString(method)) {
            scope = scope || window || function() {
            };
            /*since we do not have dojo global*/
            if (!scope[method]) {
                throw(['myfaces._impl._util._Lang: scope["', method, '"] is null (scope="', scope, '")'].join(''));
            }
            return function() {
                return scope[method].apply(scope, arguments || []);
            }; // Function
        }
        return !scope ? method : function() {
            return method.apply(scope, arguments || []);
        }; // Function
    }
    ,

    _hitchArgs : function(scope, method /*,...*/) {
        var pre = this.objToArray(arguments, 2);
        var named = this.isString(method);
        return function() {
            // array-fy arguments
            var args = this.objToArray(arguments);
            // locate our method
            var f = named ? (scope || this.global)[method] : method;
            // invoke with collected args
            return f && f.apply(scope || this, pre.concat(args)); // mixed
        }; // Function
    }
    ,

    /**
     * Helper function to merge two maps
     * into one
     * @param {Object} dest the destination map
     * @param {Object} src the source map
     * @param {boolean} overwrite if set to true the destination is overwritten if the keys exist in both maps
     **/
    mixMaps: function(dest, src, overwrite, blockFilter, whitelistFilter) {
      if (!dest || !src) {
            throw Error(this.getMessage("ERR_PARAM_MIXMAPS",null,"_Lang.mixMaps"));
      }
      var _undef = "undefined";
      for (var key in src) {
         if(blockFilter && blockFilter[key]) {
            continue;
         }
         if(whitelistFilter && !whitelistFilter[key]) {
            continue;
         }
         if (!overwrite) {

                /**
                 *we use exists instead of booleans because we cannot rely
                 *on all values being non boolean, we would need an elvis
                 *operator in javascript to shorten this :-(
                 */
                dest[key] = (_undef != typeof dest[key]) ? dest[key] : src[key];
            } else {
                dest[key] = (_undef != typeof src[key]) ? src[key] : dest[key];
            }
      }
        return dest;
    },

    /**
     * checks if an array contains an element
     * @param {Array} arr   array
     * @param {String} str string to check for
     */
    contains : function(arr, str) {
        if (!arr || !str) {
            throw Error(this.getMessage("ERR_MUST_BE_PROVIDED",null,"_Lang.contains", "arr {array}", "str {string}"));
        }

        for (var cnt = 0; cnt < arr.length; cnt++) {
            if (arr[cnt] == str) {
                return true;
            }
        }
        return false;
    }
    ,


    arrToMap: function(arr, offset) {
        var ret = new Array(arr.length);
        var len = arr.length;
        offset = (offset) ? offset : 0;

        for (var cnt = 0; cnt < len; cnt++) {
            ret[arr[cnt]] = cnt + offset;
        }

        return ret;
    },

    /**
     * Concatenates an array to a string
     * @param {Array} arr the array to be concatenated
     * @param {String} delimiter the concatenation delimiter if none is set \n is used
     *
     * @return the concatenated array, one special behavior to enable j4fry compatibility has been added
     * if no delimiter is used the [entryNumber]+entry is generated for a single entry
     * TODO check if this is still needed it is somewhat outside of the scope of the function
     * and functionality wise dirty
     */
    arrToString : function(/*String or array*/ arr, /*string*/ delimiter) {
        if (!arr) {
            throw Error(this.getMessage("ERR_MUST_BE_PROVIDED1",null, "arr {array}"));
        }
        if (this.isString(arr)) {
            return arr;
        }

        delimiter = delimiter || "\n";
        return arr.join(delimiter);
    }
    ,


    objToArray: function(obj, offset, pack) {
        if (!obj) {
            return null;
        }
        //since offset is numeric we cannot use the shortcut due to 0 being false
        var finalOffset = ('undefined' != typeof offset || null != offset) ? offset : 0;
        var finalPack = pack || [];
        try {
            return finalPack.concat(Array.prototype.slice.call(obj, finalOffset));
        } catch (e) {
            //ie8 (again as only browser) delivers for css 3 selectors a non convertible object
            //we have to do it the hard way
            //ie8 seems generally a little bit strange in its behavior some
            //objects break the function is everything methodology of javascript
            //and do not implement apply call, or are pseudo arrays which cannot
            //be sliced
            for (var cnt = finalOffset; cnt < obj.length; cnt++) {
                finalPack.push(obj[cnt]);
            }
            return finalPack;
        }

    }
    ,

    /**
     * foreach implementation utilizing the
     * ECMAScript wherever possible
     * with added functionality
     *
     * @param arr the array to filter
     * @param func the closure to apply the function to, with the syntax defined by the ecmascript functionality
     * function (element<,key, array>)
     * <p />
     * optional params
     * <p />
     * <ul>
     *      <li>param startPos (optional) the starting position </li>
     *      <li>param scope (optional) the scope to apply the closure to  </li>
     * </ul>
     */
    arrForEach: function(arr, func /*startPos, scope*/) {
        if(!arr || !arr.length ) return;
        try {
            var startPos = Number(arguments[2]) || 0;
            var thisObj = arguments[3];

            //check for an existing foreach mapping on array prototypes
            //IE9 still does not pass array objects as result for dom ops
            if (Array.prototype.forEach && arr.forEach) {
                (startPos) ? arr.slice(startPos).forEach(func, thisObj) : arr.forEach(func, thisObj);
            } else {
                startPos = (startPos < 0) ? Math.ceil(startPos) : Math.floor(startPos);
                if (typeof func != "function") {
                    throw new TypeError();
                }
                for (var cnt = 0; cnt < arr.length; cnt++) {
                    if (thisObj) {
                        func.call(thisObj, arr[cnt], cnt, arr);
                    } else {
                        func(arr[cnt], cnt, arr);
                    }
                }
            }
        } finally {
            func = null;
        }
    }
    ,


    /**
     * foreach implementation utilizing the
     * ECMAScript wherever possible
     * with added functionality
     *
     * @param arr the array to filter
     * @param func the closure to apply the function to, with the syntax defined by the ecmascript functionality
     * function (element<,key, array>)
     * <p />
     * additional params
     * <ul>
     *  <li> startPos (optional) the starting position</li>
     *  <li> scope (optional) the scope to apply the closure to</li>
     * </ul>
     */
    arrFilter: function(arr, func /*startPos, scope*/) {
        if(!arr || !arr.length ) return [];
        try {
            var startPos = Number(arguments[2]) || 0;
            var thisObj = arguments[3];

            //check for an existing foreach mapping on array prototypes
            if (Array.prototype.filter) {
                return ((startPos) ? arr.slice(startPos).filter(func, thisObj) : arr.filter(func, thisObj));
            } else {
                if (typeof func != "function") {
                    throw new TypeError();
                }
                var ret = [];
                startPos = (startPos < 0) ? Math.ceil(startPos) : Math.floor(startPos);

                for (var cnt = startPos; cnt < arr.length; cnt++) {
                    var elem = null;
                    if (thisObj) {
                        elem = arr[cnt];
                        if (func.call(thisObj, elem, cnt, arr)) ret.push(elem);
                    } else {
                        elem = arr[cnt];
                        if (func(arr[cnt], cnt, arr)) ret.push(elem);
                    }
                }
            }
        } finally {
            func = null;
        }
    }
    ,

    /**
     * adds a EcmaScript optimized indexOf to our mix,
     * checks for the presence of an indexOf functionality
     * and applies it, otherwise uses a fallback to the hold
     * loop method to determine the index
     *
     * @param arr the array
     * @param element the index to search for
     */
    arrIndexOf: function(arr, element /*fromIndex*/) {
        if (!arr || !arr.length) return -1;
        var pos = Number(arguments[2]) || 0;

        if (Array.prototype.indexOf) {
            return arr.indexOf(element, pos);
        }
        //var cnt = this._space;
        var len = arr.length;
        pos = (pos < 0) ? Math.ceil(pos) : Math.floor(pos);

        //if negative then it is taken from as offset from the length of the array
        if (pos < 0) {
            pos += len;
        }
        while (pos < len && arr[pos] !== element) {
            pos++;
        }
        return (pos < len) ? pos : -1;
    }
    ,


    /**
     * helper to automatically apply a delivered arguments map or array
     * to its destination which has a field "_"<key> and a full field
     *
     * @param dest the destination object
     * @param args the arguments array or map
     * @param argNames the argument names to be transferred
     */
    applyArgs: function(dest, args, argNames) {
        var _undef = 'undefined';
        if (argNames) {
            for (var cnt = 0; cnt < args.length; cnt++) {
                //dest can be null or 0 hence no shortcut
                if (_undef != typeof dest["_" + argNames[cnt]]) {
                    dest["_" + argNames[cnt]] = args[cnt];
                }
                if (_undef != typeof dest[ argNames[cnt]]) {
                    dest[argNames[cnt]] = args[cnt];
                }
            }
        } else {
            for (var key in args) {
                if (_undef != typeof dest["_" + key]) {
                    dest["_" + key] = args[key];
                }
                if (_undef != typeof dest[key]) {
                    dest[key] = args[key];
                }
            }
        }
    }
    ,
    /**
     * creates a standardized error message which can be reused by the system
     *
     * @param sourceClass the source class issuing the exception
     * @param func the function issuing the exception
     * @param error the error object itself (optional)
     */
    createErrorMsg: function(sourceClass, func, error) {
        var ret = [];

        var keyValToStr = this.keyValToStr;
        ret.push(keyValToStr(this.getMessage("MSG_AFFECTED_CLASS"), sourceClass));
        ret.push(keyValToStr(this.getMessage("MSG_AFFECTED_METHOD"), func));

        if (error) {
            var _UDEF = "undefined";

            ret.push(keyValToStr(this.getMessage("MSG_ERROR_NAME"), error.name ? error.name : _UDEF));
            ret.push(keyValToStr(this.getMessage("MSG_ERROR_MESSAGE"), error.message ? error.message : _UDEF));
            ret.push(keyValToStr(this.getMessage("MSG_ERROR_DESC"), error.description ? error.description : _UDEF));
            ret.push(keyValToStr(this.getMessage("MSG_ERROR_NO"), _UDEF != typeof error.number ? error.number : _UDEF));
            ret.push(keyValToStr(this.getMessage("MSG_ERROR_LINENO"), _UDEF != typeof error.lineNumber ? error.lineNumber : _UDEF));
        }
        return ret.join("");
    }
    ,

    /**
     * transforms a key value pair into a string
     * @param key the key
     * @param val the value
     * @param delimiter the delimiter
     */
    keyValToStr: function(key, val, delimiter) {
        var ret = [];
        ret.push(key);
        ret.push(val);
        if ('undefined' == typeof delimiter) {
            delimiter = "\n";
        }
        ret.push(delimiter);
        return ret.join("");
    }
    ,


    parseXML: function(txt) {
        try {
            var parser = null, xmlDoc = null;
            if (window.DOMParser) {
                parser = new DOMParser();
                xmlDoc = parser.parseFromString(txt, "text/xml");
            }
            else // Internet Explorer
            {
                xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                xmlDoc.async = "false";
                xmlDoc.loadXML(txt);
            }
            return xmlDoc;
        } catch (e) {
            //undefined internal parser error
            return null;
        }
    }
    ,

    serializeXML: function(xmlNode, escape) {
        if (xmlNode.xml) return xmlNode.xml; //IE
        if(!escape) {
            if (xmlNode.data) return xmlNode.data; //CDATA block has raw data
            if (xmlNode.textContent) return xmlNode.textContent; //textNode has textContent
        }
        return (new XMLSerializer()).serializeToString(xmlNode);
    },

    serializeChilds: function(xmlNode) {
        var buffer = [];
        if (!xmlNode.childNodes) return "";
        for (var cnt = 0; cnt < xmlNode.childNodes.length; cnt++) {
            buffer.push(this.serializeXML(xmlNode.childNodes[cnt]));
        }
        return buffer.join("");
    }
    ,
    isXMLParseError: function(xmlContent) {

        //no xml content
        if (xmlContent == null) return true;

        var findParseError = function(node) {
            if (!node || !node.childNodes) return false;
            for (var cnt = 0; cnt < node.childNodes.length; cnt++) {
                var childNode = node.childNodes[cnt];
                if (childNode.tagName && childNode.tagName == "parsererror") return true;
            }
            return false;
        };
        return !xmlContent ||
                (this.exists(xmlContent, "parseError.errorCode") && xmlContent.parseError.errorCode != 0) ||
                findParseError(xmlContent);


    }
    ,
    /**
     * creates a neutral form data wrapper over an existing form Data element
     * the wrapper delegates following methods, append
     * and adds makeFinal as finalizing method which returns the final
     * send representation of the element
     *
     * @param formData an array
     */
    createFormDataDecorator: function(formData) {
        //we simulate the dom level 2 form element here
        var _newCls = null;
        var bufInstance = null;

        if (!this.FormDataDecoratorArray) {
            this.FormDataDecoratorArray = function (theFormData) {
                this._valBuf = theFormData;
                this._idx = {};
            };
            _newCls = this.FormDataDecoratorArray;
            _newCls.prototype.append = function(key, val) {
                this._valBuf.push([encodeURIComponent(key), encodeURIComponent(val)].join("="));
                this._idx[key] = true;
            };
            _newCls.prototype.hasKey = function(key) {
                return !!this._idx[key];
            };
            _newCls.prototype.makeFinal = function() {
                return this._valBuf.join("&");
            };

        }
        if (!this.FormDataDecoratorString) {
            this.FormDataDecoratorString = function (theFormData) {
                this._preprocessedData = theFormData;
                this._valBuf = [];
                this._idx = {};

            };
            _newCls = this.FormDataDecoratorString;
            _newCls.prototype.append = function(key, val) {
                this._valBuf.push([encodeURIComponent(key), encodeURIComponent(val)].join("="));
                this._idx[key] = true;
            };
            //for now we check only for keys which are added subsequently otherwise we do not perform any checks
            _newCls.prototype.hasKey = function(key) {
                return !!this._idx[key];
            };
            _newCls.prototype.makeFinal = function() {
                if(this._preprocessedData != "") {
                  return this._preprocessedData + "&"+ this._valBuf.join("&")
                } else {
                  return this._valBuf.join("&");
                }
            };
        }
        if (!this.FormDataDecoratorOther) {
            this.FormDataDecoratorOther = function (theFormData) {
                this._valBuf = theFormData;
                this._idx = {};
            };
            _newCls = this.FormDataDecoratorOther;
            _newCls.prototype.append = function(key, val) {
                this._valBuf.append(key, val);
                this._idx[key] = true;
            };
            _newCls.prototype.hasKey = function(key) {
                return !!this._idx[key];
            };
            _newCls.prototype.makeFinal = function() {
                return this._valBuf;
            };
        }

        if (formData instanceof Array) {
            bufInstance = new this.FormDataDecoratorArray(formData);
        } else if(this.isString(formData)) {
            bufInstance = new this.FormDataDecoratorString(formData);
        } else {
            bufInstance = new this.FormDataDecoratorOther(formData);
        }

        return bufInstance;
    },

    /*
        ===============================================================================
        Crc32 is a JavaScript function for computing the CRC32 of a string
        ...............................................................................

        Version: 1.2 - 2006/11 - http://noteslog.com/category/javascript/

        -------------------------------------------------------------------------------
        Copyright (c) 2006 Andrea Ercolino
        http://www.opensource.org/licenses/mit-license.php
        ===============================================================================
        */


     table: "00000000 77073096 EE0E612C 990951BA 076DC419 706AF48F E963A535 9E6495A3 0EDB8832 79DCB8A4 E0D5E91E 97D2D988 09B64C2B 7EB17CBD E7B82D07 90BF1D91 1DB71064 6AB020F2 F3B97148 84BE41DE 1ADAD47D 6DDDE4EB F4D4B551 83D385C7 136C9856 646BA8C0 FD62F97A 8A65C9EC 14015C4F 63066CD9 FA0F3D63 8D080DF5 3B6E20C8 4C69105E D56041E4 A2677172 3C03E4D1 4B04D447 D20D85FD A50AB56B 35B5A8FA 42B2986C DBBBC9D6 ACBCF940 32D86CE3 45DF5C75 DCD60DCF ABD13D59 26D930AC 51DE003A C8D75180 BFD06116 21B4F4B5 56B3C423 CFBA9599 B8BDA50F 2802B89E 5F058808 C60CD9B2 B10BE924 2F6F7C87 58684C11 C1611DAB B6662D3D 76DC4190 01DB7106 98D220BC EFD5102A 71B18589 06B6B51F 9FBFE4A5 E8B8D433 7807C9A2 0F00F934 9609A88E E10E9818 7F6A0DBB 086D3D2D 91646C97 E6635C01 6B6B51F4 1C6C6162 856530D8 F262004E 6C0695ED 1B01A57B 8208F4C1 F50FC457 65B0D9C6 12B7E950 8BBEB8EA FCB9887C 62DD1DDF 15DA2D49 8CD37CF3 FBD44C65 4DB26158 3AB551CE A3BC0074 D4BB30E2 4ADFA541 3DD895D7 A4D1C46D D3D6F4FB 4369E96A 346ED9FC AD678846 DA60B8D0 44042D73 33031DE5 AA0A4C5F DD0D7CC9 5005713C 270241AA BE0B1010 C90C2086 5768B525 206F85B3 B966D409 CE61E49F 5EDEF90E 29D9C998 B0D09822 C7D7A8B4 59B33D17 2EB40D81 B7BD5C3B C0BA6CAD EDB88320 9ABFB3B6 03B6E20C 74B1D29A EAD54739 9DD277AF 04DB2615 73DC1683 E3630B12 94643B84 0D6D6A3E 7A6A5AA8 E40ECF0B 9309FF9D 0A00AE27 7D079EB1 F00F9344 8708A3D2 1E01F268 6906C2FE F762575D 806567CB 196C3671 6E6B06E7 FED41B76 89D32BE0 10DA7A5A 67DD4ACC F9B9DF6F 8EBEEFF9 17B7BE43 60B08ED5 D6D6A3E8 A1D1937E 38D8C2C4 4FDFF252 D1BB67F1 A6BC5767 3FB506DD 48B2364B D80D2BDA AF0A1B4C 36034AF6 41047A60 DF60EFC3 A867DF55 316E8EEF 4669BE79 CB61B38C BC66831A 256FD2A0 5268E236 CC0C7795 BB0B4703 220216B9 5505262F C5BA3BBE B2BD0B28 2BB45A92 5CB36A04 C2D7FFA7 B5D0CF31 2CD99E8B 5BDEAE1D 9B64C2B0 EC63F226 756AA39C 026D930A 9C0906A9 EB0E363F 72076785 05005713 95BF4A82 E2B87A14 7BB12BAE 0CB61B38 92D28E9B E5D5BE0D 7CDCEFB7 0BDBDF21 86D3D2D4 F1D4E242 68DDB3F8 1FDA836E 81BE16CD F6B9265B 6FB077E1 18B74777 88085AE6 FF0F6A70 66063BCA 11010B5C 8F659EFF F862AE69 616BFFD3 166CCF45 A00AE278 D70DD2EE 4E048354 3903B3C2 A7672661 D06016F7 4969474D 3E6E77DB AED16A4A D9D65ADC 40DF0B66 37D83BF0 A9BCAE53 DEBB9EC5 47B2CF7F 30B5FFE9 BDBDF21C CABAC28A 53B39330 24B4A3A6 BAD03605 CDD70693 54DE5729 23D967BF B3667A2E C4614AB8 5D681B02 2A6F2B94 B40BBE37 C30C8EA1 5A05DF1B 2D02EF8D",

    /* Number */
    crc32: function( /* String */ str, /* Number */ crc ) {
        if( crc == window.undefined ) crc = 0;
        var n = 0; //a number between 0 and 255
        var x = 0; //an hex number

        crc = crc ^ (-1);
        for( var i = 0, iTop = str.length; i < iTop; i++ ) {
            n = ( crc ^ str.charCodeAt( i ) ) & 0xFF;
            x = "0x" + table.substr( n * 9, 8 );
            crc = ( crc >>> 8 ) ^ x;
        }
        return crc ^ (-1);
    }

});
