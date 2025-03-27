import Link from 'next/link';
import { Container, Row, Col } from 'react-bootstrap';

export default function LegalFooter() {
  return (
    <footer className="bg-dark text-white">
      <Container className="py-4">
        <Row>
          <Col md={4} className="mb-4">
            <h5>Légal</h5>
            <ul className="list-unstyled">
              <li><Link href="/legal/mentions-legales" className="text-white text-decoration-none">Mentions légales</Link></li>
              <li><Link href="/legal/cgv" className="text-white text-decoration-none">Conditions générales de vente</Link></li>
              <li><Link href="/legal/confidentialite" className="text-white text-decoration-none">Politique de confidentialité</Link></li>
            </ul>
          </Col>

          <Col md={4} className="mb-4">
            <h5>Service client</h5>
            <ul className="list-unstyled">
              <li><Link href="service-client/contact" className="text-white text-decoration-none">Contact</Link></li>
              <li><Link href="service-client/faq" className="text-white text-decoration-none">FAQ</Link></li>
              <li><Link href="service-client/retours" className="text-white text-decoration-none">Retours et échanges</Link></li>
            </ul>
          </Col>

          <Col md={4} className="mb-4">
            <h5>Entreprise</h5>
            <div className="">
                <p className="mb-1">FitGear SAS</p>
                <p className="mb-1">123 Rue du Commerce</p>
                <p className="mb-1">75000 Paris</p>
                <p className="mb-1">contact@fitgear.fr</p>
                <p className="mb-0">01 23 45 67 89</p>
            </div>
          </Col>
        </Row>

        <Row className="mt-4 border-top pt-3">
          <Col className="text-center text-md-start">
            <p className="mb-0">
              © {new Date().getFullYear()} FitGear - Tous droits réservés
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}