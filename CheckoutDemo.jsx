import React, {useState} from 'react';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';

export default function CheckoutDemo(){
  const [status, setStatus] = useState('idle');
  const demoShowId = ''; // leave blank: user should select a show id or set via UI
  const demoSeats = ['A_1','A_2'];

  async function startRazor(){
    setStatus('holding');
    // 1. Hold seats
    let hold;
    try{ hold = (await axios.post('/api/bookings/hold',{ showId: demoShowId, seats: demoSeats })).data; }
    catch(e){ alert('Hold failed: '+ (e.response?.data?.message || e.message)); setStatus('idle'); return; }
    // 2. Create pending booking
    const bp = await axios.post('/api/bookings/create-pending',{ showId: demoShowId, seats: demoSeats, userEmail: 'demo@example.com', holdToken: hold.holdToken });
    const bookingId = bp.data.bookingId;
    const amount = bp.data.total;
    // 3. Create razorpay order with receipt=bookingId
    const order = (await axios.post('/api/payments/razorpay/create',{ amount, currency:'INR', bookingId })).data;
    // 4. Open Razorpay checkout
    const options = {
      key: process.env.VITE_RZP_KEY_ID || '',
      amount: order.amount,
      currency: order.currency,
      order_id: order.id,
      handler: async function(response){
        try{
  await axios.post('/api/payments/confirm',{
    bookingId,
    razorpay_order_id: response.razorpay_order_id,
    razorpay_payment_id: response.razorpay_payment_id,
    razorpay_signature: response.razorpay_signature
  });
  alert('Payment verified and booking marked paid! BookingId: '+bookingId);
  setStatus('paid-confirmed');
}catch(e){
  alert('Confirm failed: '+(e.response?.data?.message||e.message));
}
        setStatus('paid-pending-webhook');
      }
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  }

  async function startStripe(){
    setStatus('holding');
    let hold;
    try{ hold = (await axios.post('/api/bookings/hold',{ showId: demoShowId, seats: demoSeats })).data; }
    catch(e){ alert('Hold failed: '+ (e.response?.data?.message || e.message)); setStatus('idle'); return; }
    const bp = await axios.post('/api/bookings/create-pending',{ showId: demoShowId, seats: demoSeats, userEmail: 'demo@example.com', holdToken: hold.holdToken });
    const bookingId = bp.data.bookingId;
    const amount = bp.data.total;
    const pi = (await axios.post('/api/payments/stripe/create-payment-intent',{ amount, currency:'inr', bookingId })).data;
    const stripe = await loadStripe(process.env.VITE_STRIPE_PUBLISHABLE_KEY || '');
    // For demo, we'll redirect to stripe checkout is complex; here we just alert clientSecret
    alert('Stripe clientSecret created. Use Stripe Elements to complete payment in production. clientSecret: '+pi.clientSecret);
    setStatus('stripe-intent-created');
  }

  return (<div>
    <h2>Demo Checkout (you must set demoShowId and include Razorpay/Stripe keys in .env)</h2>
    <div>Seats (demo): A_1, A_2</div>
    <div style={{marginTop:10}}>
      <button onClick={startRazor}>Pay with Razorpay (demo)</button>
      <button onClick={startStripe}>Pay with Stripe (demo)</button>
    </div>
    <div>Status: {status}</div>
  </div>);
}
