"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCollectionData = exports.partialUpdate = exports.list = exports.update = exports.create = void 0;
const tslib_1 = require("tslib");
const joi_1 = tslib_1.__importDefault(require("joi"));
// import { Widget } from '../../models';
const defaults_1 = require("../defaults");
// import { VALIDATION } from '../../constants';
// import { getOne } from '../../services/dbService';
const types_1 = require("../../types");
// const checkUnique = async (value: string) => {
//   let result;
//   try {
//     // throws error if document found
//     result = await getOne(Widget, {
//       code: value,
//     });
//     // eslint-disable-next-line no-empty
//   } catch (e) {}
//   if (result) {
//     throw new Error(VALIDATION.WIDGET_EXISTS);
//   }
// };
const srcset = joi_1.default.object().keys({
    screenSize: joi_1.default.number().required(),
    width: joi_1.default.number().required(),
    height: joi_1.default.number().required(),
});
const item = joi_1.default.object({
    title: joi_1.default.string().optional(),
    titles: joi_1.default.object().optional(),
    subtitle: joi_1.default.string().optional().allow(''),
    subtitles: joi_1.default.object().optional(),
    altText: joi_1.default.string().optional().allow(''),
    altTexts: joi_1.default.object().optional(),
    link: joi_1.default.string().optional().allow(''),
    sequence: joi_1.default.number().optional(),
    srcset: joi_1.default.array().items(srcset),
    img: joi_1.default.string().allow(null).optional(),
    imgs: joi_1.default.object().optional(),
    itemType: joi_1.default
        .string()
        .valid(...Object.values(types_1.ItemTypes))
        .default(types_1.ItemTypes.Web),
});
exports.create = joi_1.default.object({
    name: joi_1.default.string().required(),
    widgetTitle: joi_1.default.string().optional(),
    widgetTitles: joi_1.default.object().optional(),
    code: joi_1.default
        .string()
        .uppercase()
        .replace(/\s+/g, '_')
        // .external(checkUnique)
        .required(),
    isActive: joi_1.default.boolean().default(true).optional(),
    autoPlay: joi_1.default.boolean().default(false).optional(),
    webPerRow: joi_1.default.number().allow(null).optional(),
    mobilePerRow: joi_1.default.number().allow(null).optional(),
    tabletPerRow: joi_1.default.number().allow(null).optional(),
    collectionName: joi_1.default.string().optional(),
    collectionItems: joi_1.default.array().items(joi_1.default.string()).optional(),
    tabs: joi_1.default
        .array()
        .items(joi_1.default.object({
        name: joi_1.default.string().optional(),
        names: joi_1.default.object().optional(),
        collectionItems: joi_1.default.array().items(joi_1.default.string()).optional(),
    }))
        .optional(),
    items: joi_1.default.array().items(item).optional(),
    backgroundColor: joi_1.default
        .string()
        .regex(/^#[A-Fa-f0-9]{6}/)
        .optional(),
    itemsType: joi_1.default
        .string()
        .custom((value) => {
        if (Object.keys(types_1.ItemsType).includes(value)) {
            return value;
        }
        const collectionIndex = defaults_1.defaults.collections.findIndex((collection) => collection.collectionName === value);
        if (collectionIndex > -1) {
            return value;
        }
        throw new Error(`${value} is not a valid widget type`);
    })
        .optional()
        .default(types_1.ItemsType.Image),
    widgetType: joi_1.default.string().optional().default(types_1.WidgetTypes.FixedCard),
    createdBy: joi_1.default.any().optional(),
    updatedBy: joi_1.default.any().optional(),
    deletedBy: joi_1.default.any().optional(),
    deletedAt: joi_1.default.any().optional(),
});
exports.update = joi_1.default.object({
    name: joi_1.default.string().required(),
    widgetTitle: joi_1.default.string().optional(),
    widgetTitles: joi_1.default.object().optional(),
    isActive: joi_1.default.boolean().optional(),
    webPerRow: joi_1.default.number().allow(null).optional(),
    mobilePerRow: joi_1.default.number().allow(null).optional(),
    tabletPerRow: joi_1.default.number().allow(null).optional(),
    autoPlay: joi_1.default.boolean().default(false).optional(),
    collectionItems: joi_1.default.array().items(joi_1.default.string()).optional(),
    tabs: joi_1.default
        .array()
        .items(joi_1.default.object({
        name: joi_1.default.string().optional(),
        names: joi_1.default.object().optional(),
        collectionItems: joi_1.default.array().items(joi_1.default.string()).optional(),
    }))
        .optional(),
    items: joi_1.default.array().items(item).optional(),
    backgroundColor: joi_1.default
        .string()
        .regex(/^#[A-Fa-f0-9]{6}/)
        .optional(),
    widgetType: joi_1.default.string().optional(),
    createdBy: joi_1.default.any().optional(),
    updatedBy: joi_1.default.any().optional(),
    deletedBy: joi_1.default.any().optional(),
    deletedAt: joi_1.default.any().optional(),
});
exports.list = joi_1.default.object({
    search: joi_1.default.string().allow('').optional().default(''),
    options: joi_1.default
        .object({
        sort: joi_1.default
            .alternatives()
            .try(joi_1.default.object(), joi_1.default.string())
            .optional()
            .default({ _id: -1 }),
        // populate: joi.array().items().optional(),
        offset: joi_1.default.number().optional(),
        page: joi_1.default.number().optional(),
        limit: joi_1.default.number().optional(),
    })
        .default({
        sort: { _id: -1 },
    }),
    collectionItems: joi_1.default.array().optional().default([]),
    isActive: joi_1.default.boolean().optional(),
    all: joi_1.default.boolean().default(false),
    createdBy: joi_1.default.any().optional(),
    updatedBy: joi_1.default.any().optional(),
    deletedBy: joi_1.default.any().optional(),
    deletedAt: joi_1.default.any().optional(),
});
exports.partialUpdate = joi_1.default.object({
    isActive: joi_1.default.boolean().optional(),
    createdBy: joi_1.default.any().optional(),
    updatedBy: joi_1.default.any().optional(),
    deletedBy: joi_1.default.any().optional(),
    deletedAt: joi_1.default.any().optional(),
});
exports.getCollectionData = joi_1.default.object({
    collectionName: joi_1.default.string().required(),
    search: joi_1.default.string().allow('').optional().default(''),
    collectionItems: joi_1.default.array().optional().default([]),
    createdBy: joi_1.default.any().optional(),
    updatedBy: joi_1.default.any().optional(),
    deletedBy: joi_1.default.any().optional(),
    deletedAt: joi_1.default.any().optional(),
});
//# sourceMappingURL=widget.js.map