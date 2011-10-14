_MF_CLS("myfaces._impl._util.domsupport.Compliant", myfaces._impl._util.domsupport._Common, {
    _Lang:  myfaces._impl._util._Lang,
    _RT:    myfaces._impl.core._Runtime,

    findByName: function(fragment, name) {
        var _Lang = this._Lang;
        //elements byName is the fastest
        if (_Lang.exists(fragment, "getElementsByName")) {
            var ret = _Lang.objToArray(fragment.getElementsByName(name));
            if (fragment.name == name) ret.unshift(fragment);
            return ret;

        }

        var newName = name;
        if (_Lang.isString(newName)) {
            newName = _Lang.escapeString(newName);
        }
        var result = fragment.querySelectorAll("[name=" + newName + "]");
        if (fragment.nodeType == 1 && filter(fragment)) {
            result = (result == null) ? [] : _Lang.objToArray(result);
            result.push(fragment);
        }
        return result;
    },

    allSubnodes: function(rootNode) {
        return rootNode.querySelectorAll("");
    },

    /**
     * helper which finds nodes by either ids or names
     *
     * @param rootNode
     * @param partialIds
     */
    findByIdsOrNames: function(rootNode, partialIds) {

        var queryBuf = [];
        for (var cnt = partialIds.length - 1; cnt >= 0; cnt --) {
            var subbuf = [];
            var idOrName = this._Lang.escapeString(partialIds[cnt]);
            subbuf.push("#");
            subbuf.push(idOrName);
            subbuf.push(",")
            subbuf.push("[name=");
            subbuf.push(idOrName);
            subbuf.push("]");
            queryBuf.push(subbuf.join(""));
        }

        var res = rootNode.querySelectorAll(queryBuf.join(","));
        var rootId = rootNode.id;
        var rootName = rootNode.name;
        if (rootId && _Lang.contains(partialIds, rootId)) {
            res.push(rootNode);

        } else if (rootName && _Lang.contains(partialIds, rootName)) {
            res.push(rootName);
        }
        return res;

    },

    _removeNode: function(node, breakEventsOpen) {
        if (!node) return;

        if ('undefined' != typeof node.parentNode && null != node.parentNode) //if the node has a parent
            node.parentNode.removeChild(node);
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
    replaceElement: function(item, evalNode) {
        item.parentNode.replaceChild(evalNode, item);
    },

    getDummyPlaceHolder: function(markup) {
        if (!this._dummyPlaceHolder) {
            this._dummyPlaceHolder = document.createElement("div");
        }
        return this._dummyPlaceHolder;
    },

    setAttribute : function(node, attr, val) {
        node.setAttribute(val);
    },

    getAttribute: function(node, attr) {
        return node.getAttribute(attr);
    },

    getClass: function(node) {
        var cs = node.getAttribute("class");
        return (cs)? cs.replace(/^\s+|\s+$/g, "") : "";
    }

});