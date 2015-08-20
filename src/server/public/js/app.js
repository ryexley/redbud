define([
    "jquery",
    "underscore",
    "knockout"
], function ($, _, ko) {

    var App = function () {
        this.selectedApp = ko.observable();
        this.init();
    };

    _.extend(App.prototype, {
        init: function () {
            this.selectedApp("Select an app");
            console.log("Redbud Analytics client app initialized...");
        }
    });

    return App;
});
