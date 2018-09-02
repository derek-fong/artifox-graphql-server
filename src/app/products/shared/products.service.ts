import { Product } from './product.model';
import { product } from '../products.collection';

export class ProductsService {

  /**
   * Get products.
   */
  static getProducts(): Promise<Product[]> {
    return product.collection.find({ }).toArray();
  }
}
