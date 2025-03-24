import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

export default function CheckoutButton({ cartItems }) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://localhost:8000/api/payment/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems.map(item => ({
            name: item.productname,
            price: item.price,
            quantity: item.quantity,
          })),
          successUrl: 'https://localhost:3000/success',
          cancelUrl: 'https://localhost:3000/cancel',
        }),
      });

      const { id: sessionId } = await res.json();

      // Charger Stripe.js et rediriger vers Checkout
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error("Erreur lors du checkout :", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button className="btn btn-success mt-4" onClick={handleCheckout} disabled={loading}>
      {loading ? 'Chargement...' : 'Passer à la caisse'}
    </button>
  );
}