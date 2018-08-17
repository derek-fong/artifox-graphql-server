import { mergeResolvers } from 'merge-graphql-schemas';

import productsResolver from './products.resolver';

export default mergeResolvers([ productsResolver ]);
