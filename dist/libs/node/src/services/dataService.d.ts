import { Model } from 'mongoose';
import { IPageSchema, IWidgetSchema } from '../types';
export declare const getWidgetDataDB: (code: string, connection: any) => Promise<IWidgetSchema | null>;
export declare const updateRedisWidget: (code: string, connection: any) => Promise<void>;
export declare const getPageDataDB: (code: string, Page: Model<IPageSchema>, Widget: Model<IWidgetSchema>) => Promise<any>;
export declare const updateRedisPage: (code: string, Page: Model<IPageSchema>, Widget: Model<IWidgetSchema>) => Promise<void>;
export declare const handleUpdateData: (collectionName: string, itemId: string | string[], models: any) => Promise<void>;
export declare const handleResetData: (type: 'widget' | 'page', code: string) => void;
