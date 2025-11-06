import React from 'react';
import { useParams } from 'react-router-dom';
import OrderStatus from '../components/OrderStatus';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './OrderDetails.css';

const OrderDetails = () => {
  const { id } = useParams();

  return (
    <div className="order-details-page">
      <div className="container">
        <OrderStatus orderId={id} />
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
          theme="light"
        />
      </div>
    </div>
  );
};

export default OrderDetails;
