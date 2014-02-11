define(["jquery", "underscore", "knockout"], function ($, _, ko) {

    var Pageviews = function () {
        this.init();
    };

    _.extend(Pageviews.prototype, {
        init: function () {
            console.log("Pageviews module initialized...");
        }
    });

    return Pageviews;

});
