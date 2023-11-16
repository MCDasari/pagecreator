import joi from 'joi';
import { ITabSchema, IDefaultValidations } from '../../types';
type TabValidation = ITabSchema & IDefaultValidations;
export declare const create: joi.ObjectSchema<TabValidation>;
export declare const update: joi.ObjectSchema<TabValidation>;
export {};
