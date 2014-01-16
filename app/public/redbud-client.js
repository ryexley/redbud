(function () {

    "use strict";

    var _window = window,
        _document = document;

    var Tracker = function () {

        var trackingData = function () {
            return {
                url: _window.location.href,
                browserInfo: getBrowserInfo(),
                referrer: getReferrer()
            };
        };

        var getBrowserInfo = function () {
            var browserInfo = _window.navigator;
            delete browserInfo.geolocation;
            delete browserInfo.mimeTypes;
            delete browserInfo.plugins;
            delete browserInfo.webkitPersistentStorage;
            delete browserInfo.webkitTemporaryStorage;

            return browserInfo;
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

        var sendTrackingData = function (data) {
            try {
                var xhr = _window.XMLHttpRequest ?
                          new _window.XMLHttpRequest() :
                          _window.ActiveXObject ?
                          new ActiveXObject("Microsoft.XMLHTTP") :
                          null;

                xhr.onreadystatechange = function () {
                    if (this.readyState === 4 && this.status !== 200) {
                        console.log("Request failed", data);
                    }
                };

                xhr.open("POST", "http://localhost:3000/track", true);
                xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                xhr.send(data);
                console.log("Tracking data submitted successfully");
            } catch (error) {
                console.log("Error posting tracking data", error);
            }
        };

        this.logVisit = function () {
            var data = trackingData();

            sendTrackingData(JSON.stringify(data));
        };

    };

    new Tracker().logVisit();

}());
