import joi from 'joi';
import { IWidgetSchema, IDefaultValidations } from '../../types';
type ItemValidation = IWidgetSchema & IDefaultValidations;
export declare const create: joi.ObjectSchema<ItemValidation>;
export declare const update: joi.ObjectSchema<ItemValidation>;
export declare const list: joi.ObjectSchema<any>;
export declare const partialUpdate: joi.ObjectSchema<any>;
export declare const getCollectionData: joi.ObjectSchema<any>;
export {};
