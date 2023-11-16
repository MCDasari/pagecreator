import { IResponse } from '../types';
export declare const failureResponse: (data: any, res: IResponse) => IResponse;
export declare const successResponse: (data: any, res: IResponse) => IResponse;
export declare const createdDocumentResponse: (data: any, res: IResponse) => IResponse;
export declare const recordNotFound: (res: IResponse) => IResponse;
export declare const inValidParam: (message: any, res: IResponse) => IResponse;
