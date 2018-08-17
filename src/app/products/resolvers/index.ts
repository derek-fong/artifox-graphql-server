import { mergeResolvers } from 'merge-graphql-schemas';

import queriesResolver from './queries';

const productsResolver = {
  Product: {
    id: (parent: { _id?: string, id?: string }) => parent._id || parent.id
  }
};

export default mergeResolvers([
  productsResolver,
  queriesResolver
]);
