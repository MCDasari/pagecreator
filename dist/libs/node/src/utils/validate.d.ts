import { NextFunction } from 'express';
import { IRequest, IResponse } from './../types';
declare const validate: (validator: any) => (req: IRequest, res: IResponse, next: NextFunction) => Promise<void>;
export default validate;
