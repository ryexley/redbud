define(["jquery", "underscore", "knockout"], function ($, _, ko) {

    var Counts = function () {
        this.init();
    };

    _.extend(Counts.prototype, {
        init: function () {
            this.pageviewsToday = ko.observable(10);
            this.pageviewsTodayComp = ko.observable();
            this.pageviewsWeek = ko.observable(317);
            this.pageviewsWeekComp = ko.observable();
            this.pageviewsMonth = ko.observable(1304);
            this.pageviewsMonthComp = ko.observable();
            this.pageviewsYear = ko.observable(37417);
            this.pageviewsYearComp = ko.observable();
            console.log("Counts module initialized...");
        }
    });

    return Counts;

});
