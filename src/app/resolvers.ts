import { mergeResolvers } from 'merge-graphql-schemas';

import productsResolvers from './products/resolvers';

export default mergeResolvers([ productsResolvers ]);
