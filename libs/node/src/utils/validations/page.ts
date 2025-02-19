import joi from 'joi';
// import { Page } from '../../models';
import { getOne } from '../../services/dbService';
import { VALIDATION } from '../../constants';
import { IPageSchema, IDefaultValidations } from '../../types';

type PageValidation = IPageSchema & IDefaultValidations;

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

export const create = joi.object<PageValidation>({
  name: joi.string().required(),
  code: joi
    .string()
    .uppercase()
    .replace(/\s+/g, '_')
    // .external((value) => checkUnique('code', value, VALIDATION.WIDGET_EXISTS))
    .required(),
  slug: joi
    .string()
    // .external((value) => checkUnique('slug', value, VALIDATION.SLUG_EXISTS))
    .required(),
  widgets: joi.array().items(joi.string()).optional(),
  createdBy: joi.any().optional(),
  updatedBy: joi.any().optional(),
  deletedBy: joi.any().optional(),
  deletedAt: joi.any().optional(),
});

export const update = joi.object<PageValidation>({
  name: joi.string().optional(),
  widgets: joi.array().items(joi.string()).optional(),
  createdBy: joi.any().optional(),
  updatedBy: joi.any().optional(),
  deletedBy: joi.any().optional(),
  deletedAt: joi.any().optional(),
});

export const list = joi.object({
  search: joi.string().allow('').replace(/\s+/g, '_').optional().default(''),
  options: joi
    .object({
      sort: joi
        .alternatives()
        .try(joi.object(), joi.string())
        .optional()
        .default({ _id: -1 }),
      populate: joi.array().items().optional().default([]),
      offset: joi.number().optional(),
      page: joi.number().optional(),
      limit: joi.number().optional(),
      pagination: joi.boolean().default(false),
    })
    .default({}),
  createdBy: joi.any().optional(),
  updatedBy: joi.any().optional(),
  deletedBy: joi.any().optional(),
  deletedAt: joi.any().optional(),
});
