require.config({
    paths: {
        "jquery": "../bower-components/jquery/jquery.min",
        "underscore": "../bower-components/underscore/underscore-min",
        "knockout": "../bower-components/knockout.js/knockout",
        "knockout-amd-helpers": "../bower-components/knockout-amd-helpers/build/knockout-amd-helpers.min",
        "text": "../bower-components/requirejs-text/text"
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

define([
    "jquery",
    "underscore",
    "knockout",
    "app",
    "knockout-amd-helpers",
    "text"
], function ($, _, ko, App) {

    ko.amdTemplateEngine.defaultPath = "../templates";
    ko.bindingHandlers.module.baseDir = "view-models";

    var app = new App();
    window.redbud = app;

    ko.applyBindings(app, document.documentElement);

});
