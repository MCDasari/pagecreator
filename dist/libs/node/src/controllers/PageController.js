"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPages = exports.deletePage = exports.updatePage = exports.createPage = void 0;
const tslib_1 = require("tslib");
const mongoose_1 = tslib_1.__importStar(require("mongoose"));
const dbService_1 = require("../services/dbService");
const responseHandlers_1 = require("./../utils/responseHandlers");
const defaults_1 = require("../utils/defaults");
const dataService_1 = require("../services/dataService");
const catchAsync = (fn) => {
    return defaults_1.defaults.catchAsync(fn, 'Page');
};
exports.createPage = catchAsync((req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { Page } = (req === null || req === void 0 ? void 0 : req.clientDBConnection) ? req.clientDBConnection.models : mongoose_1.default.models;
    const data = req.body;
    const page = yield (0, dbService_1.create)(Page, data);
    res.message = (_a = req === null || req === void 0 ? void 0 : req.i18n) === null || _a === void 0 ? void 0 : _a.t('page.create');
    return (0, responseHandlers_1.createdDocumentResponse)(page, res);
}));
exports.updatePage = catchAsync((req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { Page, Widget } = (req === null || req === void 0 ? void 0 : req.clientDBConnection) ? req.clientDBConnection.models : mongoose_1.default.models;
    const data = req.body;
    const _id = req.params['id'];
    const updatedPage = yield (0, dbService_1.update)(Page, { _id }, data);
    res.message = (_b = req === null || req === void 0 ? void 0 : req.i18n) === null || _b === void 0 ? void 0 : _b.t('page.update');
    if (updatedPage)
        (0, dataService_1.updateRedisPage)(updatedPage.code, Page, Widget); // update redis
    return (0, responseHandlers_1.successResponse)(updatedPage, res);
}));
exports.deletePage = catchAsync((req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const { Page } = (req === null || req === void 0 ? void 0 : req.clientDBConnection) ? req.clientDBConnection.models : mongoose_1.default.models;
    const _id = new mongoose_1.Types.ObjectId(req.params['id']);
    const createdPage = yield (0, dbService_1.remove)(Page, { _id });
    res.message = (_c = req === null || req === void 0 ? void 0 : req.i18n) === null || _c === void 0 ? void 0 : _c.t('page.delete');
    return (0, responseHandlers_1.successResponse)(createdPage, res);
}));
exports.getPages = catchAsync((req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const { Page, Widget } = (req === null || req === void 0 ? void 0 : req.clientDBConnection) ? req.clientDBConnection.models : mongoose_1.default.models;
    const search = req.body.search || '';
    const { page, limit, populate, sort } = req.body.options;
    const customOptions = Object.assign({ populate,
        sort }, (page && limit ? { page, limit } : {}));
    const query = {
        isDeleted: false,
        $or: [
            {
                name: {
                    $regex: search,
                    $options: 'i',
                },
            },
            {
                code: {
                    $regex: search,
                    $options: 'i',
                },
            },
        ],
    };
    const pages = yield (0, dbService_1.list)(Page, query, customOptions);
    res.message = (_d = req === null || req === void 0 ? void 0 : req.i18n) === null || _d === void 0 ? void 0 : _d.t('page.getAll');
    return (0, responseHandlers_1.successResponse)(pages, res);
}));
//# sourceMappingURL=PageController.js.map