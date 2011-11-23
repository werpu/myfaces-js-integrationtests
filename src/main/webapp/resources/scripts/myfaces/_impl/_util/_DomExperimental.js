if (_MF_SINGLTN) {
    _MF_SINGLTN(_PFX_UTIL + "_DomExperimental", myfaces._impl._util._Dom, /** @lends myfaces._impl._util._Dom.prototype */ {
        constructor_: function() {
            this._callSuper("constructor_");
            myfaces._impl._util._Dom = this;
        },

        /**
         * fetches the window id for the current request
         * note, this is a preparation method for jsf 2.2
         *
         * todo move this into the experimental part
         */
        getWindowId: function() {
            var href = window.location.href;
            var windowId = "windowId";
            var regex = new RegExp("[\\?&]" + windowId + "=([^&#\\;]*)");
            var results = regex.exec(href);
            return (results != null) ? results[1] : null;
        },
        /**
         * detection of the html5 form attribute
         *
         * @param item the item to be investigated
         */
        html5FormDetection: function(item) {
            var browser = this._RT.browser;
            //ie shortcut, not really needed but speeds things up
            if (browser.isIEMobile && browser.isIEMobile <= 8) {
                return null;
            }
            var elemForm = this.getAttribute(item, "form");
            return (elemForm) ? this.byId(elemForm) : null;
        },

        /**
         * checks if the current form is a candidate for
         * a special multipart request handling
         *
         * @param executes
         */
        isMultipartCandidate: function(executes) {
            if (this._Lang.isString(executes)) {
                executes = this._Lang.strToArray(executes, /\s+/);
            }

            for (var exec in executes) {
                var element = this.byId(executes[exec]);
                var inputs = this.findByTagName(element, "input", true);
                for (var key in inputs) {
                    if (this.getAttribute(inputs[key], "type") == "file") return true;
                }
            }
            return false;
        },
        /**
         * fetches the current document encoding
         *
         * @param defaults the default encoding which should be used
         * if no encoding could be found
         */
        getEncoding: function(defaults) {
            var encoding = "_encoding";
            var T = this;
            if (!this[encoding]) {
                this[encoding] = document.charset || document.characterSet;
                if (this[encoding]) return this[encoding];
                //alternative method over parsing
                var len = document.childNodes.length;
                var encodingMatch = /encoding\s*\=\s*['"](([^'"])+)['"]/i;
                for (var cnt = 0; cnt < len; cnt++) {
                    var node = document.childNodes[cnt];
                    var val = node.textContent || node.nodeValue;
                    if (val) {
                        var res = encodingMatch.exec(val);
                        if (res.length > 1) {
                            this._encoding = res[1];
                            return res[1];
                        }
                    }
                }
                this[encoding] = defaults || "utf-8";
            }
            this[encoding];
        }
    });
}
