/*last file loaded, must restore the state of affairs*/
(function() {
    var _RT = myfaces._impl.core._Runtime;
    var resetAbbreviation = function (name) {
        (!!_RT[name]) ?
                window[name] = _RT[name] : null;
    };
    resetAbbreviation("_MF_CLS");
    resetAbbreviation("_MF_SINGLTN");
    resetAbbreviation("_MF_OBJECT");
})();


