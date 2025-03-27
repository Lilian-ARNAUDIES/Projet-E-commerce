import Link from 'next/link';

export default function ProductCard({ product }) {
  return (
    <div className="card h-100 shadow-sm border-0">
      <img src={`${product.image}`} className="card-img-top" alt={product.name} style={{ height: '250px', objectFit: 'cover' }} />
      <div className="card-body d-flex flex-column justify-content-between">
        <h5 className="card-title">{product.name}</h5>
        <p className="card-text text-muted" style={{ fontSize: '0.9rem' }}>
          {product.description.length > 50
            ? product.description.slice(0, 50) + '...'
            : product.description}
        </p>
        <p className="fw-bold mb-2">{product.price} €</p>

        <Link href={`/products/${product.id}`} className="btn btn-outline-primary w-100 mt-auto">
          Voir le produit
        </Link>
      </div>
    </div>
  );
}