/** @param data the data
 * @param eventComparator the comparator with the events
 * @param global true if the handler is a global event
 */
function assertEvent(testcase, data, eventComparator, global) {
    testcase.assertTrue((global ? "[Global Handler]" : "[Local Handler]") + "event type is event", data.type == "event");
    testcase.assertTrue((global ? "[Global Handler]" : "[Local Handler]") + "event status is set", data.status);
    testcase.assertTrue((global ? "[Global Handler]" : "[Local Handler]") + "event status is part of the standard events" + data.status, eventComparator[data.status]);
    testcase.assertTrue((global ? "[Global Handler]" : "[Local Handler]") + "event.source is set", data.source);
    testcase.assertTrue((global ? "[Global Handler]" : "[Local Handler]") + "event.source.id is set", data.source.id);

}
var AjaxCase = myfaces._supportive.unittest.JSFAjaxTestCase;

var testGroup = new myfaces._supportive.unittest.TestGroup(
        {
            description:"MyFaces Event Lifecycle test",
            postcondition: function() {
                this.autoForward("./integrationtests/doubleEvalDetection.jsf");
                return true;
            }
        });

testGroup.addCase(
        new AjaxCase({
            description: "Local Phase Check",
            globalProcess: false,

            run: function() {
                this.ajaxRequest(document.getElementById("updateTrigger"), null, {render:"updatePanel",
                    execute:"updatePanel updateTrigger"});
            },
            postcondition: function() {
                var DEFAULT_EVENTTYPES = {"begin":true,"complete": true, "success": true};

                var localEvents = this.attr("processedEvents");
                this.assertTrue("All events must have passed", localEvents.length == 3);
                this.logInfo("Structural testing of all events processed");
                for (var cnt = 0; cnt != localEvents.length; cnt++) {
                    assertEvent(this, localEvents[cnt], DEFAULT_EVENTTYPES, false);
                }
            }
        }));
testGroup.addCase(
        new AjaxCase({
            description: "Global Phase Check",
            globalProcess: true,

            run: function() {
                this.ajaxRequest(document.getElementById("updateTrigger"), null, {render:"updatePanel",
                    execute:"updatePanel updateTrigger"});
            },
            postcondition: function() {
                var DEFAULT_EVENTTYPES = {"begin":true,"complete": true, "success": true};

                this.logInfo("global testing");
                var globalEvents = this.attr("processedGlobalEvents");
                this.assertTrue("All events must have passed", globalEvents.length == 3);
                for (var cnt = 0; cnt != globalEvents.length; cnt++) {
                    assertEvent(this, globalEvents[cnt], DEFAULT_EVENTTYPES, true);
                }
            }
        })
);
setTimeout(function() {
    testGroup.start();
}, 100);
