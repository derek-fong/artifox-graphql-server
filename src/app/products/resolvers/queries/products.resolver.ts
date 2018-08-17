import { Product } from '../../shared/product.model';
import { ProductsService } from '../../shared/products.service';

export default {
  Query: {
    products: (): Product[] => {
      return ProductsService.getProducts();
    }
  }
};
