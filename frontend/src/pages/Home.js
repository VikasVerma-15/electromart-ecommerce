import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  Rating,
  Skeleton,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Snackbar,
} from '@mui/material';
import { 
  AddShoppingCart as AddCartIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('All');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const searchQuery = searchParams.get('search');

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, category]);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const showNotification = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleViewDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      
      if (searchQuery) {
        params.keyword = searchQuery;
      }
      
      if (category !== 'All') {
        params.category = category;
      }

      const response = await axios.get('/api/items', { params });
      setProducts(response.data.items || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      // Fallback to sample data if API is not available
      setProducts(getSampleProducts());
      setError('Using sample data - Backend not connected');
    } finally {
      setLoading(false);
    }
  };

  // Sample data fallback
  const getSampleProducts = () => [
    {
      _id: '1',
      title: 'Samsung 55" 4K Smart TV',
      description: 'Crystal UHD 4K Smart TV with Alexa Built-in',
      price: 58099.17,
      category: 'Electronics',
      stock: 15,
      images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400'],
      rating: 4.5,
      numReviews: 128,
      brand: 'Samsung',
    },
    {
      _id: '2',
      title: 'iPhone 15 Pro Max',
      description: 'Latest iPhone with A17 Pro chip and titanium design',
      price: 99599.17,
      category: 'Electronics',
      stock: 8,
      images: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400'],
      rating: 4.8,
      numReviews: 256,
      brand: 'Apple',
    },
    {
      _id: '3',
      title: 'Sony WH-1000XM5 Headphones',
      description: 'Industry-leading noise canceling wireless headphones',
      price: 33199.17,
      category: 'Electronics',
      stock: 22,
      images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'],
      rating: 4.7,
      numReviews: 89,
      brand: 'Sony',
    },
    {
      _id: '4',
      title: 'MacBook Pro 16" M3',
      description: 'Powerful laptop with M3 chip for professionals',
      price: 207499.17,
      category: 'Electronics',
      stock: 5,
      images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400'],
      rating: 4.9,
      numReviews: 67,
      brand: 'Apple',
    },
    {
      _id: '5',
      title: 'Dyson V15 Detect Vacuum',
      description: 'Cordless vacuum with laser dust detection',
      price: 62249.17,
      category: 'Electronics',
      stock: 12,
      images: ['https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400'],
      rating: 4.6,
      numReviews: 156,
      brand: 'Dyson',
    },
    {
      _id: '6',
      title: 'Nintendo Switch OLED',
      description: 'Handheld gaming console with 7-inch OLED screen',
      price: 29049.17,
      category: 'Electronics',
      stock: 18,
      images: ['https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400'],
      rating: 4.4,
      numReviews: 203,
      brand: 'Nintendo',
    },
    {
      _id: '7',
      title: 'Canon EOS R5 Camera',
      description: 'Mirrorless camera with 45MP full-frame sensor',
      price: 323699.17,
      category: 'Electronics',
      stock: 3,
      images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400'],
      rating: 4.8,
      numReviews: 45,
      brand: 'Canon',
    },
    {
      _id: '8',
      title: 'LG 27" 4K Monitor',
      description: 'Ultra-wide curved gaming monitor with HDR',
      price: 49799.17,
      category: 'Electronics',
      stock: 9,
      images: ['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400'],
      rating: 4.3,
      numReviews: 78,
      brand: 'LG',
    },
  ];

  // Format price in Indian Rupees
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = async (productId) => {
    const result = await addToCart(productId, 1);
    if (result.success) {
      showNotification('Product added to cart successfully!');
    } else {
      showNotification(result.error, 'error');
    }
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const categories = ['All', 'Electronics', 'Computers', 'Mobile', 'Audio', 'Gaming'];

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          {[...Array(8)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card>
                <Skeleton variant="rectangular" height={200} />
                <CardContent>
                  <Skeleton variant="text" height={24} />
                  <Skeleton variant="text" height={20} />
                  <Skeleton variant="text" height={20} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {error && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Electronic Appliances
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Discover the latest in technology and electronics
        </Typography>
      </Box>

      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            label="Category"
            onChange={handleCategoryChange}
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={product.images?.[0] || 'https://via.placeholder.com/400x200?text=No+Image'}
                alt={product.title}
                sx={{ 
                  objectFit: 'cover',
                  cursor: 'pointer',
                  '&:hover': {
                    opacity: 0.8,
                  }
                }}
                onClick={() => handleViewDetails(product._id)}
              />
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography 
                  gutterBottom 
                  variant="h6" 
                  component="h2" 
                  noWrap
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': {
                      color: 'primary.main',
                    }
                  }}
                  onClick={() => handleViewDetails(product._id)}
                >
                  {product.title}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, flexGrow: 1 }}>
                  {product.description}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Rating value={product.rating || 0} precision={0.1} size="small" readOnly />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    ({product.numReviews || 0})
                  </Typography>
                </Box>

                <Chip
                  label={product.brand || 'Unknown'}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ mb: 1, alignSelf: 'flex-start' }}
                />

                <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', mb: 2 }}>
                  {formatPrice(product.price)}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
                  <Button
                    variant="contained"
                    startIcon={<AddCartIcon />}
                    onClick={() => handleAddToCart(product._id)}
                    disabled={!isAuthenticated}
                    fullWidth
                  >
                    Add to Cart
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<ViewIcon />}
                    onClick={() => handleViewDetails(product._id)}
                    fullWidth
                  >
                    View Details
                  </Button>
                </Box>

                {product.stock && product.stock < 10 && (
                  <Typography variant="caption" color="warning.main" sx={{ mt: 1 }}>
                    Only {product.stock} left in stock!
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {products.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No products found
          </Typography>
        </Box>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Home; 