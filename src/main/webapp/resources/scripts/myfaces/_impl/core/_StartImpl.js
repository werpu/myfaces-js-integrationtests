/*we cannot privatize with a global function hence we store the values away for the init part*/
(function() {
    //some mobile browsers do not have a window object
    var target = window || document;
    var _RT = myfaces._impl.core._Runtime;
    _RT._MF_CLS = target._MF_CLS;
    _RT._MF_SINGLTN = target._MF_SINGLTN;

    target._MF_CLS = _RT.extendClass;
    target._MF_SINGLTN = _RT.singletonExtendClass;
})();
