/**
 * we are setting a mocha puppeteer layer as integration test client on top
 * and call the running server to evaluate the results
 */
const puppeteer = require('puppeteer');
const {expect} = require('chai');
const _ = require('lodash');
const globalVariables = _.pick(global, ['browser', 'expect', 'window']);

// puppeteer options
const opts = {
    headless: true,
    timeout: 10000
};

async function runStandardPage(pageIndex) {
    this.timeout(10000);
    const page = await browser.newPage();
    console.log(`http://localhost:8080/IntegrationJSTest/integrationtestsjasmine/${pageIndex}.jsf`)
    await page.goto(`http://localhost:8080/IntegrationJSTest/integrationtestsjasmine/${pageIndex}.jsf`);
    await page.waitForFunction("document.body.querySelector('.jasmine-overall-result') != null && !!document.body.querySelector('.jasmine-overall-result').innerText.length", {
        timeout: 5000
    });
    //note this is an isolated scope, the function is passed to the chrome process
    //we can only send serializable data back for analysis
    let pageEvalResult = await page.$eval('body', element => {
        let innerText = element.querySelector(".jasmine-overall-result").innerText;
        let failures = element.querySelectorAll(".jasmine-failures a");
        let results = element.querySelectorAll(".jasmine-summary a");
        return {
            innerText: innerText,
            errorLog: Array.from(failures).map(item => item.innerText),
            results: Array.from(results).map(item => item.innerText)
        };
    });
    if(pageEvalResult.results.length) {
        console.debug(`Page ${pageIndex} Successes:`);
        pageEvalResult.results.forEach(item => console.log("=> "+item));
    }
    if(pageEvalResult.errorLog.length) {
        console.debug(`Page ${pageIndex} Failures:`)
        pageEvalResult.errorLog.forEach(item => console.log("=> "+item));
    }
    return pageEvalResult;
}

// expose variables
before(async function () {
    global.expect = expect;
    global.browser = await puppeteer.launch(opts);
    this.timeout(10000);

});


describe('Integration Testsuite MyFaces', function () {

    function loadPage() {
        let page_;
        return browser.newPage().then(page => {
            page_ = page;
            return page.goto('http://localhost:8080/IntegrationJSTest/integrationtestsjasmine/test1-protocol.jsf')
        }).then(resp => {
            return page_;
        })
    }

    it('testing protocol', async function () {
        const pageEvalResult = await runStandardPage.call(this, "test1-protocol");
        expect(pageEvalResult.innerText.match(/0\s*failures/gi) != null).to.be.true;
    });
    it('testing viewRoot', async function () {
        const pageEvalResult = await runStandardPage.call(this, "test2-viewroot");
        expect(pageEvalResult.innerText.match(/0\s*failures/gi) != null).to.be.true;
    });
    it('testing viewBody', async function () {
        const pageEvalResult = await runStandardPage.call(this, "test3-viewbody");
        expect(pageEvalResult.innerText.match(/0\s*failures/gi) != null).to.be.true;
    });
    it('testing chain', async function () {
        const pageEvalResult = await runStandardPage.call(this, "test4-chain");
        expect(pageEvalResult.innerText.match(/0\s*failures/gi) != null).to.be.true;
    });
    it('testing view root replacement 2', async function () {
        const pageEvalResult = await runStandardPage.call(this, "test5-viewroot2");
        expect(pageEvalResult.innerText.match(/0\s*failures/gi) != null).to.be.true;
    });
    it('testing basic table replacement', async function () {
        const pageEvalResult = await runStandardPage.call(this, "test6-tablebasic");
        expect(pageEvalResult.innerText.match(/0\s*failures/gi) != null).to.be.true;
    });
    it('testing event integration', async function () {
        const pageEvalResult = await runStandardPage.call(this, "test7-eventtest");
        expect(pageEvalResult.innerText.match(/0\s*failures/gi) != null).to.be.true;
    });
    it('testing ajax navigation', async function () {
        const pageEvalResult = await runStandardPage.call(this, "test8-navcase1");
        expect(pageEvalResult.innerText.match(/0\s*failures/gi) != null).to.be.true;
    });
    it('complex spreadsheet test', async function () {
        const pageEvalResult = await runStandardPage.call(this, "test9-spreadsheet");
        expect(pageEvalResult.innerText.match(/0\s*failures/gi) != null).to.be.true;
    });
    it('double evaluation of embedded scripts testcase', async function () {
        const pageEvalResult = await runStandardPage.call(this, "test10-doubleeval");
        expect(pageEvalResult.innerText.match(/0\s*failures/gi) != null).to.be.true;
    });
    it('various types of script blocks test', async function () {
        const pageEvalResult = await runStandardPage.call(this, "test11-scriptblocks");
        expect(pageEvalResult.innerText.match(/0\s*failures/gi) != null).to.be.true;
    });
    it('api decoration tests', async function () {
        const pageEvalResult = await runStandardPage.call(this, "test12-apidecoration");
        expect(pageEvalResult.innerText.match(/0\s*failures/gi) != null).to.be.true;
    });
    it('css replacement methods test', async function () {
        const pageEvalResult = await runStandardPage.call(this, "test13-cssreplacementhead");
        expect(pageEvalResult.innerText.match(/0\s*failures/gi) != null).to.be.true;
    });
    it('css replacement methods test', async function () {
        const pageEvalResult = await runStandardPage.call(this, "test13-cssreplacementhead");
        expect(pageEvalResult.innerText.match(/0\s*failures/gi) != null).to.be.true;
    });
    it('multiform test', async function () {
        const pageEvalResult = await runStandardPage.call(this, "test14-multiform");
        expect(pageEvalResult.innerText.match(/0\s*failures/gi) != null).to.be.true;
    });
    it('multiform test', async function () {
        const pageEvalResult = await runStandardPage.call(this, "test14-multiform");
        expect(pageEvalResult.innerText.match(/0\s*failures/gi) != null).to.be.true;
    });
    it('response with out source corner condition', async function () {
        const pageEvalResult = await runStandardPage.call(this, "test17-responseonly");
        expect(pageEvalResult.innerText.match(/0\s*failures/gi) != null).to.be.true;
    });
    it('test for proper event handler location callbacks', async function () {
        const pageEvalResult = await runStandardPage.call(this, "test18-eventlocations");
        expect(pageEvalResult.innerText.match(/0\s*failures/gi) != null).to.be.true;
    });
    it('execute parameter test', async function () {
        const pageEvalResult = await runStandardPage.call(this, "test19-execute");
        expect(pageEvalResult.innerText.match(/0\s*failures/gi) != null).to.be.true;
    });
});

// close browser and reset global variables
after(function () {
    global.browser.close();

    global.browser = globalVariables.browser;
    global.expect = globalVariables.expect;
});