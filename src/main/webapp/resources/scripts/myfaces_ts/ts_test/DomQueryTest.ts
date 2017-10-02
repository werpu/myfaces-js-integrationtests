///<reference path="../typings/index.d.ts"/>
///<reference path="../ts/impl/util/Monad.ts"/>
///<reference path="../ts/impl/util/LangTypes.ts"/>

import {DomQuery} from "../ts/impl/util/Nodes";

var fixture: string = `<div id="outer1">
    <div id="test2"></div>
    <div id="test3"></div>
</div>
<div id="outer2">
    <div id="test4"></div>
    <div id="test5"></div>
</div>`;

var outerHTMLFixture = `
<div id="outer3">
    <div id="test41"></div>
    <div id="test42"></div>
</div>
<div id="outer4">
    <div id="test51"></div>
    <div id="test52"></div>
</div>
`;

var outerHTMLFixtureWithScript = `
<div id="outer3">
    <div id="test41"></div>
    <div id="test42"></div>
</div>
<div id="outer4">
    <div id="test51"></div>
    <div id="test52">
         <script type="text/javascript">
            var elem = document.createElement("div");
            elem.innerHTML = "hello world2";
            elem.id = "created4";
            document.body.appendChild(elem);
        </script>
        <script type="text/javascript">     
            //<![CDATA[
            var elem = document.createElement("div");
            elem.innerHTML = "hello world3";
            elem.id = "created5";
            document.body.appendChild(elem);
            //]]>
        </script>
    </div>
   
</div>
`;


describe('domquery tests', () => {

    beforeEach(() => {
        //jasmine.getFixtures().fixturesPath = "/Users/werpu2/development/workspace/myfaces-js-integrationtests/src/main/webapp/resources/scripts/myfaces_ts/ts_test/html";  // path to your templates
        jasmine.getFixtures().set(fixture);
    });

    afterEach(() => {
        jasmine.getFixtures().cleanUp();
    });

    it('by tagname test', () => {
        //add one div for the fixture placeholder
        expect(DomQuery.querySelectorAll("div").length == 7).toBe(true);
    });

    it('by tagname test2', () => {
        //add one div for the fixture placeholder
        expect(DomQuery.querySelectorAll("div").get(1).id.value).toBe("outer1");
        expect(DomQuery.querySelectorAll("div").get(3).id.value).toBe("test3");
        expect(DomQuery.querySelectorAll("div").get(6).id.value).toBe("test5");
    });

    it('outerHTMLTest', () => {
        //add one div for the fixture placeholder
        DomQuery.querySelectorAll("#outer1").outerHTML(outerHTMLFixture);
        expect(DomQuery.querySelectorAll("#outer4 #test51").length == 1).toBe(true);
        expect(DomQuery.querySelectorAll("#outer1").isAbsent()).toBe(true);
    });

    it('global eval', () => {
        DomQuery.globalEval(`
            var elem = document.createElement("div");
            elem.innerHTML = "hello world";
            elem.id = "created1";
            document.body.appendChild(elem);
        
        `);

        DomQuery.globalEval(`
            var elem = document.createElement("div");
            elem.innerHTML = "hello world2";
            elem.id = "created2";
            document.body.appendChild(elem);
        `);


        expect(DomQuery.querySelectorAll("#created1").isPresent()).toBe(true);
        expect(DomQuery.querySelectorAll("#created2").isPresent()).toBe(true);
    });

    it('outerHTMLTest with eval', () => {
        //add one div for the fixture placeholder

        DomQuery.querySelectorAll("#outer1").outerHTML(outerHTMLFixtureWithScript, true);

        expect(DomQuery.querySelectorAll("#outer4 #test51").length == 1).toBe(true);
        expect(DomQuery.querySelectorAll("#outer1").isAbsent()).toBe(true);
        expect(DomQuery.querySelectorAll("#created4").isPresent()).toBe(true);
        expect(DomQuery.querySelectorAll("#created5").isPresent()).toBe(true);
    });


});