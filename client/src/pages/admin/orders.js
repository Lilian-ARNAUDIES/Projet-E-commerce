import { useEffect, useState } from 'react';
import { axiosAuthInstance } from '../../utils/auth';
import AdminLayout from '../../layouts/AdminLayout';
import { Table, Pagination, Form, Button, Modal } from 'react-bootstrap';
import { Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axiosAuthInstance.get('/api/admin/orders', {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate', // Désactive le cache
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      const sorted = response.data.sort((a, b) => b.id - a.id); // du plus récent au plus ancien
      setOrders(response.data);
    } catch (error) {
      console.error("❌ Erreur récupération commandes :", error);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId); // Indique qu'une commande est en cours de mise à jour
    try {
      await axiosAuthInstance.put(`/api/admin/orders/${orderId}/status`, { status: newStatus });
      fetchOrders(); // Recharge les commandes pour mettre à jour l'affichage
    } catch (error) {
      console.error("❌ Erreur lors de la mise à jour du statut :", error);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleShowOrderDetails = async (orderId) => {
    try {
      const response = await axiosAuthInstance.get(`/api/admin/orders/${orderId}/items`);

      setSelectedOrder(response.data);
      setShowModal(true);
    } catch (error) {
      console.error("❌ Erreur récupération des détails de la commande :", error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  return (
    <AdminLayout>
      <h1>Gestion des commandes</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Prénom</th>
            <th>Nom</th>
            <th>Montant</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentOrders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.firstname}</td>
              <td>{order.lastname}</td>
              <td>{order.total_price} €</td>
              <td>
                <Form.Select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  disabled={updatingOrderId === order.id}
                >
                  <option value="pending">En attente</option>
                  <option value="processing">En cours de traitement</option>
                  <option value="shipped">Expédiée</option>
                  <option value="delivered">Livrée</option>
                  <option value="cancelled">Annulée</option>
                </Form.Select>
              </td>
              <td>
              <Button variant="outline-primary" size="sm" onClick={() => handleShowOrderDetails(order.id)}>
                <FontAwesomeIcon icon={faEye} />
              </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Pagination */}
      <Pagination>
        {[...Array(Math.ceil(orders.length / ordersPerPage)).keys()].map(number => (
          <Pagination.Item key={number + 1} active={number + 1 === currentPage} onClick={() => setCurrentPage(number + 1)}>
            {number + 1}
          </Pagination.Item>
        ))}
      </Pagination>
      
      {/* Modal pour afficher les détails de la commande */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Détails de la commande</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder ? (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Produit</th>
                  <th>Quantité</th>
                  <th>Prix Unitaire</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.map(item => (
                  <tr key={item.product_id}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>{item.price} €</td>
                    <td>{(item.quantity * item.price).toFixed(2)} €</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>Chargement des produits...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  );
}