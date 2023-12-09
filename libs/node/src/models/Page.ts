import { Schema, model, Types } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { softDeletePlugin } from '../plugins/softDelete';
import { IModel, IPageSchema } from '../types';

const PageSchema = new Schema<IPageSchema>({
  name: String,
  code: { type: String, index: true },
  slug: String,
  widgets: [{ type: Types.ObjectId, 
    // ref: 'Widget' 
}],
});

PageSchema.plugin(softDeletePlugin);
PageSchema.plugin(mongoosePaginate);


export default PageSchema;
