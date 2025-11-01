import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaBoxOpen, FaFilter, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const ProductsContainer = styled.div`
  padding: 1rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
  
  h1 {
    margin: 0;
    color: #2c3e50;
    font-size: 1.75rem;
  }
`;

const ActionButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #8B4513;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: background 0.3s;
  
  &:hover {
    background: #A0522D;
  }
`;

const SearchAndFilter = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;
  margin-top: 1rem;
  
  @media (min-width: 768px) {
    width: auto;
    margin-top: 0;
  }
`;

const SearchBox = styled.div`
  position: relative;
  flex: 1;
  
  input {
    width: 100%;
    padding: 0.5rem 1rem 0.5rem 2.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 0.9rem;
    
    &:focus {
      outline: none;
      border-color: #8B4513;
      box-shadow: 0 0 0 2px rgba(139, 69, 19, 0.2);
    }
  }
  
  svg {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #95a5a6;
  }
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s;
  
  &:hover {
    border-color: #8B4513;
    color: #8B4513;
  }
`;

const ProductsTable = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 50px 2fr 1fr 1fr 100px 120px 100px;
  padding: 1rem;
  background: #f8f9fa;
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 1px solid #ecf0f1;
  
  @media (max-width: 992px) {
    display: none;
  }
`;

const ProductRow = styled.div`
  display: grid;
  grid-template-columns: 50px 2fr 1fr 1fr 100px 120px 100px;
  padding: 1rem;
  align-items: center;
  border-bottom: 1px solid #ecf0f1;
  transition: background 0.2s;
  
  &:hover {
    background: #f8f9fa;
  }
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
    gap: 0.5rem;
    position: relative;
    padding: 1rem 1rem 1rem 4rem;
  }
`;

const ProductImage = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 4px;
  background: #f8f9fa;
  background-image: ${props => props.image ? `url(${props.image})` : 'none'};
  background-size: cover;
  background-position: center;
  
  @media (max-width: 992px) {
    position: absolute;
    left: 1rem;
    top: 1rem;
  }
`;

const ProductName = styled.div`
  font-weight: 500;
  color: #2c3e50;
`;

const ProductCategory = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background: #e8f4f8;
  color: #2980b9;
  border-radius: 12px;
  font-size: 0.75rem;
  text-transform: capitalize;
`;

const ProductPrice = styled.div`
  color: #2c3e50;
  font-weight: 500;
`;

const StockStatus = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  text-align: center;
  
  ${props => props.inStock ? `
    background: #e8f8f5;
    color: #27ae60;
  ` : `
    background: #fde8e8;
    color: #e74c3c;
  `}
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  
  @media (max-width: 992px) {
    margin-top: 0.5rem;
  }
`;

const EditButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 4px;
  background: #e8f4f8;
  color: #3498db;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  
  &:hover {
    background: #3498db;
    color: white;
  }
`;

const DeleteButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 4px;
  background: #fde8e8;
  color: #e74c3c;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #e74c3c;
    color: white;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  
  svg {
    font-size: 3rem;
    color: #bdc3c7;
    margin-bottom: 1rem;
  }
  
  h3 {
    color: #2c3e50;
    margin: 0 0 0.5rem;
  }
  
  p {
    color: #7f8c8d;
    margin: 0 0 1.5rem;
    max-width: 400px;
  }
`;

// Mock data - in a real app, this would come from an API
const mockProducts = [
  {
    id: 1,
    name: 'Chocolate Chip Cookie',
    category: 'cookies',
    price: 2.99,
    stock: 42,
    image: '/images/cookie-chocolate-chip.jpg',
    status: 'active'
  },
  {
    id: 2,
    name: 'Double Chocolate Brownie',
    category: 'brownies',
    price: 3.99,
    stock: 28,
    image: '/images/brownie-double-chocolate.jpg',
    status: 'active'
  },
  {
    id: 3,
    name: 'Red Velvet Cupcake',
    category: 'cupcakes',
    price: 3.49,
    stock: 0,
    image: '/images/cupcake-red-velvet.jpg',
    status: 'active'
  },
  {
    id: 4,
    name: 'Oatmeal Raisin Cookie',
    category: 'cookies',
    price: 2.99,
    stock: 35,
    image: '/images/cookie-oatmeal-raisin.jpg',
    status: 'active'
  },
  {
    id: 5,
    name: 'Blondie',
    category: 'brownies',
    price: 3.49,
    stock: 15,
    image: '/images/blondie.jpg',
    status: 'active'
  }
];

const Products = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // In a real app, you would fetch products from an API
  useEffect(() => {
    // Simulate API call
    const fetchProducts = async () => {
      // In a real app, you would have an actual API call here
      // const response = await fetch('/api/products');
      // const data = await response.json();
      
      // For now, we'll use mock data
      setProducts(mockProducts);
    };
    
    fetchProducts();
  }, []);
  
  const filteredProducts = products.filter(product => {
    // Filter by search term
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by category
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    
    // Filter by stock status
    let matchesStock = true;
    if (stockFilter === 'in_stock') {
      matchesStock = product.stock > 0;
    } else if (stockFilter === 'out_of_stock') {
      matchesStock = product.stock === 0;
    }
    
    return matchesSearch && matchesCategory && matchesStock;
  });
  
  const categories = ['all', ...new Set(products.map(p => p.category))];
  
  const handleDelete = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      // In a real app, you would make an API call to delete the product
      // await deleteProduct(productId);
      setProducts(products.filter(p => p.id !== productId));
    }
  };

  return (
    <ProductsContainer>
      <Header>
        <h1>Products</h1>
        
        <SearchAndFilter>
          <SearchBox>
            <FaSearch />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchBox>
          
          <FilterButton onClick={() => setShowFilters(!showFilters)}>
            <FaFilter /> Filters
            {showFilters ? <FaChevronUp /> : <FaChevronDown />}
          </FilterButton>
        </SearchAndFilter>
        
        <ActionButton to="/admin/products/new">
          <FaPlus /> Add Product
        </ActionButton>
      </Header>
      
      {showFilters && (
        <div style={{ 
          background: 'white', 
          padding: '1rem', 
          borderRadius: '8px', 
          marginBottom: '1.5rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <h4 style={{ marginTop: 0, marginBottom: '1rem', color: '#2c3e50' }}>Filters</h4>
          
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#7f8c8d' }}>Category</label>
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                style={{
                  padding: '0.5rem',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  minWidth: '200px',
                  fontSize: '0.9rem'
                }}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#7f8c8d' }}>Stock Status</label>
              <select 
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
                style={{
                  padding: '0.5rem',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  minWidth: '200px',
                  fontSize: '0.9rem'
                }}
              >
                <option value="all">All</option>
                <option value="in_stock">In Stock</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>
          </div>
        </div>
      )}
      
      <ProductsTable>
        {filteredProducts.length > 0 ? (
          <>
            <TableHeader>
              <div>Image</div>
              <div>Product</div>
              <div>Category</div>
              <div>Price</div>
              <div>Stock</div>
              <div>Status</div>
              <div>Actions</div>
            </TableHeader>
            
            {filteredProducts.map(product => (
              <ProductRow key={product.id}>
                <ProductImage image={product.image} />
                <ProductName>{product.name}</ProductName>
                <div>
                  <ProductCategory>
                    {product.category}
                  </ProductCategory>
                </div>
                <ProductPrice>${product.price.toFixed(2)}</ProductPrice>
                <div>{product.stock} in stock</div>
                <div>
                  <StockStatus inStock={product.stock > 0}>
                    {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </StockStatus>
                </div>
                <ActionButtons>
                  <EditButton to={`/admin/products/edit/${product.id}`}>
                    <FaEdit />
                  </EditButton>
                  <DeleteButton onClick={() => handleDelete(product.id)}>
                    <FaTrash />
                  </DeleteButton>
                </ActionButtons>
              </ProductRow>
            ))}
          </>
        ) : (
          <EmptyState>
            <FaBoxOpen />
            <h3>No products found</h3>
            <p>There are no products matching your search criteria. Try adjusting your filters or add a new product.</p>
            <ActionButton to="/admin/products/new">
              <FaPlus /> Add Product
            </ActionButton>
          </EmptyState>
        )}
      </ProductsTable>
    </ProductsContainer>
  );
};

export default Products;
