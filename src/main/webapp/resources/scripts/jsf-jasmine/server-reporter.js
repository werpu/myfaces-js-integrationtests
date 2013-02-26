(function () {
    if (!jasmine) {
        throw new Error("jasmine library does not exist in global namespace!");
    }

    var ServerReporter = function () {
        this.serviceUrl = "./collector.statistics2";
        this.started = false;
        this.finished = false;

        //results helpers
        this.results = {};
        this.resultsCnt = 0;
        this.passedCnt = 0;
        this.failedCnt = 0;
        this.startTime = null;
        this.endTime = null;
    };

    ServerReporter.prototype = {
        reportRunnerStarting: function (runner) {
            //first called
            //console.debug("reportRunnerStarting");
            this.startTime = (new Date()).getTime();
        },
        reportSpecStarting: function (spec) {
            //called once a spec is reported
            console.debug("reportSpecStarting");
            this.reportSpec(spec);
        },
        reportSpecResults: function (spec) {
            console.debug("reportSpecResults");
        },
        reportSuiteResults: function (suite) {
            //called for the suite results last of suite
            console.debug("reportSuiteResults");
        },
        reportRunnerResults: function (runner) {
            //last called for a detailed summary last of entire lifecycle
            console.debug("reportRunnerResults");
            this.endTime = (new Date()).getTime();
            this.summarize(runner);
            this.sendTestResults();
        },

        //we flatten out the suites spec, we ignore
        //that suites can host other suites,
        //since we do not use it
        reportSpec: function (spec) {
            var suite = spec.suite;
            this.results.suites = this.results.suites || {};
            var resultsSuite = this.results.suites[suite.id + ""];
            if (!resultsSuite) {
                resultsSuite = this.results.suites[suite.id + ""] = {};
                resultsSuite.description = suite.description;
                resultsSuite.failed = false;
                resultsSuite.specs = [];
            }
            var resultsSpec = {};
            resultsSpec.description = spec.description;
            resultsSpec.failed = !spec.results().passed();
            if (spec.results().passed()) {
                this.passedCnt++;
            } else {
                resultsSuite.failed = true;
                this.failedCnt++;
            }
            resultsSuite.specs.push(resultsSpec);
            this.resultsCnt++;
        },
        summarize: function () {
            var statistics = this.results.statistics = {};
            var href = window.location.href;
            //we cut off params we want only the href
            if (href.indexOf("?") != -1) {
                href = href.substr(0, href.indexOf("?"));
            }
            statistics.origin = href;
            statistics.numberOfTests = this.resultsCnt;
            statistics.numberOfFails = this.failedCnt;
            statistics.numberOfPassed = this.passedCnt;
            statistics.executionTime = this.endTime - this.startTime;
        },
        /*send the test results down the server
         * via a synchronous http post*/
        sendTestResults: function () {
            var xhr = new myfaces._impl.xhrCore.engine.Xhr1({
                xhrObject: myfaces._impl.core._Runtime.getXHRObject()
            });

            var data = "sendstats=true&testGroup=" + encodeURIComponent(JSON.stringify(this.results));
            xhr.open("post", this.serviceUrl, false);
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhr.send(data);
        }
    }

    // export public
    jasmine.ServerReporter = ServerReporter;
})();
