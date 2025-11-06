import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderAPI, paymentAPI } from '../services/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Checkout.css';

const Checkout = () => {
  const { cartState, user, dispatch } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    paymentMethod: 'Razorpay'
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const calculateTotals = () => {
    const itemsPrice = cartState.totalAmount;
    const shippingPrice = 5.00;
    const taxPrice = itemsPrice * 0.1;
    const totalPrice = itemsPrice + shippingPrice + taxPrice;

    console.log('🔍 Checkout totals calculation:', {
      cartState: cartState,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      cartItems: cartState.items
    });

    return { itemsPrice, shippingPrice, taxPrice, totalPrice };
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      // Check if our mock Razorpay is already loaded
      if (window.Razorpay) {
        console.log('🎭 Mock Razorpay already loaded!');
        resolve(true);
        return;
      }
      
      // If mock Razorpay is not loaded, wait a bit and try again
      setTimeout(() => {
        if (window.Razorpay) {
          console.log('🎭 Mock Razorpay loaded successfully!');
          resolve(true);
        } else {
          console.error('❌ Mock Razorpay failed to load');
          resolve(false);
        }
      }, 100);
    });
  };

  const handleRazorpayPayment = async (orderData, orderId) => {
    console.log('🎭 Starting mock payment process...');
    const res = await loadRazorpayScript();
    
    if (!res) {
      toast.error('Mock Razorpay failed to load. Please check if mock-razorpay.js is included.');
      return;
    }

    console.log('🎭 Mock Razorpay type:', typeof window.Razorpay);
    console.log('🎭 Mock Razorpay constructor:', window.Razorpay.name);

    try {
      console.log('Creating Razorpay order...', { orderId, amount: orderData.totalPrice });
      
      // Create Razorpay order
      const response = await paymentAPI.createOrder({
        orderId: orderId,
        amount: orderData.totalPrice
      });

      console.log('Razorpay order created:', response.data);

      const options = {
        key: response.data.key,
        amount: response.data.amount,
        currency: response.data.currency,
        name: 'E-Shop',
        description: 'Order Payment',
        order_id: response.data.id,
        handler: async function (response) {
          try {
            console.log('Payment successful, verifying...', response);
            
            // Verify payment
            const verifyResponse = await paymentAPI.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: orderId
            });

            console.log('Payment verification response:', verifyResponse.data);

            if (verifyResponse.data.success) {
              toast.success('🎉 Payment successful!');
              
              // Clear cart
              dispatch({ type: 'CLEAR_CART' });
              
              // Show detailed success messages
              setTimeout(() => {
                toast.success('✅ Order confirmed! Your payment has been processed successfully.');
              }, 1000);
              
              setTimeout(() => {
                toast.info('🚚 Your order will be delivered within 10 minutes!');
              }, 2500);

              setTimeout(() => {
                toast.info('👨‍💼 A delivery executive will be assigned in 30 seconds!');
              }, 4000);

              setTimeout(() => {
                toast.info('📱 You will receive delivery updates via notifications!');
              }, 5500);
              
              // Redirect to orders page to show all orders
              setTimeout(() => {
                toast.success('🎯 Redirecting to your orders page...');
                navigate('/orders', { state: { fromCheckout: true } });
              }, 7000);
            } else {
              toast.error('❌ Payment verification failed! Please try again.');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            console.error('Error details:', {
              response: error.response?.data,
              status: error.response?.status,
              message: error.message
            });
            
            let errorMessage = 'Payment verification failed: ';
            if (error.response?.data?.message) {
              errorMessage += error.response.data.message;
            } else if (error.response?.data?.error) {
              errorMessage += error.response.data.error;
            } else if (error.message) {
              errorMessage += error.message;
            } else {
              errorMessage += 'Unknown error occurred';
            }
            
            toast.error(`❌ ${errorMessage}`);
          }
        },
        prefill: {
          name: formData.fullName,
          email: user.email,
          contact: '9999999999'
        },
        notes: {
          address: formData.address
        },
        theme: {
          color: '#007bff'
        },
        modal: {
          ondismiss: function() {
            toast.warn('Payment cancelled. You can retry anytime.');
          }
        }
      };

      console.log('🎭 Opening Razorpay payment modal...');
      console.log('🎭 Payment options:', options);
      const paymentObject = new window.Razorpay(options);
      console.log('🎭 Payment object created:', paymentObject);
      console.log('🎭 Payment object type:', typeof paymentObject.on);
      
      // Add error handler for failed payments (Mock will never trigger this, but keeping for compatibility)
      paymentObject.on('payment.failed', function (response) {
        console.error('🎭 Mock payment failed (should not happen):', response.error);
        
        let errorMessage = 'Payment failed. ';
        
        if (response.error.code === 'BAD_REQUEST_ERROR') {
          errorMessage += 'Please check your payment details and try again.';
        } else if (response.error.code === 'GATEWAY_ERROR') {
          errorMessage += 'Payment gateway error. Please try again after some time.';
        } else if (response.error.code === 'NETWORK_ERROR') {
          errorMessage += 'Network error. Please check your internet connection.';
        } else {
          errorMessage += response.error.description || 'Please try again.';
        }
        
        toast.error(`❌ ${errorMessage}`);
        setLoading(false);
      });
      
      console.log('🎭 Starting mock payment flow...');
      paymentObject.open();

    } catch (error) {
      console.error('Razorpay payment error:', error);
      console.error('Payment creation error details:', {
        response: error.response?.data,
        status: error.response?.status,
        message: error.message
      });
      
      let errorMessage = 'Payment initialization failed: ';
      if (error.response?.data?.message) {
        errorMessage += error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage += error.response.data.error;
      } else if (error.message) {
        errorMessage += error.message;
      } else {
        errorMessage += 'Unknown error occurred';
      }
      
      toast.error(errorMessage);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validation checks
      if (!user || !user._id) {
        toast.error('Please login to place an order');
        navigate('/login');
        return;
      }

      if (!cartState.items || cartState.items.length === 0) {
        toast.error('Your cart is empty. Please add some items before checkout.');
        navigate('/products');
        return;
      }

      // Check if cart has valid amounts
      if (!cartState.totalAmount || cartState.totalAmount <= 0) {
        toast.error('Cart total is invalid. Please refresh and try again.');
        navigate('/cart');
        return;
      }

      // Validate form data
      if (!formData.fullName || !formData.address || !formData.city) {
        toast.error('Please fill all required fields');
        return;
      }

      console.log('🔍 Checkout validation:', {
        user: user ? { id: user._id, email: user.email } : null,
        cartItemsCount: cartState.items?.length || 0,
        cartTotalAmount: cartState.totalAmount,
        cartItems: cartState.items
      });
      
      const { itemsPrice, shippingPrice, taxPrice, totalPrice } = calculateTotals();

      const orderData = {
        userId: user._id,
        orderItems: cartState.items.map(item => ({
          product: item.product._id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: formData,
        paymentMethod: formData.paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
      };

      console.log('🛒 Creating order with data:', orderData);
      console.log('🛒 Cart items detail:', cartState.items.map(item => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity
      })));
      
      const response = await orderAPI.create(orderData);
      const orderId = response.data.order._id;
      
      console.log('Order created successfully:', orderId);
      toast.success('Order created! Proceeding to payment...');

      if (formData.paymentMethod === 'Razorpay') {
        await handleRazorpayPayment(orderData, orderId);
      } else if (formData.paymentMethod === 'Cash on Delivery') {
        // Handle COD orders - they are automatically confirmed with delivery assignment
        dispatch({ type: 'CLEAR_CART' });
        toast.success('🎉 COD Order Confirmed! Delivery executive assigned. Check order details for delivery info.');
        
        // Small delay before redirect to show the success message
        setTimeout(() => {
          toast.success('🎯 Redirecting to your orders page...');
          navigate('/orders', { state: { fromCheckout: true } });
        }, 2000);
      } else {
        // Handle other payment methods
        dispatch({ type: 'CLEAR_CART' });
        toast.success('Order placed successfully!');
        
        // Small delay before redirect to show the success message
        setTimeout(() => {
          toast.success('🎯 Redirecting to your orders page...');
          navigate('/orders', { state: { fromCheckout: true } });
        }, 2000);
      }

    } catch (error) {
      console.error('Checkout error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error creating order';
      toast.error(`Checkout failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="text-center">
            <h2>Please login to checkout</h2>
          </div>
        </div>
      </div>
    );
  }

  if (cartState.items.length === 0) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="text-center">
            <h2>Your cart is empty</h2>
            <button onClick={() => navigate('/products')} className="btn btn-primary">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { itemsPrice, shippingPrice, taxPrice, totalPrice } = calculateTotals();

  return (
    <div className="checkout-page">
      <ToastContainer 
        position="top-right" 
        autoClose={5000} 
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="container">
        <h1>Checkout</h1>
        
        <div className="checkout-content">
          <div className="checkout-form">
            <form onSubmit={handleSubmit}>
              <div className="card">
                <div className="card-header">
                  <h3>🚚 Delivery Information</h3>
                  <p className="delivery-note">⚡ Express delivery in 10 minutes!</p>
                </div>
                <div className="card-body">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="form-control"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Postal Code</label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className="form-control"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Country</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3>💳 Payment Method</h3>
                </div>
                <div className="card-body">
                  <div className="payment-options">
                    <label className="payment-option">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Razorpay"
                        checked={formData.paymentMethod === 'Razorpay'}
                        onChange={handleInputChange}
                      />
                      <div className="payment-info">
                        <strong>💳 Pay with Razorpay</strong>
                        <p>Credit/Debit Card, UPI, Net Banking, Wallets</p>
                      </div>
                    </label>
                    
                    <label className="payment-option">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Cash on Delivery"
                        checked={formData.paymentMethod === 'Cash on Delivery'}
                        onChange={handleInputChange}
                      />
                      <div className="payment-info">
                        <strong>💵 Cash on Delivery</strong>
                        <p>Pay when your order arrives</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary place-order-btn"
                disabled={loading}
              >
                {loading ? 'Processing...' : `Place Order - ₹${totalPrice.toFixed(2)}`}
              </button>
            </form>
          </div>

          <div className="order-summary">
            <div className="card">
              <div className="card-header">
                <h3>📝 Order Summary</h3>
              </div>
              <div className="card-body">
                <div className="order-items">
                  {cartState.items.map(item => (
                    <div key={item.product._id} className="order-item">
                      <img src={item.product.image} alt={item.product.name} />
                      <div className="item-info">
                        <h4>{item.product.name}</h4>
                        <p>Qty: {item.quantity} × ₹{item.price}</p>
                      </div>
                      <div className="item-total">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
                
                <hr />
                
                <div className="totals">
                  <div className="total-row">
                    <span>Items:</span>
                    <span>₹{itemsPrice.toFixed(2)}</span>
                  </div>
                  <div className="total-row">
                    <span>Delivery:</span>
                    <span>₹{shippingPrice.toFixed(2)}</span>
                  </div>
                  <div className="total-row">
                    <span>Tax (10%):</span>
                    <span>₹{taxPrice.toFixed(2)}</span>
                  </div>
                  <div className="total-row final-total">
                    <span>Total:</span>
                    <span>₹{totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <div className="delivery-promise">
                  <div className="promise-item">
                    <span className="icon">🚀</span>
                    <span>10-minute delivery</span>
                  </div>
                  <div className="promise-item">
                    <span className="icon">👨‍🍳</span>
                    <span>Live order tracking</span>
                  </div>
                  <div className="promise-item">
                    <span className="icon">📱</span>
                    <span>Real-time updates</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
