import { gql } from 'apollo-server-express';

export default gql`
  """
  Product object. 
  """
  type Product {
    """
    Product ID. 
    """
    id: ID!
    
    """
    Product name. 
    """
    name: String!
    
    """
    Product description. 
    """
    description: String
  }
  
  type Query {
    """
    All products. 
    """
    products: [Product]!
  }
  
  type Subscription {
    """
    Product registered. 
    """
    productRegistered: Product
  }
`;
