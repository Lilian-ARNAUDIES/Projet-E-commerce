import { useEffect, useState } from 'react';
import { getCart, updateCart } from '../../utils/api';

export default function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    getCart().then(setCart);
  }, []);

  const handleQuantityChange = (productId, quantity) => {
    updateCart(productId, quantity).then(setCart);
  };

  return (
    <div className="container mt-5">
      <h1>Mon Panier</h1>
      {cart.map((item) => (
        <div key={item.productId} className="mb-3">
          <h4>{item.productName}</h4>
          <p>Prix : {item.price} €</p>
          <input
            type="number"
            value={item.quantity}
            onChange={(e) => handleQuantityChange(item.productId, e.target.value)}
          />
        </div>
      ))}
      <button className="btn btn-success mt-4">Passer à la caisse</button>
    </div>
  );
}