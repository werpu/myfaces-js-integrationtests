/**
 * this encodes the additional values from the other forms
 *
 * @param originalFormId
 */
function encodeAdditionalFormElements(originalFormId) {
    var targetBuf = new function () {
        var buf = [];
        this.append = function (name, value) {
            buf.push({name:name, value:value});
        }
        this.getBuf = function () {
            return buf;
        }
    };
    for (var cnt = 0; cnt < document.forms.length; cnt++) {
        if (document.forms[cnt].id == originalFormId) continue;
        var elements = document.forms[cnt].elements;

        for (var cnt2 = 0; cnt2 < elements.length; cnt2++) {
            var element = elements[cnt];
            //name before id, submit order
            var submitName = element.name || element.id;
            //we can ignore the viewstate of the other forms
            if (submitName == "javax.faces.ViewState") continue;
            myfaces._impl.xhrCore._AjaxUtils.encodeElement(element, targetBuf);
            //now the value has to be encoded we use an internal function of apache myfaces
            //here which also could be externalized
        }
    }
    return targetBuf;
}

function requestAll(origin, event, options) {
    var _Dom = myfaces._impl._util._Dom;
    origin = _Dom.byId(origin);
    options = options || {};
    var parentForm = _Dom.fuzzyFormDetection(origin);
    var additionalElems = encodeAdditionalFormElements(parentForm.id);
    for (var cnt = 0; cnt < additionalElems.getBuf().length; cnt++) {
        var name = additionalElems.getBuf()[cnt].name;
        var value = additionalElems.getBuf()[cnt].value;

        //if the name aleady is present then we are going to skip it, otherwise
        //we are going to push it down our options list which will be dragged
        //into our submit values
        options[name] = ('undefined' != typeof options[name])? options[name]  : value;
    }

    //now that we have encoded the additional forms we safely now can submit our request
    jsf.ajax.request(origin, event, options);
}
