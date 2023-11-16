"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTabs = exports.deleteTab = exports.updateTab = exports.createTab = void 0;
const tslib_1 = require("tslib");
const mongoose_1 = tslib_1.__importStar(require("mongoose"));
const dbService_1 = require("../services/dbService");
const responseHandlers_1 = require("./../utils/responseHandlers");
const defaults_1 = require("../utils/defaults");
const catchAsync = (fn) => {
    return defaults_1.defaults.catchAsync(fn, 'Tab');
};
exports.createTab = catchAsync((req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { Tab } = (req === null || req === void 0 ? void 0 : req.clientDBConnection) ? req.clientDBConnection.models : mongoose_1.default.models;
    const data = req.body;
    const tab = yield (0, dbService_1.create)(Tab, data);
    res.message = (_a = req === null || req === void 0 ? void 0 : req.i18n) === null || _a === void 0 ? void 0 : _a.t('tab.create');
    return (0, responseHandlers_1.createdDocumentResponse)(tab, res);
}));
exports.updateTab = catchAsync((req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { Tab } = (req === null || req === void 0 ? void 0 : req.clientDBConnection) ? req.clientDBConnection.models : mongoose_1.default.models;
    const data = req.body;
    const _id = req.params['tabId'];
    const updatedTab = yield (0, dbService_1.update)(Tab, { _id }, data);
    res.message = (_b = req === null || req === void 0 ? void 0 : req.i18n) === null || _b === void 0 ? void 0 : _b.t('tab.update');
    return (0, responseHandlers_1.successResponse)(updatedTab, res);
}));
exports.deleteTab = catchAsync((req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const { Tab } = (req === null || req === void 0 ? void 0 : req.clientDBConnection) ? req.clientDBConnection.models : mongoose_1.default.models;
    const _id = new mongoose_1.Types.ObjectId(req.params['tabId']);
    const deletedTab = yield (0, dbService_1.remove)(Tab, { _id });
    res.message = (_c = req === null || req === void 0 ? void 0 : req.i18n) === null || _c === void 0 ? void 0 : _c.t('tab.delete');
    return (0, responseHandlers_1.successResponse)(deletedTab, res);
}));
exports.getTabs = catchAsync((req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const { Tab } = (req === null || req === void 0 ? void 0 : req.clientDBConnection) ? req.clientDBConnection.models : mongoose_1.default.models;
    const widgetId = new mongoose_1.Types.ObjectId(req.params['widgetId']);
    const tab = yield (0, dbService_1.getAll)(Tab, { widgetId });
    res.message = (_d = req === null || req === void 0 ? void 0 : req.i18n) === null || _d === void 0 ? void 0 : _d.t('tab.getAll');
    return (0, responseHandlers_1.successResponse)(tab, res);
}));
//# sourceMappingURL=TabController.js.map