import React from 'react';
import { useParams } from 'react-router-dom';
import OrderStatus from '../components/OrderStatus';
import './OrderDetailPage.css';

const OrderDetailPage = () => {
  const { orderId } = useParams();

  return (
    <div className="order-detail-page">
      <div className="container">
        <OrderStatus orderId={orderId} />
      </div>
    </div>
  );
};

export default OrderDetailPage;
