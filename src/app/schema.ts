import { mergeTypes } from 'merge-graphql-schemas';

import productsSchema from './products/products.schema';

export default mergeTypes([ productsSchema ]);
