# 🔧 Razorpay Integration Setup Guide

## Step 1: Get Your Razorpay Keys
1. Go to https://dashboard.razorpay.com/
2. Sign up/Login with your email
3. Go to **Settings** → **API Keys**
4. Generate your **Test Keys** (for testing payments)
5. Copy your Key ID and Secret

## Step 2: Update Environment Files

### Backend (.env file in server folder):
```
RAZORPAY_KEY_ID=rzp_test_YOUR_ACTUAL_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_ACTUAL_SECRET_KEY
```

### Frontend (.env file in client folder):
```
REACT_APP_RAZORPAY_KEY_ID=rzp_test_YOUR_ACTUAL_KEY_ID
```

## Step 3: Test Payment Flow
1. Use test card numbers provided by Razorpay
2. Test cards that always succeed:
   - Card Number: 4111 1111 1111 1111
   - Expiry: Any future date
   - CVV: Any 3 digits

## Step 4: Go Live (Optional)
1. Complete KYC verification on Razorpay dashboard
2. Replace test keys with live keys
3. Update webhook URLs if using them

## Current Status:
✅ Razorpay SDK integrated
✅ Payment flow implemented  
✅ Order verification working
⚠️  Need real API keys for actual payments

## Important Notes:
- Demo keys only show payment UI, don't process real payments
- Test keys allow testing with fake cards
- Live keys process real money transactions
- Always test thoroughly before going live
