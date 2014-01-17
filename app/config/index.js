module.exports = function () {
    var config = {
        database: {
            host: "localhost",
            port: 28015,
            name: "redbud",
            tables: {
                "tracking_data": "id"
            }
        }
    };

    return config;
};
