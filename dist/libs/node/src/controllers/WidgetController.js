"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLanguages = exports.getCollectionData = exports.getWidgetTypes = exports.getItemsTypes = exports.partialUpdateWidget = exports.getSingleWidget = exports.getWidgets = exports.deleteWidget = exports.updateWidget = exports.createWidget = void 0;
const tslib_1 = require("tslib");
const mongoose_1 = tslib_1.__importStar(require("mongoose"));
// import { Widget, Item, SrcSet } from './../models';
const dbService_1 = require("../services/dbService");
const responseHandlers_1 = require("./../utils/responseHandlers");
const defaults_1 = require("../utils/defaults");
const helper_1 = require("../utils/helper");
const types_1 = require("../types");
const dataService_1 = require("../services/dataService");
const catchAsync = (fn) => {
    return defaults_1.defaults.catchAsync(fn, 'Widget');
};
const deleteItems = (widgetId, Item) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    yield (0, dbService_1.deleteAll)(Item, { widgetId: new mongoose_1.Types.ObjectId(widgetId) });
});
const createItems = (itemsData, widgetId, models) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { Item, SrcSet } = models;
    itemsData = itemsData.map((item) => (Object.assign(Object.assign({}, item), { _id: new mongoose_1.Types.ObjectId(), widgetId })));
    const srcSetItems = itemsData.reduce((acc, item) => {
        if (Array.isArray(item.srcset)) {
            acc.push(...item.srcset.map((srcSetItem) => (Object.assign(Object.assign({}, srcSetItem), { itemId: item._id }))));
            delete item.srcset;
        }
        return acc;
    }, []);
    yield (0, dbService_1.bulkInsert)(Item, itemsData);
    yield (0, dbService_1.bulkInsert)(SrcSet, srcSetItems);
});
exports.createWidget = catchAsync((req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const models = (req === null || req === void 0 ? void 0 : req.clientDBConnection) ? req.clientDBConnection.models : mongoose_1.default.models;
    const { Widget } = models;
    const data = req.body;
    let items = [];
    if ('items' in data) {
        items = JSON.parse(JSON.stringify(data.items));
        delete data.items;
    }
    const widget = yield (0, dbService_1.create)(Widget, data);
    if (items.length > 0) {
        yield createItems(items, widget._id, models);
    }
    res.message = (_a = req === null || req === void 0 ? void 0 : req.i18n) === null || _a === void 0 ? void 0 : _a.t('widget.create');
    return (0, responseHandlers_1.createdDocumentResponse)(widget, res);
}));
exports.updateWidget = catchAsync((req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const connection = (req === null || req === void 0 ? void 0 : req.clientDBConnection) ? req.clientDBConnection : mongoose_1.default.connection;
    const { Widget, Item } = connection.models;
    const data = req.body;
    const _id = req.params['id'];
    let items = [];
    if ('items' in data) {
        items = JSON.parse(JSON.stringify(data.items));
        delete data.items;
    }
    const updatedWidget = yield (0, dbService_1.update)(Widget, { _id }, data);
    if (items.length > 0 && updatedWidget) {
        yield deleteItems(_id, Item);
        yield createItems(items, updatedWidget._id, connection.models);
    }
    if (updatedWidget)
        (0, dataService_1.updateRedisWidget)(updatedWidget.code, connection);
    res.message = (_b = req === null || req === void 0 ? void 0 : req.i18n) === null || _b === void 0 ? void 0 : _b.t('widget.update');
    return (0, responseHandlers_1.successResponse)(updatedWidget, res);
}));
exports.deleteWidget = catchAsync((req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const { Widget, Item } = (req === null || req === void 0 ? void 0 : req.clientDBConnection) ? req.clientDBConnection.models : mongoose_1.default.models;
    yield deleteItems(req.params['id'], Item);
    const _id = new mongoose_1.Types.ObjectId(req.params['id']);
    const deletedNotification = yield (0, dbService_1.remove)(Widget, { _id });
    res.message = (_c = req === null || req === void 0 ? void 0 : req.i18n) === null || _c === void 0 ? void 0 : _c.t('widget.delete');
    return (0, responseHandlers_1.successResponse)(deletedNotification, res);
}));
exports.getWidgets = catchAsync((req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const { Widget } = (req === null || req === void 0 ? void 0 : req.clientDBConnection) ? req.clientDBConnection.models : mongoose_1.default.models;
    const search = req.body.search || '';
    const { collectionItems } = req.body;
    const { page, limit, sort } = req.body.options;
    const all = (typeof req.body.all !== 'undefined' && req.body.all === true) || false;
    const isActive = typeof req.body.isActive !== 'undefined'
        ? req.body.isActive || false
        : null;
    const customOptions = Object.assign({ pagination: !all, sort, select: 'name code isActive' }, (page && limit ? { page, limit } : {}));
    const orOptions = [];
    if (search) {
        orOptions.push({ name: { $regex: search, $options: 'i' } });
        orOptions.push({ code: { $regex: search, $options: 'i' } });
    }
    else {
        orOptions.push({});
    }
    if (Array.isArray(collectionItems) && collectionItems.length) {
        orOptions.push({ _id: { $in: collectionItems } });
    }
    const query = {
        isDeleted: false,
        isActive: { $in: isActive === null ? [true, false] : [isActive] },
        $or: orOptions,
    };
    const notifications = yield (0, dbService_1.list)(Widget, query, customOptions);
    res.message = (_d = req === null || req === void 0 ? void 0 : req.i18n) === null || _d === void 0 ? void 0 : _d.t('widget.getAll');
    return (0, responseHandlers_1.successResponse)(notifications, res);
}));
exports.getSingleWidget = catchAsync((req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    var _e, _f;
    const { Item, Widget } = (req === null || req === void 0 ? void 0 : req.clientDBConnection) ? req.clientDBConnection.models : mongoose_1.default.models;
    const _id = req.params['id'];
    const widget = yield (yield (0, dbService_1.getOne)(Widget, { _id, isDeleted: true })).toJSON();
    widget['items'] = yield Item.aggregate([
        {
            $match: {
                widgetId: new mongoose_1.Types.ObjectId(_id),
                isDeleted: false,
            },
        },
        {
            $project: Object.assign({}, defaults_1.commonExcludedFields),
        },
        ...(defaults_1.defaults.languages && ((_e = defaults_1.defaults.languages) === null || _e === void 0 ? void 0 : _e.length) > 0
            ? defaults_1.defaults.languages.reduce((arr, lng) => {
                arr.push({
                    $lookup: {
                        from: 'file',
                        let: { imgsId: { $toObjectId: `$imgs.${lng.code}` } },
                        as: `imgs.${lng.code}`,
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ['$_id', '$$imgsId'],
                                    },
                                },
                            },
                            {
                                $project: Object.assign(Object.assign({}, defaults_1.commonExcludedFields), { width: 0, module: 0, height: 0 }),
                            },
                        ],
                    },
                }, {
                    $unwind: {
                        path: `$imgs.${lng.code}`,
                        preserveNullAndEmptyArrays: true,
                    },
                });
                return arr;
            }, [])
            : [
                {
                    $lookup: {
                        from: 'file',
                        let: { imgId: '$img' },
                        as: 'img',
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ['$_id', '$$imgId'],
                                    },
                                },
                            },
                            {
                                $project: Object.assign(Object.assign({}, defaults_1.commonExcludedFields), { width: 0, module: 0, height: 0 }),
                            },
                        ],
                    },
                },
                {
                    $unwind: {
                        path: '$img',
                        preserveNullAndEmptyArrays: true,
                    },
                },
            ]),
        {
            $lookup: {
                from: 'srcsets',
                let: { item: '$_id' },
                as: 'srcset',
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ['$itemId', '$$item'],
                            },
                        },
                    },
                    {
                        $project: Object.assign(Object.assign({}, defaults_1.commonExcludedFields), { _id: 0, itemId: 0 }),
                    },
                ],
            },
        },
    ]);
    res.message = (_f = req === null || req === void 0 ? void 0 : req.i18n) === null || _f === void 0 ? void 0 : _f.t('widget.getOne');
    return (0, responseHandlers_1.successResponse)(widget, res);
}));
exports.partialUpdateWidget = catchAsync((req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    var _g;
    const { Widget } = (req === null || req === void 0 ? void 0 : req.clientDBConnection) ? req.clientDBConnection.models : mongoose_1.default.models;
    const data = req.body;
    const _id = req.params['id'];
    const updatedNotification = yield (0, dbService_1.update)(Widget, { _id }, data);
    res.message = (_g = req === null || req === void 0 ? void 0 : req.i18n) === null || _g === void 0 ? void 0 : _g.t('widget.partialUpdate');
    return (0, responseHandlers_1.successResponse)(updatedNotification, res);
}));
exports.getItemsTypes = catchAsync((req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    var _h;
    const itemsTypes = [
        {
            value: Object.keys(types_1.ItemsType)[0],
            label: Object.values(types_1.ItemsType)[0],
        },
    ];
    defaults_1.defaults.collections.forEach((item) => {
        itemsTypes.push({
            value: item.collectionName,
            label: item.title,
        });
    });
    res.message = (_h = req === null || req === void 0 ? void 0 : req.i18n) === null || _h === void 0 ? void 0 : _h.t('widget.getItemsTypes');
    return (0, responseHandlers_1.successResponse)(itemsTypes, res);
}));
exports.getWidgetTypes = catchAsync((req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    var _j;
    const widgetTypes = Object.entries(types_1.WidgetTypes).map((e) => ({
        label: e[1],
        value: e[0],
    }));
    if (Array.isArray(defaults_1.defaults.customWidgetTypes) &&
        defaults_1.defaults.customWidgetTypes.length > 0) {
        widgetTypes.push(...defaults_1.defaults.customWidgetTypes);
    }
    res.message = (_j = req === null || req === void 0 ? void 0 : req.i18n) === null || _j === void 0 ? void 0 : _j.t('widget.getWidgetTypes');
    return (0, responseHandlers_1.successResponse)(widgetTypes, res);
}));
exports.getCollectionData = catchAsync((req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    var _k;
    const connection = (req === null || req === void 0 ? void 0 : req.clientDBConnection) ? req.clientDBConnection : mongoose_1.default.connection;
    let limit = 10;
    const { search, collectionName, collectionItems } = req.body;
    if (Array.isArray(collectionItems))
        limit = Math.max(collectionItems.length, limit);
    const collectionItem = defaults_1.defaults.collections.find((collection) => collection.collectionName === collectionName);
    if (!collectionItem) {
        throw new Error(`No collection is specified with ${collectionName}`);
    }
    // setting up mongoose model
    const TempModel = (0, helper_1.getCollectionModal)(collectionName, connection);
    // fetching data
    let query = collectionItem.filters || {};
    const orOptions = [];
    let addFieldOptions = {};
    if (search &&
        Array.isArray(collectionItem.searchColumns) &&
        collectionItem.searchColumns.length) {
        collectionItem.searchColumns.forEach((column) => orOptions.push({
            [column]: {
                $regex: search,
                $options: 'i',
            },
        }));
    }
    else {
        orOptions.push({});
    }
    if (Array.isArray(collectionItems) && collectionItems.length) {
        addFieldOptions = {
            __order: {
                $indexOfArray: [
                    collectionItems,
                    {
                        $toString: '$_id',
                    },
                ],
            },
        };
        orOptions.push({ _id: { $in: (0, helper_1.formatCollectionItems)(collectionItems) } });
    }
    if (orOptions.length > 0) {
        query = Object.assign(Object.assign({}, query), { $or: orOptions });
    }
    const collectionData = yield TempModel.aggregate([
        ...(Array.isArray(collectionItem.aggregations)
            ? collectionItem.aggregations
            : []),
        {
            $match: query,
        },
        { $addFields: addFieldOptions },
        {
            $sort: {
                __order: -1,
            },
        },
        {
            $limit: limit,
        },
    ]);
    res.message = (_k = req === null || req === void 0 ? void 0 : req.i18n) === null || _k === void 0 ? void 0 : _k.t('widget.getCollectionData');
    return (0, responseHandlers_1.successResponse)({ docs: collectionData }, res);
}));
exports.getLanguages = catchAsync((req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    return (0, responseHandlers_1.successResponse)(Array.isArray(defaults_1.defaults.languages) ? defaults_1.defaults.languages : [], res);
}));
//# sourceMappingURL=WidgetController.js.map