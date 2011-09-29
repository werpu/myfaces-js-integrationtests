myfaces._impl.core._Runtime.extendClass("myfaces._impl._util.domsupport._Common", Object, {

    /**
     * checks if the provided element is a table element
     * @param itemNodeName
     * @param innerOnly
     */
    _isTableElement: function(item) {
        var itemNodeName = (item.nodeName || item.tagName).toLowerCase();

        return this._isTableStructureElement(item) || itemNodeName == "td";
    },

    _isTableStructureElement: function(item) {
        var itemNodeName = (item.nodeName || item.tagName).toLowerCase();

        return itemNodeName == "table" || itemNodeName == "thead" ||
                itemNodeName == "tbody" || itemNodeName == "tfoot" ||
                itemNodeName == "th" || itemNodeName == "tr";
    },

    /**
     * builds up a correct dom subtree
     * if the markup is part of table nodes
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
        return this._Lang.objToArray(evalNodes);
    },

    _determineDepth: function(probe) {
        var depth = 0;
        var newProbe = probe;
        while (newProbe) {
            newProbe = newProbe.childNodes[0];
            depth++;
        }
        depth--;
        return depth;
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
    }




});