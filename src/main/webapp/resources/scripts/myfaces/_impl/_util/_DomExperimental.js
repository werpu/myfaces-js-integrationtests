if (_MF_SINGLTN) {
    _MF_SINGLTN(_PFX_UTIL + "_DomExperimental", myfaces._impl._util._Dom, /** @lends myfaces._impl._util._Dom.prototype */ {
        constructor_:function () {
            this._callSuper("constructor_");
            myfaces._impl._util._Dom = this;
        },

        /**
         * fetches the window id for the current request
         * note, this is a preparation method for jsf 2.2
         */
        getWindowId:function (node) {
            var fetchWindowIdFromForms = function (forms) {
                var result_idx = {};
                var result;
                var foundCnt = 0;
                for (var cnt = forms.length - 1; cnt >= 0; cnt--) {
                    var currentForm = forms[cnt];
                    var windowId = currentForm["javax.faces.WindowId"].value;
                    if (windowId) {
                        if (foundCnt > 0 && 'undefined' == typeof result_idx[windowId]) throw Error("Multiple different windowIds found in document");
                        result = windowId;
                        result_idx[windowId] = true;
                        foundCnt++;
                    }
                }
                return result;
            }

            var getChildForms = function (currentElement) {
                var FORM = "form";
                var targetArr = [];
                if(!currentElement.tagName) return [];
                else if (currentElement.tagName.toLowerCase() == FORM) {
                    targetArr.push(currentElement);
                    return targetArr;
                }
                //old recursive way, due to flakeyness of querySelectorAll
                for (var cnt = currentElement.childNodes.length - 1; cnt >= 0; cnt--) {
                    var currentChild = currentElement.childNodes[cnt];
                    targetArr = targetArr.concat(getChildForms(currentChild, FORM));
                }
                return targetArr;
            }

            var findParentForms = function(element) {
                while(element != null) {
                    if(element.tagName.toLowerCase() == "form") return [element];
                    element = element.parentNode;
                }
                return document.forms;
            }

            if (!node) {
                var href = window.location.href;
                var windowId = "windowId";
                var regex = new RegExp("[\\?&]" + windowId + "=([^&#\\;]*)");
                var results = regex.exec(href);
                //initial trial over the url and a regexp
                if (results != null) return results[1];
                //second trial all forms
                return fetchWindowIdFromForms(document.forms);
            } else {
                //check forms
                var forms = getChildForms(node);
                if(!forms || forms.length == 0) {
                    //We walk up the parent until we hit a form or document.body
                    forms = findParentForms(node);
                }
                return fetchWindowIdFromForms(forms);
            }
        },

        html5FormDetection:function (item) {
            var browser = this._RT.browser;
            //ie shortcut, not really needed but speeds things up
            if (browser.isIEMobile && browser.isIEMobile <= 8) {
                return null;
            }
            var elemForm = this.getAttribute(item, "form");
            return (elemForm) ? this.byId(elemForm) : null;
        },

        isMultipartCandidate:function (executes) {
            if (this._Lang.isString(executes)) {
                executes = this._Lang.strToArray(executes, /\s+/);
            }

            for (var executable in executes) {
                if (!executes.hasOwnProperty(executable)) continue;
                var element = this.byId(executes[executable]);
                var inputs = this.findByTagName(element, "input", true);
                for (var key in inputs) {
                    if (!inputs.hasOwnProperty(key)) continue;
                    if (this.getAttribute(inputs[key], "type") == "file") return true;
                }
            }
            return false;
        }
    });
}
