"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatCollectionItems = exports.getCollectionModal = exports.AddSrcSetsToItems = exports.buildSrcSetItem = exports.appendCollectionData = void 0;
const tslib_1 = require("tslib");
const mongoose_1 = require("mongoose");
// import { Widget } from '../models';
const defaults_1 = require("./defaults");
function appendCollectionData(widgetData, Widget) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        // reduce widget data to optimize query
        const newData = widgetData.reduce((acc, widget) => {
            if (widget.collectionName) {
                acc[widget.code] = {
                    _id: widget._id,
                    code: widget.code,
                    collectionName: widget.collectionName,
                    collectionItems: widget.collectionItems,
                    tabs: widget.tabs,
                };
            }
            return acc;
        }, {});
        if (Object.keys(newData).length > 0) {
            const aggregationQueryCollectionItems = buildCollectionItemsQuery(newData);
            if (aggregationQueryCollectionItems.length > 0) {
                // getting collection data by populating widget
                let aggregationData = yield Widget.aggregate(aggregationQueryCollectionItems);
                aggregationData = aggregationData.reduce((acc, aggregation) => {
                    acc[aggregation.code] = aggregation[aggregation.code];
                    return acc;
                }, {});
                // adding collection data to widgets
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                widgetData = widgetData.map((widget) => {
                    if (aggregationData[widget.code]) {
                        return Object.assign(Object.assign({}, widget), { collectionItems: aggregationData[widget.code] });
                    }
                    return widget;
                });
            }
            const aggregationQueryTabs = buildTabCollectionItemsQuery(newData);
            if (aggregationQueryTabs.length > 0) {
                let aggregationDataTabs = yield Widget.aggregate(aggregationQueryTabs);
                aggregationDataTabs = aggregationDataTabs.reduce((acc, aggregation) => {
                    if (aggregation[aggregation.code])
                        acc[aggregation.code] = aggregation[aggregation.code];
                    return acc;
                }, {});
                // adding collection data to widgets
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                widgetData = widgetData.map((widget) => {
                    if (!aggregationDataTabs[widget.code])
                        return widget;
                    const collectionItemsObj = aggregationDataTabs[widget.code].reduce((acc, item) => {
                        acc[item._id] = item;
                        return acc;
                    }, {});
                    return Object.assign(Object.assign({}, widget), { tabs: widget.tabs.map((tabItem) => {
                            return {
                                name: tabItem.name,
                                names: tabItem.names,
                                collectionItems: tabItem.collectionItems
                                    .map((collectionId) => collectionItemsObj[collectionId])
                                    .filter(Boolean),
                            };
                        }) });
                });
            }
        }
        // returning widget data as it is if they do not have dynamic collection
        return widgetData;
    });
}
exports.appendCollectionData = appendCollectionData;
function buildCollectionItemsQuery(formattedWidgetData) {
    const aggregationQuery = [
        {
            $match: {
                _id: {
                    $in: Object.values(formattedWidgetData).map((item) => item._id),
                },
            },
        },
        {
            // Get only the fields that are not excluded
            $project: {
                _id: 1,
                code: 1,
            },
        },
    ];
    let collectionConfig;
    Object.keys(formattedWidgetData).forEach((key) => {
        if (formattedWidgetData[key].collectionItems &&
            formattedWidgetData[key].collectionItems.length > 0) {
            const aggregationQueryPiplelines = [];
            collectionConfig = defaults_1.defaults.collections.find((c) => c.collectionName === formattedWidgetData[key].collectionName);
            if (Array.isArray(collectionConfig === null || collectionConfig === void 0 ? void 0 : collectionConfig.aggregations) &&
                (collectionConfig === null || collectionConfig === void 0 ? void 0 : collectionConfig.aggregations.length)) {
                aggregationQueryPiplelines.push(...collectionConfig.aggregations);
            }
            const ids = (0, exports.formatCollectionItems)(formattedWidgetData[key].collectionItems);
            // Build piplelines with config
            aggregationQueryPiplelines.push(...[
                {
                    $match: Object.assign({ _id: {
                            $in: ids,
                        } }, ((collectionConfig === null || collectionConfig === void 0 ? void 0 : collectionConfig.match) || {})),
                },
                {
                    $project: Object.assign({}, defaults_1.commonExcludedFields),
                },
                { $addFields: { __order: { $indexOfArray: [ids, '$_id'] } } },
                { $sort: { __order: 1 } },
            ]);
            // Build Aggregation Query
            aggregationQuery.push({
                $lookup: {
                    from: formattedWidgetData[key].collectionName,
                    pipeline: aggregationQueryPiplelines,
                    as: formattedWidgetData[key].code,
                },
            });
        }
    });
    return aggregationQuery;
}
function buildTabCollectionItemsQuery(formattedWidgetData) {
    const aggregationQuery = [
        {
            $match: {
                _id: {
                    $in: Object.values(formattedWidgetData).map((item) => item._id),
                },
            },
        },
        {
            // Get only the fields that are not excluded
            $project: {
                _id: 1,
                code: 1,
            },
        },
    ];
    let collectionConfig;
    Object.keys(formattedWidgetData).forEach((key) => {
        if (formattedWidgetData[key].tabs &&
            formattedWidgetData[key].tabs.length > 0) {
            const aggregationQueryPiplelines = [];
            collectionConfig = defaults_1.defaults.collections.find((c) => c.collectionName === formattedWidgetData[key].collectionName);
            if (Array.isArray(collectionConfig === null || collectionConfig === void 0 ? void 0 : collectionConfig.aggregations) &&
                (collectionConfig === null || collectionConfig === void 0 ? void 0 : collectionConfig.aggregations.length)) {
                aggregationQueryPiplelines.push(...collectionConfig.aggregations);
            }
            // Build piplelines with config
            aggregationQueryPiplelines.push(...[
                {
                    $match: Object.assign({ _id: {
                            $in: formattedWidgetData[key].tabs.reduce((arr, tabItem) => {
                                arr.push(...(0, exports.formatCollectionItems)(tabItem.collectionItems));
                                return arr;
                            }, []),
                        } }, ((collectionConfig === null || collectionConfig === void 0 ? void 0 : collectionConfig.match) || {})),
                },
                {
                    $project: Object.assign({}, defaults_1.commonExcludedFields),
                },
            ]);
            // Build Aggregation Query
            aggregationQuery.push({
                $lookup: {
                    from: formattedWidgetData[key].collectionName,
                    pipeline: aggregationQueryPiplelines,
                    as: formattedWidgetData[key].code,
                },
            });
        }
    });
    return aggregationQuery;
}
function buildSrcSetItem(uri, setItem) {
    const imageItemArr = (uri === null || uri === void 0 ? void 0 : uri.split('/')) || [];
    imageItemArr.splice(imageItemArr.length - 1, 0, `${setItem.width}x${setItem.height}`);
    return imageItemArr.join('/');
}
exports.buildSrcSetItem = buildSrcSetItem;
function AddSrcSetsToItems(widgetData) {
    if (Array.isArray(widgetData.items) && widgetData.items.length > 0) {
        widgetData.items.forEach((item) => {
            if (Array.isArray(item.srcset) && item.srcset.length > 0 && item.image) {
                item.srcSets = item.srcset.reduce((strArr, setItem) => {
                    const imageUri = buildSrcSetItem(item.image.uri, setItem);
                    strArr.push(`${imageUri} ${setItem.screenSize}w`);
                    return strArr;
                }, []);
                item.srcSets = item.srcSets.join(', ');
            }
        });
    }
}
exports.AddSrcSetsToItems = AddSrcSetsToItems;
const getCollectionModal = (collectionName, connection) => {
    let collectionModal = connection.models[collectionName];
    if (!collectionModal) {
        const schema = new mongoose_1.Schema({}, { strict: false });
        collectionModal = connection.model(collectionName, schema, collectionName);
    }
    return collectionModal;
};
exports.getCollectionModal = getCollectionModal;
const formatCollectionItems = (collectionItems) => {
    if (Array.isArray(collectionItems) && collectionItems.length === 0)
        return [];
    return collectionItems.map((item) => {
        if (item instanceof mongoose_1.Types.ObjectId)
            return item;
        return new mongoose_1.Types.ObjectId(item);
    });
};
exports.formatCollectionItems = formatCollectionItems;
//# sourceMappingURL=helper.js.map