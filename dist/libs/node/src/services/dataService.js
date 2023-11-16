"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleResetData = exports.handleUpdateData = exports.updateRedisPage = exports.getPageDataDB = exports.updateRedisWidget = exports.getWidgetDataDB = void 0;
const tslib_1 = require("tslib");
const helper_1 = require("../utils/helper");
const redis_1 = require("../utils/redis");
const defaults_1 = require("../utils/defaults");
const getAggregationQuery = ({ collectionName, ids, }) => {
    const collectionConfig = defaults_1.defaults.collections.find((c) => c.collectionName === collectionName);
    const aggregateQueryItem = [];
    if (Array.isArray(collectionConfig === null || collectionConfig === void 0 ? void 0 : collectionConfig.aggregations) &&
        (collectionConfig === null || collectionConfig === void 0 ? void 0 : collectionConfig.aggregations.length)) {
        aggregateQueryItem.push(...collectionConfig.aggregations);
    }
    aggregateQueryItem.push({
        $match: Object.assign({ _id: {
                $in: ids,
            } }, ((collectionConfig === null || collectionConfig === void 0 ? void 0 : collectionConfig.match) || {})),
    }, { $addFields: { __order: { $indexOfArray: [ids, '$_id'] } } }, { $sort: { __order: 1 } });
    return aggregateQueryItem;
};
const getWidgetDataDB = (code, connection) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { Widget } = connection.models;
    const widgetDataArr = (yield Widget.aggregate([
        {
            $match: {
                isDeleted: false,
                isActive: true,
                code,
            },
        },
        {
            // Get only the fields that are not excluded
            $project: Object.assign({}, defaults_1.commonExcludedFields),
        },
        {
            // Get Items data
            $lookup: {
                from: 'items',
                let: { widget: '$_id' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ['$widgetId', '$$widget'],
                            },
                            isDeleted: false,
                        },
                    },
                    ...(defaults_1.defaults.languages && ((_a = defaults_1.defaults.languages) === null || _a === void 0 ? void 0 : _a.length) > 0
                        ? defaults_1.defaults.languages.reduce((arr, lng) => {
                            arr.push({
                                $lookup: {
                                    from: 'file',
                                    let: { img: { $toObjectId: `$imgs.${lng.code}` } },
                                    as: `images.${lng.code}`,
                                    pipeline: [
                                        {
                                            $match: {
                                                $expr: {
                                                    $eq: ['$_id', '$$img'],
                                                },
                                            },
                                        },
                                        {
                                            $project: {
                                                _id: 1,
                                                uri: 1,
                                            },
                                        },
                                    ],
                                },
                            }, {
                                $unwind: {
                                    path: `$images.${lng.code}`,
                                    preserveNullAndEmptyArrays: true,
                                },
                            });
                            return arr;
                        }, [])
                        : [
                            {
                                $lookup: {
                                    from: 'file',
                                    let: { img: '$img' },
                                    as: 'image',
                                    pipeline: [
                                        {
                                            $match: {
                                                $expr: {
                                                    $eq: ['$_id', '$$img'],
                                                },
                                            },
                                        },
                                        {
                                            $project: {
                                                _id: 1,
                                                uri: 1,
                                            },
                                        },
                                    ],
                                },
                            },
                            {
                                $unwind: {
                                    path: '$image',
                                    preserveNullAndEmptyArrays: true,
                                },
                            },
                        ]),
                    {
                        $project: Object.assign({ sequence: 0, imgs: 0 }, defaults_1.commonExcludedFields),
                    },
                    // {
                    //   $lookup: {
                    //     from: 'srcsets',
                    //     let: { item: '$_id' },
                    //     as: 'srcset',
                    //     pipeline: [
                    //       {
                    //         $match: {
                    //           $expr: {
                    //             $eq: ['$itemId', '$$item'],
                    //           },
                    //         },
                    //       },
                    //       {
                    //         $project: {
                    //           ...commonExcludedFields,
                    //           _id: 0,
                    //           itemId: 0,
                    //         },
                    //       },
                    //     ],
                    //   },
                    // },
                ],
                as: 'items',
            },
        },
    ]));
    if (!widgetDataArr.length) {
        return null;
    }
    const widgetData = widgetDataArr[0];
    if (widgetData.collectionName &&
        widgetData.collectionItems &&
        widgetData.collectionItems.length > 0) {
        const aggregateQueryItem = getAggregationQuery({
            collectionName: widgetData.collectionName,
            ids: widgetData.collectionItems,
        });
        const collectionModal = (0, helper_1.getCollectionModal)(widgetData.collectionName, connection);
        const collectionItems = yield collectionModal.aggregate(aggregateQueryItem);
        widgetData.collectionItems = collectionItems;
    }
    if (widgetData.collectionName &&
        widgetData.tabs &&
        widgetData.tabs.length > 0) {
        const tabCollectionItemIds = widgetData.tabs.reduce((acc, tabItem) => {
            acc.push(...tabItem.collectionItems);
            return acc;
        }, []);
        const aggregateQueryItem = getAggregationQuery({
            collectionName: widgetData.collectionName,
            ids: tabCollectionItemIds,
        });
        const collectionModal = (0, helper_1.getCollectionModal)(widgetData.collectionName, connection);
        const collectionItems = yield collectionModal.aggregate(aggregateQueryItem);
        // converting colleciton items to obj to better access them
        const collectionItemsObj = collectionItems.reduce((acc, item) => {
            acc[item._id] = item;
            return acc;
        }, {});
        widgetData.tabs = widgetData.tabs.map((tabItem) => {
            return {
                name: tabItem.name,
                names: tabItem.names,
                collectionItems: tabItem.collectionItems.map((collectionId) => collectionItemsObj[collectionId]),
            };
        });
    }
    (0, helper_1.AddSrcSetsToItems)(widgetData);
    return widgetData;
});
exports.getWidgetDataDB = getWidgetDataDB;
const updateRedisWidget = (code, connection) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const widgetData = yield (0, exports.getWidgetDataDB)(code, connection);
    if (widgetData) {
        yield (0, redis_1.setRedisValue)(`widget_${code}`, widgetData);
    }
});
exports.updateRedisWidget = updateRedisWidget;
const getPageDataDB = (code, Page, Widget) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const pageData = (yield Page.aggregate([
        {
            $match: {
                isDeleted: false,
                code: code,
            },
        },
        {
            $project: {
                isDeleted: 0,
                deletedAt: 0,
                __v: 0,
            },
        },
        {
            $lookup: {
                from: 'widgets',
                let: { widgets: '$widgets' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $in: ['$_id', '$$widgets'],
                            },
                            isDeleted: false,
                            isActive: true,
                        },
                    },
                    {
                        $project: Object.assign({ widgetId: 0, sequence: 0 }, defaults_1.commonExcludedFields),
                    },
                    {
                        $lookup: {
                            from: 'items',
                            let: { widget: '$_id' },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $eq: ['$widgetId', '$$widget'],
                                        },
                                        isDeleted: false,
                                    },
                                },
                                ...(defaults_1.defaults.languages && ((_b = defaults_1.defaults.languages) === null || _b === void 0 ? void 0 : _b.length) > 0
                                    ? defaults_1.defaults.languages.reduce((arr, lng) => {
                                        arr.push({
                                            $lookup: {
                                                from: 'file',
                                                let: { img: { $toObjectId: `$imgs.${lng.code}` } },
                                                as: `images.${lng.code}`,
                                                pipeline: [
                                                    {
                                                        $match: {
                                                            $expr: {
                                                                $eq: ['$_id', '$$img'],
                                                            },
                                                        },
                                                    },
                                                    {
                                                        $project: {
                                                            _id: 1,
                                                            uri: 1,
                                                        },
                                                    },
                                                ],
                                            },
                                        }, {
                                            $unwind: {
                                                path: `$images.${lng.code}`,
                                                preserveNullAndEmptyArrays: true,
                                            },
                                        });
                                        return arr;
                                    }, [])
                                    : [
                                        {
                                            $lookup: {
                                                from: 'file',
                                                let: { img: '$img' },
                                                as: 'image',
                                                pipeline: [
                                                    {
                                                        $match: {
                                                            $expr: {
                                                                $eq: ['$_id', '$$img'],
                                                            },
                                                        },
                                                    },
                                                    {
                                                        $project: {
                                                            _id: 1,
                                                            uri: 1,
                                                        },
                                                    },
                                                ],
                                            },
                                        },
                                        {
                                            $unwind: {
                                                path: '$image',
                                                preserveNullAndEmptyArrays: true,
                                            },
                                        },
                                    ]),
                                {
                                    $project: Object.assign({ sequence: 0, imgs: 0 }, defaults_1.commonExcludedFields),
                                },
                                // {
                                //   $lookup: {
                                //     from: 'srcsets',
                                //     let: { item: '$_id' },
                                //     as: 'srcset',
                                //     pipeline: [
                                //       {
                                //         $match: {
                                //           $expr: {
                                //             $eq: ['$itemId', '$$item'],
                                //           },
                                //         },
                                //       },
                                //       {
                                //         $project: {
                                //           ...commonExcludedFields,
                                //           _id: 0,
                                //           itemId: 0,
                                //         },
                                //       },
                                //     ],
                                //   },
                                // },
                            ],
                            as: 'items',
                        },
                    },
                ],
                as: 'widgetsData',
            },
        },
    ]));
    if (!pageData.length) {
        return null;
    }
    pageData[0].widgetsData = yield (0, helper_1.appendCollectionData)(pageData[0].widgetsData, Widget);
    if (Array.isArray(pageData[0].widgetsData) &&
        pageData[0].widgetsData.length > 0) {
        pageData[0].widgetsData.forEach((widget) => {
            (0, helper_1.AddSrcSetsToItems)(widget);
        });
    }
    pageData[0].widgetsData = pageData[0].widgetsData.reduce((acc, widgetItem) => {
        acc[widgetItem._id] = widgetItem;
        return acc;
    }, []);
    pageData[0].widgets = pageData[0].widgets
        .map((widgetId) => pageData[0].widgetsData[widgetId])
        .filter(Boolean);
    delete pageData[0].widgetsData;
    return pageData[0];
});
exports.getPageDataDB = getPageDataDB;
const updateRedisPage = (code, Page, Widget) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const pageData = yield (0, exports.getPageDataDB)(code, Page, Widget);
    if (pageData) {
        yield (0, redis_1.setRedisValue)(`page_${code}`, pageData);
    }
});
exports.updateRedisPage = updateRedisPage;
const handleUpdateData = (collectionName, itemId, models) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { Widget, Page } = models;
    const widgets = yield Widget.find({
        collectionName: collectionName,
        collectionItems: {
            $in: Array.isArray(itemId) ? itemId : [itemId],
        },
    }, 'code _id').lean();
    if (widgets.length) {
        const pageCodes = yield Page.find({
            widgets: {
                $in: widgets.map((widget) => widget._id),
            },
        }, 'code').distinct('code');
        if (pageCodes.length) {
            pageCodes.forEach((code) => {
                (0, redis_1.deleteRedisValue)(`page_${code}`);
            });
        }
        widgets.forEach((widget) => {
            (0, redis_1.deleteRedisValue)(`widget_${widget.code}`);
        });
    }
});
exports.handleUpdateData = handleUpdateData;
const handleResetData = (type, code) => {
    if ((type === 'widget' || type === 'page') && code)
        (0, redis_1.deleteRedisValue)(`${type}_${code}`);
};
exports.handleResetData = handleResetData;
//# sourceMappingURL=dataService.js.map