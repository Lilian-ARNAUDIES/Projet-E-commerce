import Link from 'next/link';
import { useRouter } from 'next/router';

export default function AdminLayout({ children }) {
  const router = useRouter();

  return (
    <div className="container-fluid">
      <div className="row min-vh-100">
        {/* Sidebar */}
        <nav className="col-md-3 col-lg-2 bg-dark text-white p-3">
          <h2 className="h4">Admin</h2>
          <ul className="nav flex-column mt-4">
            <li className="nav-item">
              <Link href="/admin/dashboard" legacyBehavior>
                <a className={`nav-link text-white ${router.pathname === "/admin/dashboard" ? "fw-bold text-warning" : ""}`}>
                  Tableau de bord
                </a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/admin/users" legacyBehavior>
                <a className={`nav-link text-white ${router.pathname === "/admin/users" ? "fw-bold text-warning" : ""}`}>
                  Utilisateurs
                </a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/admin/products" legacyBehavior>
                <a className={`nav-link text-white ${router.pathname === "/admin/products" ? "fw-bold text-warning" : ""}`}>
                  Produits
                </a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/admin/orders" legacyBehavior>
                <a className={`nav-link text-white ${router.pathname === "/admin/orders" ? "fw-bold text-warning" : ""}`}>
                  Commandes
                </a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/admin/categories" legacyBehavior>
                <a className={`nav-link text-white ${router.pathname === "/admin/categories" ? "fw-bold text-warning" : ""}`}>
                  Catégories
                </a>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Contenu principal */}
        <main className="col-md-9 col-lg-10 bg-light p-4">
          {children}
        </main>
      </div>
    </div>
  );
}