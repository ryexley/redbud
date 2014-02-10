define([
    "jquery",
    "underscore",
    "knockout"
], function ($, _, ko) {

    var App = function () {
        this.init();
    };

    _.extend(App.prototype, {
        init: function () {
            console.log("Redbud Analytics client app initialized...");
        }
    });

    return App;
});
