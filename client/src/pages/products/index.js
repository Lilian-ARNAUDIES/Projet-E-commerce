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
      <h1 className="text-center mb-5">Tous nos produits</h1>
      <div className="row g-4">
        {products.map((product) => (
          <div key={product.id} className="col-12 col-sm-6 col-lg-3">
            <Link href={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <ProductCard product={product} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}