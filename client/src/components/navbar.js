import Link from 'next/link';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { getUserRole, isAuthenticated, logout } from '../utils/auth';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDumbbell, faUser, faShoppingCart, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

export default function AppNavbar() {
  const [userRole, setUserRole] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    setUserRole(getUserRole());
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/account/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow-lg">
      <Container>
        <Navbar.Brand as={Link} href="/" className="fw-bold text-white d-flex align-items-center">
          <FontAwesomeIcon icon={faDumbbell} className="me-2" /> E-Commerce
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} href="/products" className="text-white fw-semibold">
              Produits
            </Nav.Link>
          </Nav>

          <Nav className="d-flex align-items-center">
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