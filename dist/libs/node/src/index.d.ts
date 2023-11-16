import WidgetRoutes from './routes/WidgetRoute';
import PageRoutes from './routes/PageRoute';
import UserRoutes from './routes/UserRoute';
import { WidgetSchema, ItemSchema, PageSchema, SrcSetSchema, TabSchema } from './models';
import { IConfig } from './types';
import { handleUpdateData, handleResetData } from './services/dataService';
declare function setConfig(config: Partial<IConfig>): void;
export { WidgetRoutes, PageRoutes, UserRoutes, WidgetSchema, ItemSchema, PageSchema, SrcSetSchema, TabSchema, setConfig, handleResetData, handleUpdateData, };
