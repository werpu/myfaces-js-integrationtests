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

/**
 * @class
 * @name _Transports
 * @memberOf myfaces._impl.xhrCore
 * @description
 *
 * Transports for multipart requests
 * this extends the standard transports with their multipart implementations
 */
_MF_SINGLTN(_PFX_XHR+"_ExtTransports" , myfaces._impl.xhrCore._Transports,
     /** @lends myfaces._impl.xhrCore._Transports.prototype */ {


    constructor_: function() {
        this._callSuper("constructor_");
        myfaces._impl.xhrCore._Transports = this;
        //we change the transport to our new implementation
        this.updateSingletons("transport", this);
    },

    /**
     * a simple not enqueued xhr post
     *
     * mapped options already have the exec and view properly in place
     * myfaces specifics can be found under mappedOptions.myFaces
     * @param {Node} source the source of this call
     * @param {Node} sourceForm the html form which is the source of this call
     * @param {Object} context (Map) the internal pass through context
     * @param {Object} passThrgh (Map) values to be passed through
     **/
    xhrPost : function(source, sourceForm, context, passThrgh) {
        var args = this._getArguments(source, sourceForm, context, passThrgh);
         delete args.xhrQueue;
        (new (this._getAjaxReqClass(context))(args)).send();
    },


    /**
     * xhr get without enqueuing
     *
     * mapped options already have the exec and view properly in place
     * myfaces specifics can be found under mappedOptions.myFaces
     * @param {Node} source the source of this call
     * @param {Node} sourceForm the html form which is the source of this call
     * @param {Object} context (Map) the internal pass through context
     * @param {Object} passThrgh (Map) values to be passed through
     **/
    xhrGet : function(source, sourceForm, context, passThrgh) {
        var args = this._getArguments(source, sourceForm, context, passThrgh);
        // note in get the timeout is not working delay however is and queue size as well
        // since there are no cross browser ways to resolve a timeout on xhr level
        // we have to live with it
        args.ajaxType = "GET";
        delete args.xhrQueue;
        (new (this._getAjaxReqClass(context))(args)).send();
    },

    /**
     * xhr get which takes the existing queue into consideration to by synchronized
     * to previous queued post requests
     *
     * mapped options already have the exec and view properly in place
     * myfaces specifics can be found under mappedOptions.myFaces
     * @param {Node} source the source of this call
     * @param {Node} sourceForm the html form which is the source of this call
     * @param {Object} context (Map) the internal pass through context
     * @param {Object} passThrgh (Map) values to be passed through
     **/
    xhrQueuedGet : function(source, sourceForm, context, passThrgh) {
        var args = this._getArguments(source, sourceForm, context, passThrgh);
        // note in get the timeout is not working delay however is and queue size as well
        // since there are no cross browser ways to resolve a timeout on xhr level
        // we have to live with it
        args.ajaxType = "GET";
        this._q.enqueue(
                new (this._getAjaxReqClass(context))(args));
    },


    /**
     * multipart post without queueing
     *
     * mapped options already have the exec and view properly in place
     * myfaces specifics can be found under mappedOptions.myFaces
     * @param {Node} source the source of this call
     * @param {Node} sourceForm the html form which is the source of this call
     * @param {Object} context (Map) the internal pass through context
     * @param {Object} passThrgh (Map) values to be passed through
     **/
    multipartPost : function(source, sourceForm, context, passThrgh) {
        var args = this._getArguments(source, sourceForm, context, passThrgh);
        // note in get the timeout is not working delay however is and queue size as well
        // since there are no cross browser ways to resolve a timeout on xhr level
        // we have to live with it
        delete args.xhrQueue;
        (new (this._getMultipartReqClass(context))(args)).send();
    },

    /**
     * multipart queued post
     *
     * mapped options already have the exec and view properly in place
     * myfaces specifics can be found under mappedOptions.myFaces
     * @param {Node} source the source of this call
     * @param {Node} sourceForm the html form which is the source of this call
     * @param {Object} context (Map) the internal pass through context
     * @param {Object} passThrgh (Map) values to be passed through
     **/
    multipartQueuedPost : function(source, sourceForm, context, passThrgh) {
        var args = this._getArguments(source, sourceForm, context, passThrgh);
        // note in get the timeout is not working delay however is and queue size as well
        // since there are no cross browser ways to resolve a timeout on xhr level
        this._q.enqueue(
                new (this._getMultipartReqClass(context))(args));
    },

    /**
     * iframe get without queueing
     *
     * mapped options already have the exec and view properly in place
     * myfaces specifics can be found under mappedOptions.myFaces
     * @param {Node} source the source of this call
     * @param {Node} sourceForm the html form which is the source of this call
     * @param {Object} context (Map) the internal pass through context
     * @param {Object} passThrgh (Map) values to be passed through
     **/
    multipartGet : function(source, sourceForm, context, passThrgh) {
        var args = this._getArguments(source, sourceForm, context, passThrgh);
        // note in get the timeout is not working delay however is and queue size as well
        // since there are no cross browser ways to resolve a timeout on xhr level
        // we have to live with it
        args.ajaxType = "GET";
        delete args.xhrQueue;
        (new (this._getMultipartReqClass(context))(args)).send();
    },

    /**
     * multipart queued http get
     *
     * mapped options already have the exec and view properly in place
     * myfaces specifics can be found under mappedOptions.myFaces
     * @param {Node} source the source of this call
     * @param {Node} sourceForm the html form which is the source of this call
     * @param {Object} context (Map) the internal pass through context
     * @param {Object} passThrgh (Map) values to be passed through
     **/
    multipartQueuedGet : function(source, sourceForm, context, passThrgh) {
        var args = this._getArguments(source, sourceForm, context, passThrgh);
        // note in get the timeout is not working delay however is and queue size as well
        // since there are no cross browser ways to resolve a timeout on xhr level
        args.ajaxType = "GET";
        this._q.enqueue(
                new (this._getMultipartReqClass(context))(args));
    }
});
