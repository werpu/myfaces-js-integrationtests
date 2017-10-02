///<reference path="../typings/index.d.ts"/>
///<reference path="../ts/impl/util/Monad.ts"/>
///<reference path="../ts/impl/util/LangTypes.ts"/>


import {myfaces} from "../ts/api/myfaces";
import config = myfaces.config;
import {Monadish} from "../ts/impl/util/Monad";
import Config = Monadish.Config;
import Optional = Monadish.Optional;


describe('optional tests', () => {
    it('fromnullable null', () => {
        expect(Optional.fromNullable(null).isPresent()).isNot;
        expect(Optional.fromNullable(null).isAbsent()).toBe(true);
    });
    it('fromnullable absent', () => {
        expect(Optional.fromNullable(Optional.absent).isPresent()).isNot;
    });
    it('fromnullable value', () => {
        expect(Optional.fromNullable(1).isPresent()).toBe(true);
        expect(Optional.fromNullable(1).isAbsent()).isNot;
    });

    it('flatmap/map test', () => {
        expect(Optional.fromNullable(Optional.fromNullable(1)).value).toBe(1);
        expect(Optional.fromNullable(Optional.fromNullable(1)).value).toBe(1);
    });

    it('flatmap2/map test', () => {
        expect(Optional.fromNullable(Optional.fromNullable(null)).isAbsent()).toBe(true);
        expect(Optional.fromNullable(Optional.fromNullable()).isAbsent()).toBe(true);
    });

    it('elvis test', () => {
        var myStruct = {
            data: {
                value: 1,
                value2: Optional.absent,
                value4: Optional.fromNullable(1)
            },
            data2: [
                {booga: "hello"},
                "hello2"
            ]
        };
        expect(Optional.fromNullable(myStruct).getIf("data", "value").value).toBe(1);
        expect(Optional.fromNullable(Optional.fromNullable(myStruct)).getIf("data", "value2").isAbsent()).toBe(true);
        expect(Optional.fromNullable(myStruct).getIf("data", "value3").isAbsent()).toBe(true);
        expect(Optional.fromNullable(myStruct).getIf("data", "value4").value).toBe(1);
        expect(Optional.fromNullable(Optional.fromNullable(myStruct)).getIf("data2[0]", "booga").isPresent()).toBe(true);
        expect(Optional.fromNullable(Optional.fromNullable(myStruct)).getIf("data2[1]").isPresent()).toBe(true);
        expect(Optional.fromNullable(Optional.fromNullable(myStruct)).getIf("data2").isPresent()).toBe(true);
        expect(Optional.fromNullable(Optional.fromNullable(myStruct)).getIf("data2", "hello2").isPresent()).toBe(false);
        expect(Optional.fromNullable(Optional.fromNullable(Optional.fromNullable(myStruct))).getIf("data2[0]", "booga").value).toBe("hello");

    });
});


describe('Config tests', () => {
    var setup = function ():Config {
        return new Config({
            data: {
                value: 1,
                value2: Optional.absent,
                value3: null
            },
            data2: [
                {booga: "hello"},
                "hello2"
            ]
        });
    };

    function structure(myStruct: any) {
        expect(Optional.fromNullable(myStruct).getIf("data", "value").value).toBe(1);
        expect(Optional.fromNullable(Optional.fromNullable(myStruct)).getIf("data", "value2").isAbsent()).toBe(true);
        expect(Optional.fromNullable(myStruct).getIf("data", "value3").isAbsent()).toBe(true);
        expect(Optional.fromNullable(myStruct).getIf("data", "value4").isAbsent()).toBe(true);
        expect(Optional.fromNullable(Optional.fromNullable(myStruct)).getIf("data2[0]", "booga").isPresent()).toBe(true);
        expect(Optional.fromNullable(Optional.fromNullable(myStruct)).getIf("data2[1]").isPresent()).toBe(true);
        expect(Optional.fromNullable(Optional.fromNullable(myStruct)).getIf("data2").isPresent()).toBe(true);
        expect(Optional.fromNullable(Optional.fromNullable(myStruct)).getIf("data2", "hello2").isPresent()).toBe(false);
        expect(Optional.fromNullable(Optional.fromNullable(myStruct)).getIf("data2[0]", "booga").value).toBe("hello");
    }

    function structureBroken(myStruct: any) {
        expect(Optional.fromNullable(myStruct).getIf("data", "value").value).isNot;
    }

    it('simple config', () => {
        let config = setup();
        config.apply("hello", "world", "from").value = "me";
        expect(Config.fromNullable(config.getIf("hello", "world", "from")).value).toEqual("me");
        expect(config.getIf("hello", "booga", "from").isAbsent()).toEqual(true);
        structure(config.value);

    });

    it('simple config2', () => {
        let config = setup();
        config.apply("hello", "world", "from").value = "me";
        expect(config.value.hello.world.from).toEqual("me");
        structure(config.value);
    });

    it('array config', () => {
        let config = setup();
        config.apply("hello[5]", "world[3]", "from[5]").value = "me";
        console.debug(JSON.stringify(config.toJson()));
        expect(config.getIf("hello[5]", "world[3]", "from[5]").value).toBe("me");
        expect(config.value.hello[5].world[3].from[5]).toBe("me");
        structure(config.value);
    });

    it('array config2', () => {
        let config = setup();
        config.apply("[5]", "world[3]", "from").value = "me";
        expect(config.getIf("[5]", "world[3]", "from").value).toBe("me");
        console.debug(JSON.stringify(config.toJson()));
        expect(config.value[5].world[3].from).toBe("me");
        structureBroken(config.value);
    });

    it('array config3', () => {
        let config = setup();
        config.apply("[5]", "[3]", "from").value = "me";
        expect(config.getIf("[5]", "[3]", "from").value).toBe("me");
        console.debug(JSON.stringify(config.toJson()));
        expect(config.value[5][3].from).toBe("me");
        structureBroken(config.value);
    });

    it('array config4', () => {
        let config = setup();
        config.apply("[5]", "[3]", "[2]").value = "me";
        expect(config.getIf("[5]", "[3]", "[2]").value).toBe("me");
        console.debug(JSON.stringify(config.toJson()));
        expect(config.value[5][3][2]).toBe("me");
        structureBroken(config.value);
    });

    it('array config5', () => {
        let config = setup();
        config.apply("[5]", "world[3]", "from[2]").value = "me";
        expect(config.getIf("[5]", "world[3]", "from[2]").value).toBe("me");
        console.debug(JSON.stringify(config.toJson()));
        expect(config.value[5].world[3].from[2]).toBe("me");
        structureBroken(config.value);
    });
});


