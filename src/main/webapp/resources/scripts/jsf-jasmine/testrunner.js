(function () {
    var jasmineEnv = jasmine.getEnv();
    jasmineEnv.updateInterval = 250;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
    /**
     Create the `HTMLReporter`, which Jasmine calls to provide results of each spec and each suite. The Reporter is responsible for presenting results to the user.
     */
    //var htmlReporter = new jasmine.HtmlReporter(jasmineEnv);
    //var consoleReporter = new jasmine.ConsoleReporter(jasmineEnv);
    //var serverReporter = new jasmine.ServerReporter(jasmineEnv);

    var serverReporter = new jasmine.ServerReporter();


    //jasmineEnv.addReporter(htmlReporter);
    //jasmineEnv.addReporter(consoleReporter);
    jasmineEnv.addReporter(serverReporter);
    /**
     Delegate filtering of specs to the reporter. Allows for clicking on single suites or specs in the results to only run a subset of the suite.
     */
    //jasmineEnv.specFilter = function (spec) {
    //    return htmlReporter.specFilter(spec);
    //};
    /**
     Run all of the tests when the page finishes loading - and make sure to run any previous `onload` handler
     ### Test Results
     Scroll down to see the results of all of these specs.
     */
    $('.version').html(jasmine.version || (jasmine.getEnv().versionString && jasmine.getEnv().versionString()));




})();