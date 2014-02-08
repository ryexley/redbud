require.config({
    paths: {
        "jquery": "../bower-components/jquery/jquery.min",
        "underscore": "../bower-components/underscore/underscore-min",
        "knockout": "../bower-components/knockout.js/knockout"
    },
    shim: {
        "jquery": {
            exports: "$"
        },
        "underscore": {
            exports: "_"
        },
        "knockout": {
            deps: ["jquery"]
        }
    }
});

define(["jquery", "underscore", "knockout"], function ($, _, ko) {

    var App = function () {
        this.init();
    };

    _.extend(App.prototype, {

        init: function () {
            console.log("Redbud Analytics client app initialized...");
        }

    });

    window.redbud = new App();

});
