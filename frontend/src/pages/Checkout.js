import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  Divider,
  Alert,
  Skeleton,
  Paper,
} from '@mui/material';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Checkout = () => {
  const { cart, loading: cartLoading } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Format price in Indian Rupees
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleProceedToPayment = () => {
    // TODO: Implement payment integration
    alert('Payment integration coming soon!');
  };

  if (!isAuthenticated) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="info" sx={{ mb: 3 }}>
          Please login to proceed with checkout
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

  if (cartLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Checkout
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Skeleton variant="rectangular" height={200} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rectangular" height={300} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="info" sx={{ mb: 3 }}>
          Your cart is empty. Please add some items before checkout.
        </Alert>
        <Button
          variant="contained"
          onClick={() => navigate('/')}
        >
          Continue Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Checkout
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Order Summary */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              
              {cart.items.map((item) => (
                <Box key={item.productId} sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Box>
                    <Typography variant="body1" fontWeight="medium">
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Quantity: {item.quantity}
                    </Typography>
                  </Box>
                  <Typography variant="body1">
                    {formatPrice(item.price * item.quantity)}
                  </Typography>
                </Box>
              ))}
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Subtotal:</Typography>
                <Typography>{formatPrice(cart.bill)}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Delivery:</Typography>
                <Typography>Free</Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6" color="primary">
                  {formatPrice(cart.bill)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Payment Section */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Payment
              </Typography>
              
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleProceedToPayment}
                sx={{ mb: 2 }}
              >
                Proceed to Payment
              </Button>

              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate('/cart')}
              >
                Back to Cart
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Checkout; 