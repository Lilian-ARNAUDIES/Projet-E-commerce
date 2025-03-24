import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { fetchProductById, addToCart, getUserAccount } from '../../utils/api';
import { getSessionId } from '../../utils/session';

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [userId, setUserId] = useState(null);
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    if (id) {
      fetchProductById(id)
        .then(setProduct)
        .catch((error) => console.error("Erreur de chargement :", error));
    }

    // Essayer de récupérer le compte utilisateur
    getUserAccount()
      .then((user) => {
        console.log("User récupéré :", user);
        setUserId(user.id);
      })
      .catch((error) => {
        console.log("Aucun utilisateur connecté, passage en mode invité.");
        // Si l'utilisateur n'est pas connecté, on génère ou récupère le sessionId
        const sid = getSessionId();
        setSessionId(sid);
      });
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      if (userId) {
        // Utilisateur connecté
        await addToCart(userId, product.id, 1, "user");
      } else if (sessionId) {
        // Mode invité avec sessionId
        await addToCart(sessionId, product.id, 1, "session");
      } else {
        alert("Une erreur est survenue. Veuillez réessayer.");
        return;
      }
      alert("Produit ajouté au panier !");
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier :", error);
      alert("Impossible d'ajouter le produit au panier.");
    }
  };

  if (!product) return <p>Chargement...</p>;

  return (
    <div className="container">
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>Prix : {product.price} €</p>
      <button className="btn btn-primary" onClick={handleAddToCart}>
        Ajouter au panier
      </button>
    </div>
  );
}