import {
  AuthenticationError,
  ForbiddenError,
  withFilter
} from 'apollo-server-express';

import pubSub from '../../../shared/pub-sub';
import { AuthService } from '../../../auth/auth.service';

export const productAddedTrigger = 'productAdded';

export default {
  Subscription: {
    productRegistered: {
      subscribe: withFilter(
        (root, args, { user }) => {
          if (!user) { throw new AuthenticationError('Authentication required. '); }

          if (!AuthService.hasPermission(user, 'read:products')) {
            throw new ForbiddenError('You do not have permission to read products. ');
          }

          return pubSub.asyncIterator([ productAddedTrigger ]);
        },
        () => true
      )
    }
  }
};
