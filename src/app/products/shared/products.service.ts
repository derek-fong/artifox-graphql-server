import { Product } from './product.model';

export class ProductsService {

  /**
   * Get products.
   */
  static getProducts(): Product[] {
    // TODO: Replace with real data.
    return [
      { id: 'PRODUCT_001', name: 'Product 001' , description: 'Product 001. ' },
      { id: 'PRODUCT_002', name: 'Product 002' , description: 'Product 002. ' },
      { id: 'PRODUCT_003', name: 'Product 003' , description: 'Product 003. ' },
    ];
  }
}
