(function () {

    "use strict";

    var _window = window,
        _document = document;

    var Tracker = function () {

        var getPayload = function () {
            var ref = getReferrer();

            return {
                url: _window.location.href,
                browserInfo: navigator,
                referrer: ref
            };
        };

        var getReferrer = function () {
            var referrer = "";

            try {
                referrer = _window.top.document.referrer;
            } catch (err) {
                if (_window.parent) {
                    referrer = _window.parent.document.referrer;
                }
            }

            if (referrer === "") {
                referrer = _document.referrer;
            }

            return referrer;
        };

        this.logVisit = function () {
            var payload = getPayload();

            console.log(payload);
        };

    };

    new Tracker().logVisit();

}());
