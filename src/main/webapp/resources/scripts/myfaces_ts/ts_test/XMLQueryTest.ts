import {XMLQuery} from "../ts/impl/util/Nodes";
import {Lang} from "../ts/impl/util/Lang";
let fixture = `
<x1>
    <x2 attr="booga">
        <x4><x5>x5 reached<x6>x6 reached</x6></x5></x4>
        <x4></x4>
    </x2>
    <x2 attr="booga2"></x2>
    <x3><![CDATA[
        <div>hello world1</div>
        <div>hello world2</div>
    ]]><![CDATA[
        <div>hello world4</div>
        <div>hello world5</div>
    ]]></x3>
</x1>

`;

let errorFixture = `
    <x1>aaaaaaa </x1></x2>
`;

describe('domquery tests', () => {
    it('xml parse test', () => {
        //add one div for the fixture placeholder

        let xmlQuery = XMLQuery.parseXML(fixture);
        expect(xmlQuery.isXMLParserError()).toBe(false);
        expect(xmlQuery.length).toBe(1);
        expect(xmlQuery.getIf("x2").length).toBe(2);
        expect(xmlQuery.getIf("x3").cDATAAsString.indexOf("hello world1") != -1).toBe(true);
        expect(xmlQuery.getIf("x3").cDATAAsString.indexOf("hello world2") != -1).toBe(true);
        expect(xmlQuery.getIf("x3").cDATAAsString.indexOf("hello world4") != -1).toBe(true);
        expect(xmlQuery.getIf("x3").cDATAAsString.indexOf("hello world5") != -1).toBe(true);

        console.debug(xmlQuery.getIf("x2","x4","x5").textContent("\n"));
        expect(xmlQuery.getIf("x2","x4","x5").textContent("").indexOf("x5 reached") != -1).toBe(true);
        expect(xmlQuery.getIf("x2","*","x5").textContent("").indexOf("x5 reached") != -1).toBe(true);
        expect(xmlQuery.getIf("*","*","*").textContent("").indexOf("x5 reached") != -1).toBe(true);
        expect(xmlQuery.getIf("*","*","*", "x6").textContent("").indexOf("x6 reached") != -1).toBe(true);
        expect(xmlQuery.byTagName("x4").length).toBe(2);

        expect(xmlQuery.byTagName("x6").textContent("").indexOf("x6 reached") != -1).toBe(true);
        expect(xmlQuery.byTagName("x7").textContent("").indexOf("x6 reached") == -1).toBe(true);

    });
    it('xml error test', () => {
        let xmlQuery = XMLQuery.parseXML(errorFixture);
        expect(xmlQuery.isXMLParserError()).toBe(true);
        expect(Lang.instance.trim(xmlQuery.parserErrorText("")).length > 0).toBe(true);
    });
});