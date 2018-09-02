import { mergeResolvers } from 'merge-graphql-schemas';

import queriesResolver from './queries';
import subscriptionsResolver from './subscriptions';

const productsResolver = {
  Product: {
    id: (parent: { _id?: string, id?: string }) => parent._id || parent.id
  }
};

export default mergeResolvers([
  productsResolver,
  queriesResolver,
  subscriptionsResolver
]);
