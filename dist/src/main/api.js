"use strict";
exports.__esModule = true;
exports.fetchData = void 0;
var axios_1 = require("axios");
var api_domain = "https://twichat-api-js.vercel.app";
// const api_domain = `https://api.quartzdev.gg`
function fetch(url) {
    return new Promise(function (resolve, reject) {
        axios_1["default"].get(url)
            .then(function (res) {
            res.status == 200 ? resolve(res.data) : resolve(false);
        })["catch"](function (err) {
            resolve(false);
        });
    });
}
function fetchData(username) {
    var url = "".concat(api_domain, "/twitch/user/").concat(username);
    return fetch(url);
}
exports.fetchData = fetchData;
//# sourceMappingURL=api.js.map