module.exports = function () {
    var config = {
        database: {
            host: "localhost",
            port: 28015,
            name: "redbud",
            tables: [
                { name: "tracking_data" },
                { name: "pageviews" },
                { name: "referrers" }
            ]
        }
    };

    return config;
};
