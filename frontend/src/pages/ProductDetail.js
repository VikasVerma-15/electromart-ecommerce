import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  TextField,
  Alert,
  Skeleton,
  Breadcrumbs,
  Link,
  Snackbar,
} from '@mui/material';
import {
  AddShoppingCart as AddCartIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

// Sample product data (replace with API call)
const sampleProducts = {
  '1': {
    _id: '1',
    title: 'Samsung 55" 4K Smart TV',
    description: 'Experience stunning 4K Ultra HD picture quality with the Samsung Crystal UHD Smart TV. This 55-inch TV features a Crystal Processor 4K that transforms everything you watch into stunning 4K quality. With Alexa Built-in, you can control your TV and smart home devices with just your voice. The sleek design and slim bezels provide an immersive viewing experience.',
    price: 58099.17,
    category: 'Electronics',
    stock: 15,
    images: [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600',
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600',
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600'
    ],
    rating: 4.5,
    numReviews: 128,
    brand: 'Samsung',
    features: [
      '4K Ultra HD Resolution',
      'Crystal Processor 4K',
      'Alexa Built-in',
      'Smart TV with Apps',
      'HDR Support',
      '3 HDMI Ports'
    ]
  },
  '2': {
    _id: '2',
    title: 'iPhone 15 Pro Max',
    description: 'The iPhone 15 Pro Max features the A17 Pro chip, the most powerful chip ever in a smartphone. With a titanium design, 48MP main camera, and USB-C connectivity, this is the most advanced iPhone ever. The 6.7-inch Super Retina XDR display with ProMotion technology provides an incredible viewing experience.',
    price: 99599.17,
    category: 'Electronics',
    stock: 8,
    images: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600'
    ],
    rating: 4.8,
    numReviews: 256,
    brand: 'Apple',
    features: [
      'A17 Pro Chip',
      'Titanium Design',
      '48MP Main Camera',
      'USB-C Connectivity',
      '6.7-inch Display',
      'iOS 17'
    ]
  }
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  // Format price in Indian Rupees
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const fetchProduct = async () => {
    setLoading(true);
    try {
      // Try to fetch from API first
      const response = await axios.get(`/api/items/${id}`);
      setProduct(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching product:', err);
      // Fallback to sample data if API fails
      const productData = sampleProducts[id];
      if (productData) {
        setProduct(productData);
        setError('Using sample data - Backend not connected');
      } else {
        setError('Product not found');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const showNotification = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      showNotification('Please login to add items to cart', 'warning');
      return;
    }

    const result = await addToCart(product._id, quantity);
    if (result.success) {
      showNotification('Product added to cart successfully!');
    } else {
      showNotification(result.error, 'error');
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0 && value <= product.stock) {
      setQuantity(value);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Skeleton variant="rectangular" height={400} />
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              {[...Array(3)].map((_, index) => (
                <Skeleton key={index} variant="rectangular" width={80} height={80} />
              ))}
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton variant="text" height={40} />
            <Skeleton variant="text" height={24} />
            <Skeleton variant="text" height={24} />
            <Skeleton variant="text" height={100} />
            <Skeleton variant="rectangular" height={48} sx={{ mt: 2 }} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Product not found'}
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
        >
          Back to Products
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link
          component="button"
          variant="body1"
          onClick={() => navigate('/')}
          sx={{ cursor: 'pointer' }}
        >
          Home
        </Link>
        <Link
          component="button"
          variant="body1"
          onClick={() => navigate('/')}
          sx={{ cursor: 'pointer' }}
        >
          {product.category}
        </Link>
        <Typography color="text.primary">{product.title}</Typography>
      </Breadcrumbs>

      <Grid container spacing={4}>
        {/* Product Images */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardMedia
              component="img"
              height="400"
              image={product.images[selectedImage]}
              alt={product.title}
              sx={{ objectFit: 'cover' }}
            />
          </Card>
          
          {product.images.length > 1 && (
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              {product.images.map((image, index) => (
                <Card
                  key={index}
                  sx={{
                    cursor: 'pointer',
                    border: selectedImage === index ? 2 : 1,
                    borderColor: selectedImage === index ? 'primary.main' : 'divider',
                  }}
                  onClick={() => setSelectedImage(index)}
                >
                  <CardMedia
                    component="img"
                    height="80"
                    image={image}
                    alt={`${product.title} ${index + 1}`}
                    sx={{ objectFit: 'cover' }}
                  />
                </Card>
              ))}
            </Box>
          )}
        </Grid>

        {/* Product Details */}
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {product.title}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating value={product.rating} precision={0.1} readOnly />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                ({product.numReviews} reviews)
              </Typography>
            </Box>

            <Chip
              label={product.brand}
              color="primary"
              variant="outlined"
              sx={{ mb: 2 }}
            />

            <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold', mb: 2 }}>
              {formatPrice(product.price)}
            </Typography>

            <Typography variant="body1" sx={{ mb: 3 }}>
              {product.description}
            </Typography>

            {product.stock > 0 ? (
              <Typography variant="body2" color="success.main" sx={{ mb: 2 }}>
                ✓ In Stock ({product.stock} available)
              </Typography>
            ) : (
              <Typography variant="body2" color="error.main" sx={{ mb: 2 }}>
                ✗ Out of Stock
              </Typography>
            )}

            {product.stock < 10 && product.stock > 0 && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                Only {product.stock} left in stock!
              </Alert>
            )}
          </Box>

          {/* Add to Cart Section */}
          <Card sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Typography variant="body1">Quantity:</Typography>
              <TextField
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                inputProps={{ min: 1, max: product.stock }}
                sx={{ width: 100 }}
                size="small"
              />
            </Box>

            <Button
              variant="contained"
              size="large"
              fullWidth
              startIcon={<AddCartIcon />}
              onClick={handleAddToCart}
              disabled={!isAuthenticated || product.stock === 0}
              sx={{ mb: 2 }}
            >
              {!isAuthenticated ? 'Login to Add to Cart' : 'Add to Cart'}
            </Button>

            {!isAuthenticated && (
              <Alert severity="info" sx={{ mt: 2 }}>
                Please login to add items to your cart
              </Alert>
            )}
          </Card>

          {/* Product Features */}
          {product.features && (
            <Card sx={{ mt: 3, p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Key Features
              </Typography>
              <Box component="ul" sx={{ pl: 2 }}>
                {product.features.map((feature, index) => (
                  <Typography component="li" key={index} variant="body2" sx={{ mb: 1 }}>
                    {feature}
                  </Typography>
                ))}
              </Box>
            </Card>
          )}
        </Grid>
      </Grid>

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

export default ProductDetail; 