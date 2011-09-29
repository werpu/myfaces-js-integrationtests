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
 * a basic node wrapper which capsules all needed
 * operations for our node handling.
 *
 * Note the query ops will return the node
 */
myfaces._impl.core._Runtime.extendClass("myfaces._impl._dom._Node", Object, {

    _DOM_UTILS: myfaces._impl._dom._DomUtils,
    _QUERY: myfaces._impl._dom._Query,


    _Lang:  myfaces._impl._util._Lang,
    _RT:    myfaces._impl.core._Runtime,
    _NodeUtils: myfaces._impl._dom._NodeUtils,

    _dummyPlaceHolder:null,


    _id:  null,
    _name: null,

    _referencedNode: null,

    _tagName: null,

    constructor_: function(elem) {
        this._referencedNode = this._DOM_UTILS.byIdOrName(elem);
    },


    isTag: function(name) {
        /*we lazily store the tagName for future references*/
        this._tagName = this._tagName || this._referencedNode.tagName;
        return this._referencedNode.tagName.toLowerCase() == name;
    },

    getId: function() {
        this._id = this._id || this._referencedNode.id;
        return this._id;
    },

    getName: function() {
        this._name = this._name || this._referencedNode.name;
        return this._name;
    },

    nodeIdOrName: function() {
        return this.getId() || this.getName();
    },

    /*purges the given node and all its subelements from the dom tree*/
    purge: function() {
        this._NodeUtils.deleteItem(this._referencedNode);

        this._referencedNode = null;
        this._id = null;
        this._name = null;

    },

    purgeChilds: function() {
        this.childNodes().purge();
    },

    detach: function(items) {
        if (!this._referencedNode.parentNode) {
            return this;
        }
        this._referencedNode = this._referencedNode.parentNode.removeChild(this._referencedNode);
        return this;
    },

    setAttribute: function(attr, val) {
        this._NodeUtils.setAttribute(attr, val);
    },

    outerHTML: function(markup) {
        var ret = this._NodeUtils.outerHTML(markup);
        if (ret.length == 0) return null;
        if (ret.length == 1) {
            return new Node(ret[0]);
        } else {
            return new NodeList(ret[0]);
        }
    },

    innerHTML: function(markup) {
        this._NodeUtils.innerHTML(this._referencedNode, markup);
    },

    childNodes: function() {
        return new NodeList(this._referencedNode.childNodes);
    },

    parentNode: function() {
        return new Node(this._referencedNode.parentNode);
    },

    sibling: function() {
        return new Node(this._referencedNode.sibling);
    },

    siblings: function() {
        return new NodeList(this._referencedNode.siblings);
    },

    isForm: function() {
        return !!document.forms[this._id];
    },

    //now the replacement to all functions we have
    //we simply hook a selector engine in and be done with it
    querySelectorAll: function(query) {
        var Node = myfaces._impl._dom._Node;
        var NodeList = myfaces._impl._dom._NodeList;

        var ret = this._QUERY(query);
        if (!ret) return new NodeList();
        if (ret.length == 1) return new Node(ret);
        return new NodeList(ret);
    },

    querySelector: function(query) {
        var Node = myfaces._impl._dom._Node;

        var ret = this._QUERY(query);
        if (ret) return new Node(ret);
        return null;
    },

    toDomNode: function() {
        return this._referencedNode;
    },

            /**
             * additionalData = {
             *     _evt_type: String
             *     _evt_channel: String
             *     _evt_bubbles: boolean
             *     _evt_cancellable: boolean
             * }
              * @param event
             * @param additionalData
             */
    dispatchEvent: function(event,/*optional*/ additionalData) {
        if(this._Lang.isString(event)) {
            event = document.createEvent(additionalData._evt_type || "HTMLEvents");

            var bubbles = additionalData["_evt_bubbles"] || true;
            var cancellable = additionalData["_evt_cancellable"] || true;
            var channel = additionalData["_evt_channel"] || "global";

            event.additionalData = additionalData;
            event.initEvent(channel, bubbles, cancellable);
        }
        this._referencedNode.dispatchEvent(event);
        return this;
    }
});

myfaces._impl.core._Runtime.extendClass("myfaces._impl._dom._NodeList", Object, {
    constructor_: function() {

    }
});