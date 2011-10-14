/**
 * Dom Engines with browser dependend low level dom operations.
 * Note, this class is only to be used as internal class
 * for the public api reference the selector api
 * and the included node and nodeutils classes
 */
_MF_CLS("myfaces._impl._dom._DomEngine", Object, {

    /*table elements which are used in various parts */
    TABLE_ELEMS:  {
        "thead": true,
        "tbody": true,
        "tr": true,
        "th": true,
        "td": true,
        "tfoot" : true
    },

    _Lang:  myfaces._impl._util._Lang,
    _RT:    myfaces._impl.core._Runtime,
    _dummyPlaceHolder:null,



    getDummyPlaceHolder: function(markup) {
        var created = false;
        if (!this._dummyPlaceHolder) {
            this._dummyPlaceHolder = document.createElement("div");
            created = true;
        }

        //ieMobile in its 6.1-- incarnation cannot handle innerHTML detached objects so we have
        //to attach the dummy placeholder, we try to avoid it for
        //better browsers so that we do not have unecessary dom operations
        if (this._RT.browser.isIEMobile && created) {
            this.insertFirst(this._dummyPlaceHolder);

            this.setAttribute(this._dummyPlaceHolder, "style", "display: none");

        }

        return this._dummyPlaceHolder;
    },

    /**
     * builds up a correct dom subtree
     * if the markup is part of table nodes
     * The usecase for this is to allow subtable rendering
     * like single rows thead or tbody
     *
     * @param item
     * @param markup
     */
    _buildTableNodes: function(item, markup) {
        var evalNodes;
        var itemNodeName = (item.nodeName || item.tagName).toLowerCase();
        var probe = this.getDummyPlaceHolder(); //document.createElement("div");
        if (itemNodeName == "td") {
            probe.innerHTML = "<table><tbody><tr><td></td></tr></tbody></table>";
        } else {
            probe.innerHTML = "<table><" + itemNodeName + "></" + itemNodeName + ">" + "</table>";
        }
        var depth = this._determineDepth(probe);

        this._removeChildNodes(probe, false);
        probe.innerHTML = "";

        var dummyPlaceHolder = this.getDummyPlaceHolder();//document.createElement("div");
        if (itemNodeName == "td") {
            dummyPlaceHolder.innerHTML = "<table><tbody><tr>" + markup + "</tr></tbody></table>";
        } else {
            dummyPlaceHolder.innerHTML = "<table>" + markup + "</table>";
        }
        evalNodes = dummyPlaceHolder;
        for (var cnt = 0; cnt < depth; cnt++) {
            evalNodes = evalNodes.childNodes[0];
        }
        evalNodes = (evalNodes.parentNode) ? evalNodes.parentNode.childNodes : null;
        return this.detach(evalNodes);
    },

    detach: function(items) {
        var ret = [];
        if ('undefined' != typeof items.nodeType) {
            if (items.parentNode) {
                ret.push(items.parentNode.removeChild(items));
            } else {
                ret.push(items);
            }
            return ret;
        }

        items = this._Lang.objToArray(items);
        for (var cnt = 0; cnt < items.length; cnt++) {
            ret.push(items[cnt].parentNode.removeChild(items[cnt]));
        }
        return ret;
    },

    _determineDepth: function(probe) {
        var depth = 0;
        var newProbe = probe;
        for (; newProbe &&
                       newProbe.childNodes &&
                       newProbe.childNodes.length &&
                       newProbe.nodeType == 1; depth++) {
            newProbe = newProbe.childNodes[0];
        }
        return depth;
    },

     _isTable: function(item) {
        var itemNodeName = (item.nodeName || item.tagName).toLowerCase();
        return itemNodeName == "table";
    },

    /**
     * checks if the provided element is a subelement of a table element
     * @param itemNodeName
     */
    _isTableElement: function(item) {
        var itemNodeName = (item.nodeName || item.tagName).toLowerCase();
        return !!this.TABLE_ELEMS[itemNodeName];
    },

    /**
     * replaces an element with another element or a set of elements
     *
     * @param item the item to be replaced
     *
     * @param evalNodes the elements
     */
    replaceElements: function (item, evalNodes) {
        var evalNodesDefined = evalNodes && 'undefined' != typeof evalNodes.length;
        if (!evalNodesDefined) {
            throw new Error(this._Lang.getMessage("ERR_REPLACE_EL"));
        }

        var parentNode = item.parentNode;

        var sibling = item.nextSibling;
        var resultArr = this._Lang.objToArray(evalNodes);

        for (var cnt = 0; cnt < resultArr.length; cnt++) {
            if (cnt == 0) {
                this.replaceElement(item, resultArr[cnt]);
            } else {
                if (sibling) {
                    parentNode.insertBefore(resultArr[cnt], sibling);
                } else {
                    parentNode.appendChild(resultArr[cnt]);

                }
            }
        }

        return resultArr;
    },

    /**
     * builds up a correct dom subtree
     * if the markup is part of table nodes
     * The usecase for this is to allow subtable rendering
     * like single rows thead or tbody
     *
     * @param item
     * @param markup
     */
    _buildTableNodes: function(item, markup) {
        var evalNodes;
        var itemNodeName = (item.nodeName || item.tagName).toLowerCase();
        var probe = this.getDummyPlaceHolder(); //document.createElement("div");
        if (itemNodeName == "td") {
            probe.innerHTML = "<table><tbody><tr><td></td></tr></tbody></table>";
        } else {
            probe.innerHTML = "<table><" + itemNodeName + "></" + itemNodeName + ">" + "</table>";
        }
        var depth = this._determineDepth(probe);

        this._removeChildNodes(probe, false);
        probe.innerHTML = "";

        var dummyPlaceHolder = this.getDummyPlaceHolder();//document.createElement("div");
        if (itemNodeName == "td") {
            dummyPlaceHolder.innerHTML = "<table><tbody><tr>" + markup + "</tr></tbody></table>";
        } else {
            dummyPlaceHolder.innerHTML = "<table>" + markup + "</table>";
        }
        evalNodes = dummyPlaceHolder;
        for (var cnt = 0; cnt < depth; cnt++) {
            evalNodes = evalNodes.childNodes[0];
        }
        evalNodes = (evalNodes.parentNode) ? evalNodes.parentNode.childNodes : null;
        return this.detach(evalNodes);
    }
});

_MF_SINGLTN("myfaces._impl._dom._DomEngineCompliant", myfaces._impl._dom._DomEngine, {
    outerHTML: function(item, markup) {
        var evalNodes;
        //table element replacements like thead, tbody etc... have to be treated differently
        if (this._isTableElement(item)) {
            evalNodes = this._buildTableNodes(item, markup);
        } else {
            evalNodes = this._buildNodesCompliant(markup);
        }
        var evalNodeLen = evalNodes.length;

        if (evalNodeLen == 1) {
            var ret = evalNodes[0];
            item.parentNode.replaceChild(ret, item);
            return ret;
        } else {
            return this.replaceElements(item, evalNodes);
        }
    },

    setAttribute : function(node, attr, val) {
        node.setAttribute(attr, val);
    },

    _removeNode: function(elem, breakEventsOpen) {
        this.detach(elem);
    },

    /**
     * for performance reasons we work with replaceElement and replaceElements here
     * after measuring performance it has shown that passing down an array instead
     * of a single node makes replaceElement twice as slow, however
     * a single node case is the 95% case
     *
     * @param item
     * @param evalNodes
     */
    replaceElement: function(item, evalNode) {
        item.parentNode.replaceChild(evalNode, item);
    },




    /**
     * non ie browsers do not have problems with embedded scripts or any other construct
     * we simply can use an innerHTML in a placeholder
     *
     * @param markup the markup to be used
     */
    _buildNodesCompliant: function(markup) {
        var dummyPlaceHolder = this.getDummyPlaceHolder(); //document.createElement("div");
        dummyPlaceHolder.innerHTML = markup;
        return this._Lang.objToArray(dummyPlaceHolder.childNodes);
    },


    _removeNode: function(node, breakEventsOpen) {
        if (!node) return;
        if ('undefined' != typeof node.parentNode && null != node.parentNode) //if the node has a parent
            node.parentNode.removeChild(node);
    }


});

_MF_SINGLTN("myfaces._impl._dom._DomEngineNonCompliant", myfaces._impl._dom._DomEngine, {

     IE_QUIRKS_EVENTS : {
        "onabort": true,
        "onload":true,
        "onunload":true,
        "onchange": true,
        "onsubmit": true,
        "onreset": true,
        "onselect": true,
        "onblur": true,
        "onfocus": true,
        "onkeydown": true,
        "onkeypress": true,
        "onkeyup": true,
        "onclick": true,
        "ondblclick": true,
        "onmousedown": true,
        "onmousemove": true,
        "onmouseout": true,
        "onmouseover": true,
        "onmouseup": true
    },

    outerHTML: function(item, markup) {
        var evalNodes;
        //table element replacements like thead, tbody etc... have to be treated differently
        if (this._isTableElement(item)) {
            evalNodes = this._buildTableNodes(item, markup);
        } else {
            evalNodes = this._buildNodesCompliant(markup);
        }
        var evalNodeLen = evalNodes.length;

        if (evalNodeLen == 1) {
            var ret = evalNodes[0];
            item.parentNode.replaceChild(ret, item);
            return ret;
        } else {
            return this.replaceElements(item, evalNodes);
        }
    },

    /**
     * bugfixing for ie6 which does not cope properly with setAttribute
     */
    setAttribute : function(node, attr, val) {

        /*
         Now to the broken browsers IE6+.... ie7 and ie8 quirks mode

         we deal mainly with three problems here
         class and for are not handled correctly
         styles are arrays and cannot be set directly
         and javascript events cannot be set via setAttribute as well!

         or in original words of quirksmode.org ... this is a mess!

         Btw. thank you Microsoft for providing all necessary tools for free
         for being able to debug this entire mess in the ie rendering engine out
         (which is the Microsoft ie vms, developers toolbar, Visual Web Developer 2008 express
         and the ie8 8 developers toolset!)

         also thank you http://www.quirksmode.org/
         dojotoolkit.org and   //http://delete.me.uk/2004/09/ieproto.html
         for additional information on this mess!

         The lowest common denominator tested within this code
         is IE6, older browsers for now are legacy!
         */
        attr = attr.toLowerCase();

        if (attr === "class") {
            //setAttribute does not work for winmobile browsers
            //firect calls work
            node.className = val;
        } else if (attr === "name") {
            //the ie debugger fails to assign the name via setAttr
            //in quirks mode
            node[attr] = val;
        } else if (attr === "for") {
            if (!_Browser.isIEMobile || _Browser.isIEMobile >= 7) {
                node.setAttribute("htmlFor", val);
            } else {
                node.htmlFor = val;
            }
        } else if (attr === "style") {
            //We have to split the styles here and assign them one by one
            var styles = val.split(";");
            var stylesLen = styles.length;
            for (var loop = 0; loop < stylesLen; loop++) {
                var keyVal = styles[loop].split(":");
                if (keyVal[0] != "" && keyVal[0] == "opacity") {
                    //special ie quirks handling for opacity

                    var opacityVal = Math.max(100, Math.round(parseFloat(keyVal[1]) * 10));
                    //probably does not work in ie mobile anyway
                    if (!_Browser.isIEMobile || _Browser.isIEMobile >= 7) {
                        node.style.setAttribute("arrFilter", "alpha(opacity=" + opacityVal + ")");
                    }
                    //if you need more hacks I would recommend
                    //to use the class attribute and conditional ie includes!
                } else if (keyVal[0] != "") {
                    if (!_Browser.isIEMobile || _Browser.isIEMobile >= 7) {
                        node.style.setAttribute(keyVal[0], keyVal[1]);
                    } else {
                        node.style[keyVal[0]] = keyVal[1];
                    }
                }
            }
        } else {
            //check if the attribute is an event, since this applies only
            //to quirks mode of ie anyway we can live with the standard html4/xhtml
            //ie supported events
            if (this.IE_QUIRKS_EVENTS[attr]) {
                if (this._Lang.isString(attr)) {
                    //event resolves to window.event in ie
                    node.setAttribute(attr, function() {
                        //event implicitly used
                        return this._Lang.globalEval(val);
                    });
                }
            } else {
                //unknown cases we try to catch them via standard setAttributes
                if (!_Browser.isIEMobile || _Browser.isIEMobile >= 7) {
                    node.setAttribute(attr, val);
                } else {
                    node[attr] = val;
                }
            }
        }
    },

    /**
     * for performance reasons we work with replaceElement and replaceElements here
     * after measuring performance it has shown that passing down an array instead
     * of a single node makes replaceElement twice as slow, however
     * a single node case is the 95% case
     *
     * @param item
     * @param evalNodes
     */
    replaceElement: function(item, evalNode) {
        var _Browser = this._RT.browser;
        if (!_Browser.isIE || _Browser.isIE >= 8) {
            //standards conform no leaking browser
            item.parentNode.replaceChild(evalNode, item);
        } else {
            //browsers with defect garbage collection
            item.parentNode.insertBefore(evalNode, item);
            this._removeNode(item, false);
        }
    },

    //now to another nasty issue:
    //for ie we have to walk recursively over all nodes:
    //http://msdn.microsoft.com/en-us/library/bb250448%28VS.85%29.aspx
    //http://weblogs.java.net/blog/driscoll/archive/2009/11/13/ie-memory-management-and-you
    //http://home.orange.nl/jsrosman/
    //http://www.quirksmode.org/blog/archives/2005/10/memory_leaks_li.html
    //http://www.josh-davis.org/node/7
    _removeNode: function(node, breakEventsOpen) {
        if (!node) return;
        var b = this._RT.browser;

        //now to the browsers with non working garbage collection
        this._removeChildNodes(node, breakEventsOpen);

        try {
            //outer HTML setting is only possible in earlier IE versions all modern browsers throw an exception here
            //again to speed things up we precheck first
            if (!this._isTableElement(childNode)) {
                //we do not do a table structure innnerhtml on table elements except td
                //htmlunit rightfully complains that we should not do it
                node.innerHTML = "";
            }
            if (b.isIE && 'undefined' != typeof node.outerHTML) {//ie8+ check done earlier we skip it here
                node.outerHTML = '';
            } else {
                node = this.detach(node)[0];
            }
            if (!b.isIEMobile) {
                delete node;
            }
        } catch (e) {
            //on some elements we might not have covered by our table check on the outerHTML
            // can fail we skip those in favor of stability
            try {
                // both innerHTML and outerHTML fails when <tr> is the node, but in that case
                // we need to force node removal, otherwise it will be on the tree (IE 7 IE 6)
                this.detach(node);
            } catch (e1) {
            }
        }
    }
    ,

    /**
     * recursive delete child nodes
     * node, this method only makes sense in the context of IE6 + 7 hence
     * it is not exposed to the public API, modern browsers
     * can garbage collect the nodes just fine by doing the standard removeNode method
     * from the dom API!
     *
     * @param node  the node from which the childnodes have to be deletd
     * @param breakEventsOpen if set to true a standard events breaking is performed
     */
    _removeChildNodes: function(node, breakEventsOpen) {
        if (!node) return;

        //node types which cannot be cleared up by normal means
        var disallowedNodes = this.TABLE_ELEMS;

        //for now we do not enable it due to speed reasons
        //normally the framework has to do some event detection
        //which we cannot do yet, I will dig for options
        //to enable it in a speedly manner
        //ie7 fixes this area anyway
        //this.breakEvents(node);

        var b = this._RT.browser;
        if (breakEventsOpen) {
            this.breakEvents(node);
        }

        for (var cnt = node.childNodes.length - 1; cnt >= 0; cnt -= 1) {
            var childNode = node.childNodes[cnt];
            //we cannot use our generic recursive tree walking due to the needed head recursion
            //to clean it up bottom up, the tail recursion we were using in the search either would use more time
            //because we had to walk and then clean bottom up, so we are going for a direct head recusion here
            if ('undefined' != typeof childNode.childNodes && node.childNodes.length)
                this._removeChildNodes(childNode);
            try {
                var nodeName = (childNode.nodeName || childNode.tagName) ? (childNode.nodeName || childNode.tagName).toLowerCase() : null;
                //ie chokes on clearing out table inner elements, this is also covered by our empty
                //catch block, but to speed things up it makes more sense to precheck that
                if (!disallowedNodes[nodeName]) {
                    //outer HTML setting is only possible in earlier IE versions all modern browsers throw an exception here
                    //again to speed things up we precheck first
                    if (!this._isTableElement(childNode)) {    //table elements cannot be deleted
                        childNode.innerHTML = "";
                    }
                    if (b.isIE && b.isIE < 8 && 'undefined' != childNode.outerHTML)
                        childNode.outerHTML = '';
                    else {
                        node.removeChild(childNode);
                    }
                    if (!b.isIEMobile) {
                        delete childNode;
                    }
                }
            } catch (e) {
                //on some elements the outerHTML can fail we skip those in favor
                //of stability

            }
        }
    }
    ,

    /**
     * break the standard events from an existing dom node
     * (note this method is not yet used, but can be used
     * by framework authors to get rid of ie circular event references)
     *
     * another way probably would be to check all attributes of a node
     * for a function and if one is present break it by nulling it
     * I have to do some further investigation on this.
     *
     * The final fix is to move away from ie6 at all which is the root cause of
     * this.
     *
     * @param node the node which has to be broken off its events
     */
    breakEvents: function(node) {
        if (!node) return;
        var evtArr = this.IE_QUIRKS_EVENTS;
        for (var key in evtArr) {
            if (key != "onunload" && node[key]) {
                node[key] = null;
            }
        }
    }

});