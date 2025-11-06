# 💳 Razorpay Test Cards (बिना KYC के!)

## Test Mode में Payment कैसे करें:

### 📝 **Test Card Numbers** (Always Success):
```
Card Number: 4111 1111 1111 1111
Expiry Date: Any future date (e.g., 12/25)
CVV: Any 3 digits (e.g., 123)
Name: Any name
```

### 🔥 **More Test Cards**:
```
Visa: 4111 1111 1111 1111
Mastercard: 5555 5555 5555 4444
American Express: 3782 822463 10005
Rupay: 6074 6000 0000 0007
```

### 🚫 **Failed Payment Test Cards**:
```
Card Number: 4000 0000 0000 0002
Result: Payment will fail intentionally
```

### 💰 **UPI Testing**:
```
UPI ID: success@razorpay
Result: Payment successful

UPI ID: failure@razorpay  
Result: Payment failed
```

### 📱 **Wallet Testing**:
- Paytm: Use any mobile number
- PhonePe: Use any mobile number
- All will show success in test mode

## ⚡ **Quick Start**:
1. Go to your app: http://localhost:3000
2. Add items to cart
3. Go to checkout
4. Click "Pay with Razorpay"
5. Use above test card numbers
6. Payment will work without real money!

## 🔒 **Important Notes**:
- ✅ Test mode में कोई real money charge नहीं होता
- ✅ KYC की जरूरत नहीं test keys के लिए
- ✅ All test payments are FREE
- ❌ Live payments के लिए KYC mandatory है

## 🎯 **Current Status**:
- Backend: Using rzp_test_1DP5mmOlF5G5ag
- Frontend: Configured for test payments
- Ready to test: YES! 🚀
