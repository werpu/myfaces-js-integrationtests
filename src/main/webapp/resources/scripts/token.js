(function () {

    var _pageStorage = {};
    var _oldToken = null;

    //we now store the history of this page
    if (!window.jsf)
        window.jsf = {};
    window.jsf.history = {};

    //we assume a parametrized hash here

    /*helper routines*/
    /**
     * gets the hash values, we assume that the hash values can store
     * http get parameters for simulated get requests (google ajax query api)
     * hence we do more processing than needed
     */
    function getHashValues() {
        var hash = window.location.hash;

        //google hash api
        if (hash.indexOf("#") == 0) {
            hash = hash.substring(1, hash.length);
        }
        if (hash.indexOf("!") == 0) {
            hash = hash.substring(1, hash.length);
        }
        hash = hash.split("&");
        var ret = {};
        for (var cnt = hash.length - 1; cnt >= 0; cnt = cnt - 1) {
            var vals = hash[cnt].split("=");
            ret[vals[0]] = (vals.length > 1) ? vals[1] : null;
        }
        return ret;
    }

    /**
     * makes full hash representation of the hashes map
     * @param hashes
     */
    function makeHash(hashes) {
        var finalHashColl = [];
        for (var key in hashes) {
            if (!hashes.hasOwnProperty(key)) continue;
            finalHashColl.push(key + ((null != hashes[key]) ? "=" + hashes[key] : ""));
        }
        var ret = finalHashColl.join("&");
        if (ret.indexOf("&") == 0) {
            ret = ret.substring(1, ret.length);
        }
        return ret;
    }

    /**
     * returns a single value from the hash stored in the url
     * @param key
     */
    function getHashValue(key) {
        return getHashValues()[key];
    }

    /**
     * sets a single value into the hash stored in the url
     * @param key  the key to store the hash
     * @param theVal the value
     */
    function setHashValue(key, theVal) {
        var hashValues = getHashValues();
        hashValues[key] = theVal;
        window.location.hash = makeHash(hashValues);

    }

    /**
     * our snapshotting function which snapshots the page
     */
    window.jsf.history.snapshotPage = function () {
        //no onpopstate and no sessionstorage then we do nothing,
        // ie I am talking about you
        setTimeout(function () {
            if (!window.onpopstate) {
                window.jsf.history.setPopstateHandler();
            }

            var stateObj = {state:document.body.innerHTML};
            var statusIdx = "" + (new Date()).getTime();
            _pageStorage[statusIdx] = document.body.innerHTML;
            setHashValue("token", statusIdx);
            _oldToken = statusIdx;
        }, 10);
    }

    /**
     * the pop state handler setting routine
     * which sets the simualted pop state function (in our
     * case here an onhashchange function)
     */
    window.jsf.history.setPopstateHandler = function (handler) {
        window.onhashchange = function () {
            var token = getHashValue("token");
            if (token != _oldToken) {
                _oldToken = token;
                var statusIdx = getHashValue("token");
                var page = _pageStorage[statusIdx];
                if (page) {
                    document.body.innerHTML = page;
                }
            }
        }
    }

    /**
     * a onhashchange simulation which checks regularily
     * for hash changes
     */
    var oldGlobalHash;
    setInterval(function () {
        //not needed for ie9
        if (oldGlobalHash!= window.location.hash) {
            oldGlobalHash = window.location.hash;
            if (window.onhashchange) {
                window.onhashchange({});
            }

        }
    }, 1000);

    /**
     * initial snapshotting
     */
    window.jsf.history.snapshotPage();

    /**
     * Global jsf event handler which does snapshotting on every success
     */
    function theHandler(evt) {
        if (evt.status == "success") {
            window.jsf.history.snapshotPage();
        }
    }

    jsf.ajax.addOnEvent(theHandler);
})();