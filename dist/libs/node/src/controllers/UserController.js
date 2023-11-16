"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPageData = exports.getWidgetData = void 0;
const tslib_1 = require("tslib");
const redis_1 = require("../utils/redis");
const responseHandlers_1 = require("./../utils/responseHandlers");
const defaults_1 = require("../utils/defaults");
const dataService_1 = require("../services/dataService");
const mongoose_1 = tslib_1.__importDefault(require("mongoose"));
const catchAsync = (fn) => {
    return defaults_1.defaults.catchAsync(fn, 'User');
};
// TO Do: Optimize the following
exports.getWidgetData = catchAsync((req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const connection = (req === null || req === void 0 ? void 0 : req.clientDBConnection) ? req.clientDBConnection : mongoose_1.default.connection;
    const { fresh } = req.query;
    const { code } = req.body;
    let widgetData = yield (0, redis_1.getRedisValue)(`widget_${code}`);
    if (widgetData && fresh !== 'true') {
        return (0, responseHandlers_1.successResponse)(widgetData, res);
    }
    widgetData = yield (0, dataService_1.getWidgetDataDB)(code, connection);
    if (!widgetData) {
        res.message = (_a = req === null || req === void 0 ? void 0 : req.i18n) === null || _a === void 0 ? void 0 : _a.t('user.widgetNotFound');
        return (0, responseHandlers_1.recordNotFound)(res);
    }
    yield (0, redis_1.setRedisValue)(`widget_${code}`, widgetData);
    return (0, responseHandlers_1.successResponse)(widgetData, res);
}));
// TO Do: Optimize the following
exports.getPageData = catchAsync((req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { Page, Widget } = (req === null || req === void 0 ? void 0 : req.clientDBConnection) ? req.clientDBConnection.models : mongoose_1.default.models;
    const { fresh } = req.query;
    const { code } = req.body;
    let pageData = yield (0, redis_1.getRedisValue)(`pageData_${code}`);
    if (pageData && fresh !== 'true') {
        return (0, responseHandlers_1.successResponse)(pageData, res);
    }
    pageData = yield (0, dataService_1.getPageDataDB)(code, Page, Widget);
    if (!pageData) {
        res.message = (_b = req === null || req === void 0 ? void 0 : req.i18n) === null || _b === void 0 ? void 0 : _b.t('user.pageNotFound');
        return (0, responseHandlers_1.recordNotFound)(res);
    }
    yield (0, redis_1.setRedisValue)(`pageData_${code}`, pageData);
    return (0, responseHandlers_1.successResponse)(pageData, res);
}));
//# sourceMappingURL=UserController.js.map