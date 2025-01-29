import { useEffect, useState } from 'react';
import ProductCard from '../../components/ProductCard';
import { fetchProducts } from '../../utils/api';

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  return (
    <div className="container mt-5">
      <h1>Nos Produits</h1>
      <div className="row">
        {products.map((product) => (
          <div key={product.id} className="col-md-4">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}