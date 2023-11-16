"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.list = exports.update = exports.create = void 0;
const tslib_1 = require("tslib");
const joi_1 = tslib_1.__importDefault(require("joi"));
// const checkUnique = async (
//   key: string,
//   value: string,
//   error: string
// ): Promise<void> => {
//   let result;
//   try {
//     // throws error if document not found
//     result = await getOne(Page, {
//       [key]: value,
//     });
//     // eslint-disable-next-line no-empty
//   } catch (e) {}
//   if (result) {
//     throw new Error(error);
//   }
// };
exports.create = joi_1.default.object({
    name: joi_1.default.string().required(),
    code: joi_1.default
        .string()
        .uppercase()
        .replace(/\s+/g, '_')
        // .external((value) => checkUnique('code', value, VALIDATION.WIDGET_EXISTS))
        .required(),
    slug: joi_1.default
        .string()
        // .external((value) => checkUnique('slug', value, VALIDATION.SLUG_EXISTS))
        .required(),
    widgets: joi_1.default.array().items(joi_1.default.string()).optional(),
    createdBy: joi_1.default.any().optional(),
    updatedBy: joi_1.default.any().optional(),
    deletedBy: joi_1.default.any().optional(),
    deletedAt: joi_1.default.any().optional(),
});
exports.update = joi_1.default.object({
    name: joi_1.default.string().optional(),
    widgets: joi_1.default.array().items(joi_1.default.string()).optional(),
    createdBy: joi_1.default.any().optional(),
    updatedBy: joi_1.default.any().optional(),
    deletedBy: joi_1.default.any().optional(),
    deletedAt: joi_1.default.any().optional(),
});
exports.list = joi_1.default.object({
    search: joi_1.default.string().allow('').replace(/\s+/g, '_').optional().default(''),
    options: joi_1.default
        .object({
        sort: joi_1.default
            .alternatives()
            .try(joi_1.default.object(), joi_1.default.string())
            .optional()
            .default({ _id: -1 }),
        populate: joi_1.default.array().items().optional().default([]),
        offset: joi_1.default.number().optional(),
        page: joi_1.default.number().optional(),
        limit: joi_1.default.number().optional(),
        pagination: joi_1.default.boolean().default(false),
    })
        .default({}),
    createdBy: joi_1.default.any().optional(),
    updatedBy: joi_1.default.any().optional(),
    deletedBy: joi_1.default.any().optional(),
    deletedAt: joi_1.default.any().optional(),
});
//# sourceMappingURL=page.js.map