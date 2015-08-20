define(["jquery", "underscore", "knockout"], function ($, _, ko) {

    var Referrers = function () {
        this.init();
    };

    _.extend(Referrers.prototype, {
        init: function () {
            console.log("Referrers module initialized...");
        }
    });

    return Referrers;

});
