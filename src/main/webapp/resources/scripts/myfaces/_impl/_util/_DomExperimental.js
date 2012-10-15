if (_MF_SINGLTN) {
    _MF_SINGLTN(_PFX_UTIL + "_DomExperimental", myfaces._impl._util._Dom, /** @lends myfaces._impl._util._Dom.prototype */ {
        constructor_:function () {
            this._callSuper("constructor_");
            myfaces._impl._util._Dom = this;
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

            for (var cnt = 0, len = executes.length; cnt < len ; cnt ++) {
                var element = this.byId(executes[cnt]);
                var inputs = this.findByTagName(element, "input", true);
                for (var cnt2 = 0, len2 = inputs.length; cnt2 < len2 ; cnt2++) {
                    if (this.getAttribute(inputs[cnt2], "type") == "file") return true;
                }
            }
            return false;
        },

        getNamedElementFromForm: function(form, elementId) {
            return form[elementId];
        }
    });
}
