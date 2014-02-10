define(["jquery", "underscore", "knockout"], function ($, _, ko) {

    var Counts = function () {
        this.init();
    };

    _.extend(Counts.prototype, {
        init: function () {
            this.pageviews = ko.observable();
            this.pageviews("blah blah");
            console.log("Counts module initialized...");
        }
    });

    return Counts;

});
