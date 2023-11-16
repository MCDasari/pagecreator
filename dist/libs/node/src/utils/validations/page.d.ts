import joi from 'joi';
import { IPageSchema, IDefaultValidations } from '../../types';
type PageValidation = IPageSchema & IDefaultValidations;
export declare const create: joi.ObjectSchema<PageValidation>;
export declare const update: joi.ObjectSchema<PageValidation>;
export declare const list: joi.ObjectSchema<any>;
export {};
