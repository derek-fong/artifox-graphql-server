import { mergeResolvers } from 'merge-graphql-schemas';

import productRegisteredResolver from './product-registered.resolver';

export default mergeResolvers([ productRegisteredResolver ]);
