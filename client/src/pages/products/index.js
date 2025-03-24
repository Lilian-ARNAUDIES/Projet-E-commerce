import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProductCard from '../../components/ProductCard';
import { fetchProducts } from '../../utils/api';

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  return (
    <div className="container">
      <h1>Nos Produits</h1>
      <div className="row">
        {products.map((product) => (
          <div key={product.id} className="col-md-4">
            <Link href={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <ProductCard product={product} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}