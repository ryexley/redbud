(function () {

    "use strict";

    var _window = window,
        _document = document,
        _navigator = navigator;

    var Tracker = function () {

        var trackingData = function () {
            return {
                url: _window.location.href,
                browserInfo: getBrowserInfo(),
                referrer: getReferrer(),
                timestamp: +new Date()
            };
        };

        var getBrowserInfo = function () {
            var browserInfo = {
                appCodeName: _navigator.appCodeName || "",
                appName: _navigator.appName || "",
                appVersion: _navigator.appVersion || "",
                cookieEnabled: _navigator.cookieEnabled || "",
                doNotTrack: _navigator.doNotTrack || "",
                language: _navigator.language || "",
                onLine: _navigator.onLine || "",
                platform: _navigator.platform || "",
                product: _navigator.product || "",
                productSub: _navigator.productSub || "",
                userAgent: _navigator.userAgent || "",
                vendor: _navigator.vendor || "",
                vendorSub: _navigator.vendorSub || ""
            };

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

                xhr.open("POST", "http://redbud.dev/track", true);
                xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                xhr.send(data);
                console.log("Tracking data submitted successfully");
            } catch (error) {
                console.log("Error posting tracking data", error);
            }
        };

        this.logVisit = function () {
            if (_redbud && _redbud.siteId) {
                var data = trackingData();
                data.siteId = _redbud.siteId;

                sendTrackingData(JSON.stringify(data));
            }
        };

    };

    new Tracker().logVisit();

}());
