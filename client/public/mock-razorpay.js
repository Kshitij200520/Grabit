// Mock Razorpay Implementation for Project Demo
// This creates a realistic payment UI without requiring real Razorpay setup

class MockRazorpay {
  constructor(options) {
    this.options = options;
    this.modal = null;
    this.eventHandlers = {}; // Store event handlers
  }

  open() {
    this.createMockPaymentModal();
  }

  // Add the missing .on() method that real Razorpay has
  on(event, handler) {
    if (!this.eventHandlers[event]) {
      this.eventHandlers[event] = [];
    }
    this.eventHandlers[event].push(handler);
    console.log(`🎭 Mock Razorpay: Registered handler for ${event} event`);
  }

  // Method to trigger events (for internal use)
  _triggerEvent(event, data) {
    if (this.eventHandlers[event]) {
      this.eventHandlers[event].forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error(`Error in ${event} handler:`, error);
        }
      });
    }
  }

  createMockPaymentModal() {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: Arial, sans-serif;
    `;

    // Create payment modal
    const modal = document.createElement('div');
    modal.style.cssText = `
      background: white;
      border-radius: 8px;
      width: 450px;
      max-width: 90vw;
      max-height: 90vh;
      overflow: auto;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    `;

    modal.innerHTML = `
      <div style="padding: 20px; border-bottom: 1px solid #eee;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h3 style="margin: 0; color: #3399cc; font-size: 18px;">
            💳 ${this.options.name || 'E-Shop'} - Demo Payment
          </h3>
          <button id="closeModal" style="background: none; border: none; font-size: 20px; cursor: pointer; color: #666;">×</button>
        </div>
        <p style="margin: 10px 0 0 0; color: #666; font-size: 14px;">
          Amount: ₹${(this.options.amount / 100).toFixed(2)} | Order: ${this.options.order_id}
        </p>
      </div>

      <div style="padding: 20px;">
        <div style="background: #e8f4fd; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
          <p style="margin: 0; color: #2563eb; font-size: 14px; text-align: center;">
            🎭 <strong>Demo Mode</strong> - Perfect for project presentation!<br>
            No real payment will be processed.
          </p>
        </div>

        <div style="margin-bottom: 20px;">
          <label style="display: block; margin-bottom: 8px; font-weight: bold; color: #333;">Choose Payment Method:</label>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <button class="payment-method" data-method="card" style="
              padding: 12px;
              border: 2px solid #e5e5e5;
              border-radius: 6px;
              background: white;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
              transition: all 0.2s;
            ">
              💳 Card
            </button>
            <button class="payment-method" data-method="upi" style="
              padding: 12px;
              border: 2px solid #e5e5e5;
              border-radius: 6px;
              background: white;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
              transition: all 0.2s;
            ">
              📱 UPI
            </button>
            <button class="payment-method" data-method="netbanking" style="
              padding: 12px;
              border: 2px solid #e5e5e5;
              border-radius: 6px;
              background: white;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
              transition: all 0.2s;
            ">
              🏦 Net Banking
            </button>
            <button class="payment-method" data-method="wallet" style="
              padding: 12px;
              border: 2px solid #e5e5e5;
              border-radius: 6px;
              background: white;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
              transition: all 0.2s;
            ">
              💰 Wallet
            </button>
          </div>
        </div>

        <div id="cardDetails" style="display: none;">
          <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #333;">Card Number:</label>
            <input type="text" id="cardNumber" placeholder="4111 1111 1111 1111" style="
              width: 100%;
              padding: 12px;
              border: 2px solid #e5e5e5;
              border-radius: 6px;
              font-size: 16px;
              box-sizing: border-box;
            ">
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <div>
              <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #333;">Expiry:</label>
              <input type="text" id="expiry" placeholder="MM/YY" style="
                width: 100%;
                padding: 12px;
                border: 2px solid #e5e5e5;
                border-radius: 6px;
                font-size: 16px;
                box-sizing: border-box;
              ">
            </div>
            <div>
              <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #333;">CVV:</label>
              <input type="text" id="cvv" placeholder="123" style="
                width: 100%;
                padding: 12px;
                border: 2px solid #e5e5e5;
                border-radius: 6px;
                font-size: 16px;
                box-sizing: border-box;
              ">
            </div>
          </div>
        </div>

        <div id="upiDetails" style="display: none;">
          <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #333;">UPI ID:</label>
          <input type="text" id="upiId" placeholder="your-id@paytm" style="
            width: 100%;
            padding: 12px;
            border: 2px solid #e5e5e5;
            border-radius: 6px;
            font-size: 16px;
            box-sizing: border-box;
          ">
        </div>

        <div id="netbankingDetails" style="display: none;">
          <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #333;">Select Bank:</label>
          <select id="bankSelect" style="
            width: 100%;
            padding: 12px;
            border: 2px solid #e5e5e5;
            border-radius: 6px;
            font-size: 16px;
            box-sizing: border-box;
          ">
            <option>SBI</option>
            <option>HDFC Bank</option>
            <option>ICICI Bank</option>
            <option>Axis Bank</option>
            <option>Kotak Bank</option>
          </select>
        </div>

        <div id="walletDetails" style="display: none;">
          <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #333;">Select Wallet:</label>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <button class="wallet-option" data-wallet="paytm" style="
              padding: 12px;
              border: 2px solid #e5e5e5;
              border-radius: 6px;
              background: white;
              cursor: pointer;
            ">Paytm</button>
            <button class="wallet-option" data-wallet="phonepe" style="
              padding: 12px;
              border: 2px solid #e5e5e5;
              border-radius: 6px;
              background: white;
              cursor: pointer;
            ">PhonePe</button>
          </div>
        </div>

        <button id="proceedPayment" style="
          width: 100%;
          padding: 15px;
          background: #3399cc;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          margin-top: 20px;
          transition: background 0.2s;
        " onmouseover="this.style.background='#2a7aa0'" onmouseout="this.style.background='#3399cc'">
          💳 Pay ₹${(this.options.amount / 100).toFixed(2)} (Demo)
        </button>

        <p style="margin: 15px 0 0 0; text-align: center; color: #999; font-size: 12px;">
          🔒 Secured by Mock Razorpay for Demo • No real money will be charged
        </p>
      </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Add event listeners
    this.addEventListeners(overlay, modal);
  }

  addEventListeners(overlay, modal) {
    const closeModal = () => {
      document.body.removeChild(overlay);
      if (this.options.modal && this.options.modal.ondismiss) {
        this.options.modal.ondismiss();
      }
    };

    // Close button
    modal.querySelector('#closeModal').onclick = closeModal;

    // Payment method selection
    modal.querySelectorAll('.payment-method').forEach(btn => {
      btn.onclick = () => {
        // Reset all buttons
        modal.querySelectorAll('.payment-method').forEach(b => {
          b.style.borderColor = '#e5e5e5';
          b.style.background = 'white';
        });

        // Highlight selected
        btn.style.borderColor = '#3399cc';
        btn.style.background = '#f0f8ff';

        // Show relevant details
        const method = btn.dataset.method;
        ['cardDetails', 'upiDetails', 'netbankingDetails', 'walletDetails'].forEach(id => {
          modal.querySelector(`#${id}`).style.display = 'none';
        });
        
        if (method === 'card') {
          modal.querySelector('#cardDetails').style.display = 'block';
        } else if (method === 'upi') {
          modal.querySelector('#upiDetails').style.display = 'block';
        } else if (method === 'netbanking') {
          modal.querySelector('#netbankingDetails').style.display = 'block';
        } else if (method === 'wallet') {
          modal.querySelector('#walletDetails').style.display = 'block';
        }
      };
    });

    // Wallet selection
    modal.querySelectorAll('.wallet-option').forEach(btn => {
      btn.onclick = () => {
        modal.querySelectorAll('.wallet-option').forEach(b => {
          b.style.borderColor = '#e5e5e5';
          b.style.background = 'white';
        });
        btn.style.borderColor = '#3399cc';
        btn.style.background = '#f0f8ff';
      };
    });

    // Proceed payment
    modal.querySelector('#proceedPayment').onclick = () => {
      this.processPayment(closeModal);
    };

    // Close on overlay click
    overlay.onclick = (e) => {
      if (e.target === overlay) closeModal();
    };
  }

  processPayment(closeModal) {
    // Show processing
    const button = document.querySelector('#proceedPayment');
    button.innerHTML = '⏳ Processing...';
    button.disabled = true;

    // Simulate payment processing
    setTimeout(() => {
      closeModal();
      
      // Generate mock payment response
      const mockResponse = {
        razorpay_payment_id: `pay_${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
        razorpay_order_id: this.options.order_id,
        razorpay_signature: `mock_signature_${Date.now()}`
      };

      // Call success handler
      if (this.options.handler) {
        this.options.handler(mockResponse);
      }
    }, 2000);
  }
}

// Make it available globally like real Razorpay
window.Razorpay = MockRazorpay;

// Prevent real Razorpay from overriding our mock
Object.defineProperty(window, 'Razorpay', {
  value: MockRazorpay,
  writable: false,
  configurable: false
});

console.log('🎭 Mock Razorpay UI loaded - Perfect for demos!');
console.log('🔒 Real Razorpay SDK is blocked - Using mock implementation only');

// Also block any script loading that tries to load real Razorpay
const originalCreateElement = document.createElement;
document.createElement = function(tagName) {
  const element = originalCreateElement.call(this, tagName);
  
  if (tagName.toLowerCase() === 'script') {
    const originalSrcSetter = Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype, 'src').set;
    Object.defineProperty(element, 'src', {
      set: function(value) {
        if (value && value.includes('checkout.razorpay.com')) {
          console.log('🚫 Blocked real Razorpay script loading:', value);
          return; // Block real Razorpay script
        }
        originalSrcSetter.call(this, value);
      },
      get: function() {
        return this.getAttribute('src');
      }
    });
  }
  
  return element;
};
