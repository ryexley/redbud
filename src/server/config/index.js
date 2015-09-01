"use strict";

var _extend = require("lodash/object/assign");
var _merge = require("lodash/object/merge");
var _template = require("lodash/string/template");
var fs = require("fs");
var path = require("path");
var debug = require("debug")("redbud:config");

var env = process.env.NODE_ENV || "dev";

debug("ENV!>", env);

var defaultConfig = {};
var envConfig = {};

var defaultConfigPath = path.join(__dirname, "config.json");
var envConfigPath = path.join(__dirname, env + ".config.json");

if (fs.existsSync(defaultConfigPath)) {
    defaultConfig = require(defaultConfigPath);
}

if (fs.existsSync(envConfigPath)) {
    envConfig = require(envConfigPath);
}

var configData = _merge({}, defaultConfig, envConfig);
var config = require("configya")(configData);

_extend(config, {

    connectionString: function () {
        var connectionString,
            connectionStringTemplate = "postgres://${user}@${host}/${database}";

        if (this.postgres) {
            connectionString = _template(connectionStringTemplate)(this.postgres);
        }

        return connectionString;
    }

});

module.exports = config;
