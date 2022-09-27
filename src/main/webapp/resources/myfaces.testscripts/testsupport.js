/*
 Supportive files for our selenium tests!
 */

var target = "./test.mockup";

/**
 * ppr emitting function
 */
function emitPPR(source, event, action, useIframe, formName) {
    var Lang = myfaces._impl._util._Lang;


    document.getElementById(formName || "form1").action = target;

    if (arguments.length <= 3) {
        faces.ajax.request(/*String|Dom Node*/ source, /*|EVENT|*/ (window.event)? window.event: event, /*{|OPTIONS|}*/ {op:action, onevent: (data) => {
            console.log(JSON.stringify(data));
            }});
    } else {
        faces.ajax.request(/*String|Dom Node*/ source, /*|EVENT|*/ (window.event)? window.event: event, /*{|OPTIONS|}*/ {op:action,

            onevent: (data) => {
                console.log(JSON.stringify(data));
            }
            , myfaces: {transportType:"multipartQueuedPost"}});
   }

}


function fixViewStates(data) {
    if (data.status == "success") {
        //do the viewstate post processing here
        var responseXML = data.responseXML;
        if (!responseXML) return;

        //first fetch the update element holding the viewstate
        var viewStateVal = null;
        var foundUpdates = responseXML.getElementsByTagName("update");
        if (!foundUpdates) return;
        for (var cnt = foundUpdates.length - 1; viewStateVal == null && cnt >= 0; cnt -= 1) {
            if (foundUpdates[cnt].getAttribute("id") == "jakarta.faces.ViewState") {
                viewStateVal = foundUpdates[cnt].firstChild.nodeValue;
            }
        }

        if (!viewStateVal) return;

        for (var cnt = document.forms.length - 1; cnt >= 0; cnt -= 1) {
            //viewstate is in a cdata block
            _setVSTForm(document.forms[cnt], viewStateVal);
        }

    }
}

function _setVSTForm(theForm, viewstateVal) {
    var viewStateField = (theForm.elements) ? theForm.elements["jakarta.faces.ViewState"] : null;//this._Dom.findFormElement(elem, this.P_VIEWSTATE);

    if (viewStateField) {
        viewStateField.value = viewstateVal;
    } else if (!viewStateField) {
        var element = document.createElement("div");
        element.innerHTML = ["<input type='hidden' name='", "jakarta.faces.ViewState" ,"' value='" , viewstateVal , "' />"].join("");
        try {
            theForm.appendChild(element.childNodes[0]);
        } finally {
            element.innerHTML = "";
            //ie gc screwup fixup
            if ("undefined" != typeof element.outerHTML) {
                element.outerHTML = "";
            }
        }
    }
}