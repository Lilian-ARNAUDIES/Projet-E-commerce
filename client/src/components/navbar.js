import Link from 'next/link';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { getUserRole, isAuthenticated, logout } from '../utils/auth';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDumbbell, faUser, faShoppingCart, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

export default function AppNavbar() {
  const [userRole, setUserRole] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [categories, setCategories] = useState([]);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    setUserRole(getUserRole());
  }, []);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`)
      .then((res) => res.json())
      .then((data) => {
        const result = Array.isArray(data) ? data : data.data;
        setCategories(result || []);
      })
      .catch((err) => console.error('Erreur chargement catégories :', err));
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/account/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow-lg">
      <Container>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="me-auto d-lg-none" />

        <Navbar.Brand
          as={Link}
          href="/"
          className="fs-3 fw-bold text-white d-flex align-items-center position-absolute top-0 start-50 translate-middle-x position-lg-static mt-1"
        >
            <FontAwesomeIcon icon={faDumbbell} className="me-2" /> FitGear
        </Navbar.Brand>

        <div className="d-flex d-lg-none">
          <Link href="/cart" className="text-white me-3 d-flex align-items-center">
            <FontAwesomeIcon icon={faShoppingCart} className="me-1" /> 
          </Link>
          <Link href={isAuthenticated() ? "/account" : "/account/login"} className="text-white d-flex align-items-center">
            <FontAwesomeIcon icon={faUser} className="me-1" /> 
          </Link>
        </div>

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto text-start">
            <NavDropdown title="Catégories" id="categories-dropdown" className="text-white fw-semibold">
              <NavDropdown.Item as={Link} href="/categories" className='border-bottom'>Toutes les catégories</NavDropdown.Item>
              {categories.map((cat) => (
                <NavDropdown.Item key={cat.id} as={Link} href={`/categories/${cat.id}`}>
                  {cat.name}
                </NavDropdown.Item>
              ))}
            </NavDropdown>
            <Nav.Link as={Link} href="/products" className="text-white fw-semibold">
              Produits
            </Nav.Link>
            {isClient && isAuthenticated() && userRole === 'admin' && (
              <Nav.Link as={Link} href="/admin/dashboard" className="text-warning fw-bold d-lg-none">
                Admin
              </Nav.Link>
            )}
          </Nav>

          <Nav className="d-none d-lg-flex align-items-center">
            {isClient && (
              <>
                <Nav.Link as={Link} href="/cart" className="text-white fw-semibold d-flex align-items-center">
                  <FontAwesomeIcon icon={faShoppingCart} className="me-1" /> Panier
                </Nav.Link>

                {isAuthenticated() ? (
                  <>
                    <Nav.Link as={Link} href="/account" className="text-white fw-semibold d-flex align-items-center">
                      <FontAwesomeIcon icon={faUser} className="me-1" /> Mon Compte
                    </Nav.Link>

                    {userRole === 'admin' && (
                      <Nav.Link as={Link} href="/admin/dashboard" className="text-warning fw-bold">
                        Admin
                      </Nav.Link>
                    )}

                    <Nav.Link onClick={handleLogout} className="text-danger fw-bold d-flex align-items-center" style={{ cursor: 'pointer' }}>
                      <FontAwesomeIcon icon={faSignOutAlt} className="me-1" /> Déconnexion
                    </Nav.Link>
                  </>
                ) : (
                  <Nav.Link as={Link} href="/account/login" className="text-white fw-semibold d-flex align-items-center">
                    <FontAwesomeIcon icon={faUser} className="me-1" /> Connexion
                  </Nav.Link>
                )}
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}