import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  IconButton,
  TextField,
  Divider,
  Alert,
  Skeleton,
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  ShoppingCart as CartIcon,
} from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const { cart, loading, updateCartItem, removeFromCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Format price in Indian Rupees
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    await updateCartItem(productId, newQuantity);
  };

  const handleRemoveItem = async (productId) => {
    await removeFromCart(productId);
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (!isAuthenticated) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="info" sx={{ mb: 3 }}>
          Please login to view your cart
        </Alert>
        <Button
          variant="contained"
          onClick={() => navigate('/login')}
          sx={{ mr: 2 }}
        >
          Login
        </Button>
        <Button
          variant="outlined"
          onClick={() => navigate('/register')}
        >
          Register
        </Button>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Shopping Cart
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            {[...Array(3)].map((_, index) => (
              <Card key={index} sx={{ mb: 2 }}>
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={3}>
                      <Skeleton variant="rectangular" height={80} />
                    </Grid>
                    <Grid item xs={6}>
                      <Skeleton variant="text" height={24} />
                      <Skeleton variant="text" height={20} />
                    </Grid>
                    <Grid item xs={3}>
                      <Skeleton variant="text" height={24} />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Skeleton variant="text" height={32} />
              <Skeleton variant="text" height={24} />
              <Skeleton variant="text" height={24} />
              <Skeleton variant="rectangular" height={48} sx={{ mt: 2 }} />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <CartIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Your cart is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Start shopping to add items to your cart
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/')}
          >
            Continue Shopping
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Shopping Cart
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {cart.items.map((item) => (
            <Card key={item.productId} sx={{ mb: 2 }}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={3} sm={2}>
                    <img
                      src={item.images?.[0] || 'https://via.placeholder.com/80'}
                      alt={item.title}
                      style={{
                        width: '100%',
                        height: 80,
                        objectFit: 'cover',
                        borderRadius: 8,
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={9} sm={6}>
                    <Typography variant="h6" noWrap>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatPrice(item.price)} each
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <RemoveIcon />
                      </IconButton>
                      
                      <TextField
                        size="small"
                        value={item.quantity}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (!isNaN(value) && value > 0) {
                            handleQuantityChange(item.productId, value);
                          }
                        }}
                        sx={{ width: 60 }}
                        inputProps={{ min: 1, style: { textAlign: 'center' } }}
                      />
                      
                      <IconButton
                        size="small"
                        onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                      >
                        <AddIcon />
                      </IconButton>
                    </Box>
                  </Grid>

                  <Grid item xs={6} sm={2}>
                    <Typography variant="h6" color="primary">
                      {formatPrice(item.price * item.quantity)}
                    </Typography>
                  </Grid>

                  <Grid item xs={6} sm={1}>
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveItem(item.productId)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            
            <Box sx={{ my: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Subtotal ({cart.items.length} items):</Typography>
                <Typography>{formatPrice(cart.bill)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Shipping:</Typography>
                <Typography>Free</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6" color="primary">
                  {formatPrice(cart.bill)}
                </Typography>
              </Box>
            </Box>

            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handleCheckout}
              sx={{ mb: 2 }}
            >
              Proceed to Checkout
            </Button>

            <Button
              variant="outlined"
              size="large"
              fullWidth
              onClick={() => navigate('/')}
            >
              Continue Shopping
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Cart; 