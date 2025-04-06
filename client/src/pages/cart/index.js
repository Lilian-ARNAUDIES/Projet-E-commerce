import { useEffect, useState } from 'react';
import { getCart, updateCart, getUserAccount, deleteCartItem } from '../../utils/api';
import { getSessionId } from '../../utils/session';
import CheckoutButton from '../../components/checkoutButton';

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [userId, setUserId] = useState(null);
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    // Tenter de récupérer le compte utilisateur
    getUserAccount()
      .then((user) => {
        console.log("User récupéré :", user);
        setUserId(user.id);
        // Récupérer le panier via l'ID utilisateur
        return getCart(user.id, "user");
      })
      .then(setCart)
      .catch((error) => {
        console.log("Aucun utilisateur connecté, passage en mode invité.");
        // Générer ou récupérer le sessionId depuis le localStorage
        const sid = getSessionId();
        setSessionId(sid);
        // Récupérer le panier avec le sessionId
        getCart(sid, "session")
          .then(setCart)
          .catch((err) =>
            console.error("Erreur de chargement du panier invité :", err)
          );
      });
  }, []);


  // Mise à jour de la quantité d'un item
  const handleQuantityChange = (cartItemId, quantity) => {
    if (quantity <= 0) {
      alert("La quantité doit être supérieure à zéro.");
      return;
    }
    updateCart(cartItemId, quantity)
      .then((updatedItem) => {
        // On ne met à jour que la quantité afin de conserver les autres informations
        setCart((prevCart) =>
          prevCart.map((item) =>
            item.id === updatedItem.id ? { ...item, quantity: updatedItem.quantity } : item
          )
        );
      })
      .catch((error) =>
        console.error("Erreur lors de la mise à jour du panier :", error)
      );
  };

  // Suppression d'un item du panier
  const handleDelete = (cartItemId) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet article ?")) {
      deleteCartItem(cartItemId)
        .then(() => {
          setCart((prevCart) => prevCart.filter((item) => item.id !== cartItemId));
        })
        .catch((error) =>
          console.error("Erreur lors de la suppression de l'item du panier :", error)
        );
    }
  };

  // Calcul du total général du panier
  const totalCart = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // 🔥 Sauvegarde `totalCart` dans localStorage avant de passer au paiement
  useEffect(() => {
    localStorage.setItem('totalPrice', totalCart.toString());
  }, [totalCart]);
  
  return (
    <>
    <div className="container">
      <h1>Mon Panier</h1>
      {cart.length > 0 ? (
        <>
          <div className="table-responsive">
            <table className="table table-striped">
            <thead>
              <tr>
                <th>Produit</th>
                <th>Prix unitaire</th>
                <th>Quantité</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id}>
                  <td>{item.productname}</td>
                  <td>{item.price} €</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item.id, Number(e.target.value))
                      }
                      style={{ width: '60px' }}
                    />
                  </td>
                  <td>{(item.price * item.quantity).toFixed(2)} €</td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(item.id)}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          <h3>Total Panier : {totalCart.toFixed(2)} €</h3>
          <CheckoutButton cartItems={cart} />
        </>
      ) : (
        <p>Votre panier est vide.</p>
      )}
    </div>
    <style jsx>{`
      @media (max-width: 576px) {
        .container {
          padding-left: 10px;
          padding-right: 10px;
        }

        table input[type="number"] {
          width: 100%;
          min-width: 50px;
        }

        h1, h3 {
          font-size: 1.5rem;
        }
      }
    `}</style>
    </>
    );
}