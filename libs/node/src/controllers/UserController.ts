import { getRedisValue, setRedisValue } from '../utils/redis';
import { successResponse, recordNotFound } from './../utils/responseHandlers';
import { defaults } from '../utils/defaults';
import { IRequest, IResponse } from '../types';
import { getPageDataDB, getWidgetDataDB } from '../services/dataService';
import mongoose from 'mongoose';

const catchAsync = (fn: any) => {
  return defaults.catchAsync(fn, 'User');
};

// TO Do: Optimize the following
export const getWidgetData = catchAsync(
  async (req: any, res: IResponse) => {
    const connection = req?.clientDBConnection ? req.clientDBConnection : mongoose.connection
    const { fresh } = req.query;
    const { code } = req.body;
    let widgetData = await getRedisValue(`widget_${code}`);
    if (widgetData && fresh !== 'true') {
      return successResponse(widgetData, res);
    }
    widgetData = await getWidgetDataDB(code, connection);

    if (!widgetData) {
      res.message = req?.i18n?.t('user.widgetNotFound');
      return recordNotFound(res);
    }

    await setRedisValue(`widget_${code}`, widgetData);

    return successResponse(widgetData, res);
  }
);

// TO Do: Optimize the following
export const getPageData = catchAsync(async (req: any, res: IResponse) => {
  const {Page, Widget} = req?.clientDBConnection ? req.clientDBConnection.models : mongoose.models
  const { fresh } = req.query;
  const { code } = req.body;
  let pageData = await getRedisValue(`pageData_${code}`);
  if (pageData && fresh !== 'true') {
    return successResponse(pageData, res);
  }
  pageData = await getPageDataDB(code,Page, Widget);

  if (!pageData) {
    res.message = req?.i18n?.t('user.pageNotFound');
    return recordNotFound(res);
  }
  await setRedisValue(`pageData_${code}`, pageData);

  return successResponse(pageData, res);
});
