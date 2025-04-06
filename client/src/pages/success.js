import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getUserAccount } from '../utils/api';
import { getSessionId } from '../utils/session';

export default function Success() {
  const [orderId, setOrderId] = useState(null);
  const [totalPrice, setTotalPrice] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function finalizeOrder() {
      try {
        let userId = null;
        let sessionId = null;
        try {
          const user = await getUserAccount();
          userId = user.id;
        } catch (err) {
          sessionId = getSessionId();
        }

        // 🔥 Récupération du total price depuis `localStorage`
        const storedTotalPrice = localStorage.getItem('totalPrice');
        const totalPriceValue = storedTotalPrice ? parseFloat(storedTotalPrice) : 0;
        setTotalPrice(totalPriceValue); // 🔥 Stocker dans le state
        console.log('Envoi de la commande avec :', userId || sessionId, totalPriceValue);

        // 🔥 Envoyer le total price au serveur
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/checkout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(
            userId
              ? { userId, totalPrice: totalPriceValue }
              : { sessionId, totalPrice: totalPriceValue }
          ),
        });

        const data = await res.json();
        if (!res.ok) {
          setError(data.message || 'Erreur lors de la finalisation de la commande.');
        } else {
          setOrderId(data.orderId);
          setTotalPrice(data.totalPrice); // 🔥 Met à jour avec la réponse du backend
        }
      } catch (err) {
        setError('Erreur lors de la finalisation de la commande.');
      }
    }
    finalizeOrder();
  }, []);

  return (
    <div className="container my-5">
      <div className="card text-center shadow">
        <div className="card-body">
          {error ? (
            <>
              <h1 className="card-title text-danger mb-4">Erreur</h1>
              <p className="card-text lead">{error}</p>
            </>
          ) : (
            <>
              <h1 className="card-title text-success mb-4">Paiement Réussi !</h1>
              {orderId && <p className="card-text lead">Commande ID : {orderId}</p>}
              {totalPrice !== null && !isNaN(totalPrice) && (
                <p className="card-text lead">Montant total : {totalPrice.toFixed(2)} €</p>
              )}
            </>
          )}
          <Link href="/" className="btn btn-primary mt-3">Retour à la Boutique</Link>
        </div>
      </div>
    </div>
  );
}