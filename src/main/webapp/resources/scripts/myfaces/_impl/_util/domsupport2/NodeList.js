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
 * NodeList implementation which implements
 * the same methods if possible as Node
 * but for an entire nodelist
 */
myfaces._impl.core._Runtime.extendClass("myfaces._impl._dom._NodeList", myfaces._impl._dom._Node, {
    _nodes: null, /*array of nodes to process*/
    length: null,
    constructor_: function() {
        this._nodes = [];
    },

    push: function(node) {
        if (!node instanceof myfaces._impl._dom._Node &&
                ! node instanceof  myfaces._impl._dom._NodeList) {
            throw Error("Node of wrong type");
        }
        this._nodes.push(node);
        this.length = this._nodes.length;
    },

    get: function(index) {
        return this._nodes[index];
    },

    forEach: function(closure) {
        this._Lang.arrForEach(this._nodes, closure);
    },

    filter: function(closure) {
        this._Lang.arrFilter(this._nodes, closure);
    },

    isTag: function(name) {
        for(var cnt = 0; cnt < this._nodes.length; cnt++) {
            if(this._nodes[cnt].isTag(name)) return true;
        }
        return false;
    },

    getId: function() {
        var ret = [];
        var closure = function(node) {
            ret.push(node.getId());
        }
        try {
            this.forEach(closure);
        } finally {
            delete closure;
        }
        return ret;
    },

    getName: function() {
        var ret = [];
        var closure = function(node) {
            ret.push(node.getName());
        }
        try {
            this.forEach(closure);
        } finally {
            delete closure;
        }
        return ret;
    },

    nodeIdOrName: function() {
        var ret = [];
        var closure = function(node) {
            ret.push(node.nodeIdOrName());
        }
        try {
            this.forEach(closure);
        } finally {
            delete closure;
        }
        return ret;
    },

    /*purges the given node and all its subelements from the dom tree*/
    purge: function() {
        var ret = [];
        var closure = function(node) {
            node.purge();
        }
        try {
            this.forEach(closure);
        } finally {
            delete closure;
        }
    },

    detach: function(items) {
        var ret = [];
        var closure = function(node) {
            node.detach();
        }
        try {
            this.forEach(closure);
        } finally {
            delete closure;
        }
    },

    innerHTML: function(markup) {
        var ret = [];
        var closure = function(node) {
            node.innerHTML(markup);
        }
        try {
            this.forEach(closure);
        } finally {
            delete closure;
        }
    },

    setAttribute: function(attr, val) {
        var ret = [];
        var closure = function(node) {
            node.setAttribute(attr, val);
        }
        try {
            this.forEach(closure);
        } finally {
            delete closure;
        }
    }

});
