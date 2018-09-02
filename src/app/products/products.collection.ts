import { model, Schema } from 'mongoose';

const productSchema = new Schema({
  description: { type: String, trim: true },
  name: { type: String, required: true, trim: true },
});

const product = model('Product', productSchema);

export { product };
