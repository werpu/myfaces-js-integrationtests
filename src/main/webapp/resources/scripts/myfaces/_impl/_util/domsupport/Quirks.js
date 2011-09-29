myfaces._impl.core._Runtime.extendClass("myfaces._impl._util.domsupport._Quirks", myfaces._impl._util.domsupport._Common, {

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

    /**
     * a filtered findAll for subdom treewalking
     * (which uses browser optimizations wherever possible)
     *
     * @param {|Node|} rootNode the rootNode so start the scan
     * @param filter filter closure with the syntax {boolean} filter({Node} node)
     * @param deepScan if set to true or not set at all a deep scan is performed (for form scans it does not make much sense to deeply scan)
     */
    findAll : function(rootNode, filter, deepScan) {
        this._Lang.assertType(filter, "function");
        deepScan = !!deepScan;

        if (document.createTreeWalker && NodeFilter) {
            return this._iteratorSearchAll(rootNode, filter, deepScan);
        } else {
            return this._recursionSearchAll(rootNode, filter, deepScan);
        }

    },

    allSubnodes: function(rootNode) {
        var filter = function(curNode) {
            return curNode != rootNode;
        }
        return this.findAll(rootNode, filter, true);
    },

    findByName : function(fragment, name) {
        try {
            var _Lang = this._Lang;
            var filter = function(node) {
                return  node.name && _Lang.equalsIgnoreCase(node.name, name);
            };

            return this.findAll(fragment, name);
        } finally {
            //the usual IE6 is broken, fix code
            filter = null;
            _Lang = null;
        }
    },


    /**
     * helper which finds nodes by either ids or names
     *
     * @param rootNode
     * @param partialIds
     */
    findByIdsOrNames: function(rootNode, partialIds) {
        //Fallback for no selector api implementing browsers
        var _Impl = this._Impl;
        var partialIdsFilter = function(curNode) {
            var id = curNode.id;
            var name = curNode.name;
            return (id && _Lang.contains(partialIds, id)) || (name && _Lang.contains(partialIds, name));
        };
        return this.findAll(rootNode, partialIdsFilter, true);
    },

    /**
     * classical recursive way which definitely will work on all browsers
     * including the IE6
     *
     * @param rootNode the root node
     * @param filter the filter to be applied to
     * @param deepScan if set to true a deep scan is performed
     */
    _recursionSearchAll: function(rootNode, filter, deepScan) {
        var ret = [];
        //fix the value to prevent undefined errors

        if (filter(rootNode)) {
            ret.push(rootNode);
            if (!deepScan) return ret;
        }

        //
        if (!rootNode.childNodes) {
            return ret;
        }

        //subfragment usecases

        var retLen = ret.length;
        var childLen = rootNode.childNodes.length;
        for (var cnt = 0; (deepScan || retLen == 0) && cnt < childLen; cnt++) {
            ret = ret.concat(this._recursionSearchAll(rootNode.childNodes[cnt], filter, deepScan));
        }
        return ret;
    }
    ,

    /**
     * the faster dom iterator based search, works on all newer browsers
     * except ie8 which already have implemented the dom iterator functions
     * of html 5 (which is pretty all standard compliant browsers)
     *
     * The advantage of this method is a faster tree iteration compared
     * to the normal recursive tree walking.
     *
     * @param rootNode the root node to be iterated over
     * @param filter the iteration filter
     * @param deepScan if set to true a deep scan is performed
     */
    _iteratorSearchAll: function(rootNode, filter, deepScan) {
        var retVal = [];
        //Works on firefox and webkit, opera and ie have to use the slower fallback mechanis
        //we have a tree walker in place this allows for an optimized deep scan
        if (filter(rootNode)) {

            retVal.push(rootNode);
            if (!deepScan) {
                return retVal;
            }
        }
        //we use the reject mechanism to prevent a deep scan reject means any
        //child elements will be omitted from the scan
        var walkerFilter = function (node) {
            var retCode = (filter(node)) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
            retCode = (!deepScan && retCode == NodeFilter.FILTER_ACCEPT) ? NodeFilter.FILTER_REJECT : retCode;
            if (retCode == NodeFilter.FILTER_ACCEPT || retCode == NodeFilter.FILTER_REJECT) {
                retVal.push(node);
            }
            return retCode;
        };
        var treeWalker = document.createTreeWalker(rootNode, NodeFilter.SHOW_ELEMENT, walkerFilter, false);
        //noinspection StatementWithEmptyBodyJS
        while (treeWalker.nextNode());
        return retVal;
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

        //now to the browsers with non working garbage collection
        this._removeChildNodes(node, breakEventsOpen);

        try {
            //outer HTML setting is only possible in earlier IE versions all modern browsers throw an exception here
            //again to speed things up we precheck first
            if (!this._isTableStructureElement(childNode)) {
                //we do not do a table structure innnerhtml on table elements except td
                //htmlunit rightfully complains that we should not do it
                node.innerHTML = "";
            }
            if (b.isIE && 'undefined' != typeof node.outerHTML) {//ie8+ check done earlier we skip it here
                node.outerHTML = '';
            } else {
                this._removeFromParent(node);
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
                this._removeFromParent(node);
            } catch (e1) {
            }
        }
    }
    ,

    _removeFromParent: function(node) {
        if ('undefined' != typeof node.parentNode && null != node.parentNode) //if the node has a parent
            node.parentNode.removeChild(node);
    },

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
        var disallowedNodes = {
            "thead": true,
            "tbody": true,
            "tr": true,
            "td": true
        };

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
                    if (!this._isTableStructureElement(childNode)) {    //table elements cannot be deleted
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
    ,
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
     * now to the evil browsers
     * of what we are dealing with is various bugs
     * first a simple replaceElement leaks memory
     * secondly embedded scripts can be swallowed upon
     * innerHTML, we probably could also use direct outerHTML
     * but then we would run into the script swallow bug
     *
     * the entire mess is called IE6 and IE7
     *
     * @param item
     * @param markup
     */
    outerHTML: function(item, markup) {

        var b = this._RT.browser;
        var evalNodes = null;

        try {
            if (this._isTableElement(item)) {
                evalNodes = this._buildTableNodes(item, markup);
            } else {
                evalNodes = this._buildNodesNonCompliant(markup);
            }

            if (evalNodes.length == 1) {
                var ret = evalNodes[0];
                this.replaceElement(item, evalNodes[0]);
                return ret;
            } else {
                return this.replaceElements(item, evalNodes);
            }

        } finally {

            var dummyPlaceHolder = this.getDummyPlaceHolder();
            //now that Microsoft has finally given
            //ie a working gc in 8 we can skip the costly operation
            var b = myfaces._impl.core._Runtime.browser;

            if (b.isIE && b.isIE < 8) {
                this._removeChildNodes(dummyPlaceHolder, false);
            }
            dummyPlaceHolder.innerHTML = "";
        }

    },

    /**
     * builds the ie nodes properly in a placeholder
     * and bypasses a non script insert bug that way
     * @param markup the marku code
     */
    _buildNodesNonCompliant: function(markup) {

        var evalNodes = null;

        //now to the non w3c compliant browsers
        //http://blogs.perl.org/users/clinton_gormley/2010/02/forcing-ie-to-accept-script-tags-in-innerhtml.html
        //we have to cope with deficiencies between ie and its simulations in this case
        var probe = this.getDummyPlaceHolder();//document.createElement("div");

        probe.innerHTML = "<table><tbody><tr><td><div></div></td></tr></tbody></table>";

        //we have customers using html unit, this has a bug in the table resolution
        //hence we determine the depth dynamically
        var depth = this._determineDepth(probe);
        var newProbe = probe;
        this._removeChildNodes(probe, false);
        probe.innerHTML = "";

        var dummyPlaceHolder = this.getDummyPlaceHolder();//document.createElement("div");

        //fortunately a table element also works which is less critical than form elements regarding
        //the inner content
        dummyPlaceHolder.innerHTML = "<table><tbody><tr><td>" + markup + "</td></tr></tbody></table>";
        evalNodes = dummyPlaceHolder;

        for (var cnt = 0; cnt < depth; cnt++) {
            evalNodes = evalNodes.childNodes[0];
        }
        evalNodes = (evalNodes.parentNode) ? evalNodes.parentNode.childNodes : null;

        if ('undefined' == typeof evalNodes || null == evalNodes) {
            //fallback for htmlunit which should be good enough
            //to run the tests, maybe we have to wrap it as well
            dummyPlaceHolder.innerHTML = "<div>" + markup + "</div>";
            //note this is triggered only in htmlunit no other browser
            //so we are save here
            evalNodes = dummyPlaceHolder.childNodes[0].childNodes;
        }
        return this._Lang.objToArray(evalNodes);

    },


    setAttribute : function(node, attr, val) {

        if (!node) {
            throw Error(this._Lang.getMessage("ERR_MUST_BE_PROVIDED1", null, "_Dom.setAttribute", "node {DomNode}"));
        }
        if (!attr) {
            throw Error(this._Lang.getMessage("ERR_MUST_BE_PROVIDED1", null, "_Dom.setAttribute", "attr {String}"));
        }

        //quirks mode and ie7 mode has the attributes problems ie8 standards mode behaves like
        //a good citizen
        var _Browser = this._RT.browser;
        if (!_Browser.isIE || _Browser.isIE > 7) {
            if (!node.setAttribute) {
                return;
            }
            node.setAttribute(attr, val);
            return;
        }

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

    /**
     * cross ported from dojo
     * fetches an attribute from a node
     *
     * @param {String} node the node
     * @param {String} attr the attribute
     * @return the attributes value or null
     */
    getAttribute : function(/* HTMLElement */node, /* string */attr) {
        //	summary
        //	Returns the value of attribute attr from node.
        node = this.byId(node);
        // FIXME: need to add support for attr-specific accessors
        if ((!node) || (!node.getAttribute)) {
            // if(attr !== 'nwType'){
            //	alert("getAttr of '" + attr + "' with bad node");
            // }
            return null;
        }
        var ta = typeof attr == 'string' ? attr : new String(attr);

        // first try the approach most likely to succeed
        var v = node.getAttribute(ta.toUpperCase());
        if ((v) && (typeof v == 'string') && (v != "")) {
            return v;	//	string
        }

        // try returning the attributes value, if we couldn't get it as a string
        if (v && v.value) {
            return v.value;	//	string
        }

        // this should work on Opera 7, but it's a little on the crashy side
        if ((node.getAttributeNode) && (node.getAttributeNode(ta))) {
            return (node.getAttributeNode(ta)).value;	//	string
        } else if (node.getAttribute(ta)) {
            return node.getAttribute(ta);	//	string
        } else if (node.getAttribute(ta.toLowerCase())) {
            return node.getAttribute(ta.toLowerCase());	//	string
        }
        return null;	//	string
    },

    /**
     * fetches the style class for the node
     * cross ported from the dojo toolkit
     * @param {String|Object} node the node to search
     * @returns the className or ""
     */
    getClass : function(node) {
        node = this.byId(node);
        if (!node) {
            return "";
        }
        var cs = "";
        if (node.className) {
            cs = node.className;
        } else {
            if (this.hasAttribute(node, "class")) {
                cs = this.getAttribute(node, "class");
            }
        }
        return cs.replace(/^\s+|\s+$/g, "");
    }
});