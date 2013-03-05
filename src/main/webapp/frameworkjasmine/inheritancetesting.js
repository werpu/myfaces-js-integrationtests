var _Lang = myfaces._impl._util._Lang;
var _RT = myfaces._impl.core._Runtime;

var parent = function (hello) {
   // myfaces._impl._util._Lang.logDebug("constructor parent");
    this.hello = hello;
};
parent.prototype.sayHello = function () {
   // myfaces._impl._util._Lang.logDebug("calling from parent", this.hello);
};

_RT.extendClass("my.child", parent, {
    constructor_: function (hello1, hello2) {
     //   myfaces._impl._util._Lang.logDebug("constructor my.child");

        this._callSuper('constructor', hello1);
        this.hello2 = hello2;
    },
    sayHello: function () {
        this._callSuper("sayHello");
       // myfaces._impl._util._Lang.logDebug("calling from child", this.hello2);
    }
});

_RT.extendClass("my.child2", my.child, {
    constructor_: function (hello1, hello2) {
       // myfaces._impl._util._Lang.logDebug("constructor my.child2");
        this._callSuper('constructor', hello1, hello2);
        this.hello2 = hello2;
    },
    sayHello: function () {
        this._callSuper();
       // myfaces._impl._util._Lang.logDebug("calling from child2", this.hello2);
    }
});

/*child.prototype.sayHello = function() {
 this._callSuper('sayHello');
 console.debug("calling from child", this.hello2);
 };*/

var childInstance = new my.child("hello1", "hello2");
childInstance.sayHello();

var childInstance3 = new my.child2("hello2", "hello3");

_RT.extendClass("my.child3", childInstance3, {
    constructor_: function (hello1, hello2) {
        //myfaces._impl._util._Lang.logDebug("constructor my.child3");
        this._callSuper('constructor', hello1, hello2);
    }
});

var childInstance3 = new my.child3("hello2", "hello3");

describe("various inheritance patterns to be tested", function(){
    it("Child inheritance", function(){
       expect(childInstance instanceof my.child).toBeTruthy();
    });
    it("Child inheritance2", function(){
       expect(childInstance instanceof parent).toBeTruthy();
    });
    it("Exists global var (defaults to true)", function(){
       expect(_Lang.exists(window, 'childInstance')).toBeTruthy();
    });
    it("Exists no global var (should default to false)", function(){
       expect(_Lang.exists(window, "childInstance2")).toBeFalsy();
    });
    it("Exists global var (defaults to true)", function(){
       expect(_Lang.exists(window, 'childInstance3')).toBeTruthy();
    });
    it("instanceof check", function() {
       expect(childInstance3 instanceof parent).toBeTruthy();
       expect(childInstance3 instanceof my.child2).toBeTruthy();
    });
});