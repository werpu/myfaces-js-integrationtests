/*last file loaded, must restore the state of affairs*/
(function() {
    //some mobile browsers do not have a window object
    var target = window || document;
    var _RT = myfaces._impl.core._Runtime;
    var resetAbbreviation = function (name) {
        (!!_RT[name]) ?
                target[name] = _RT[name] : null;
    };
    resetAbbreviation("_MF_CLS");
    resetAbbreviation("_MF_SINGLTN");
    resetAbbreviation("_MF_OBJECT");
})();


