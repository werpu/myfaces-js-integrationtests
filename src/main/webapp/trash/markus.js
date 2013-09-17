
function delayer(delay) {
    this.delay = delay;
}

delayer.prototype = {
    timeout: null,
    onKeyUp: function (evt, src, delayFunction) {
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
        this.timeout = setTimeout(function () {
            var target = (src.id) ? src.id : src;
            delayFunction(src, evt);
        }, this.delay);
    }
}

//initialize