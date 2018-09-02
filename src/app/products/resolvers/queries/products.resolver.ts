import { AuthenticationError, ForbiddenError } from 'apollo-server-express';

import { Product } from '../../shared/product.model';
import { ProductsService } from '../../shared/products.service';
import { AuthService } from '../../../auth/auth.service';

export default {
  Query: {
    products: (root, args, { user }): Promise<Product[]> => {
      if (!user) { throw new AuthenticationError('Authentication required. '); }

      if (!AuthService.hasPermission(user, 'read:products')) {
        throw new ForbiddenError('You do not have permission to read products. ');
      }

      return ProductsService.getProducts();
    }
  }
};
