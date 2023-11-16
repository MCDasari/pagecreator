import { Types, Model } from 'mongoose';
import { IWidgetSchema, SrcSetItem } from '../types';
export declare function appendCollectionData(widgetData: IWidgetSchema[], Widget: Model<IWidgetSchema>): Promise<IWidgetSchema[]>;
export declare function buildSrcSetItem(uri: string, setItem: SrcSetItem): string;
export declare function AddSrcSetsToItems(widgetData: IWidgetSchema): void;
export declare const getCollectionModal: (collectionName: string, connection: any) => any;
export declare const formatCollectionItems: (collectionItems: any[]) => Types.ObjectId[];
