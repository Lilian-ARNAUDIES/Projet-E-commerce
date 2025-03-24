import { useEffect, useState } from 'react';
import { axiosAuthInstance } from '../../utils/auth';
import AdminLayout from '../../layouts/AdminLayout';
import { Table, Pagination, Button, Modal, Form } from 'react-bootstrap';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({ firstname: '', lastname: '', email: '', role: 'client' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axiosAuthInstance.get('/api/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error("❌ Erreur récupération utilisateurs :", error);
    }
  };

  const handleSave = async () => {
    try {
      if (editingUser) {
        await axiosAuthInstance.put(`/api/admin/users/${editingUser.id}/role`, { role: newUser.role });
      } else {
        await axiosAuthInstance.post('/api/admin/users', newUser);
      }
      fetchUsers();
      setShowModal(false);
    } catch (error) {
      console.error("❌ Erreur lors de l'ajout/modification :", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
      try {
        await axiosAuthInstance.delete(`/api/admin/users/${id}`);
        fetchUsers();
      } catch (error) {
        console.error("❌ Erreur suppression :", error);
      }
    }
  };

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <AdminLayout>
      <h1>Gestion des utilisateurs</h1>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Email</th>
            <th>Rôle</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.lastname}</td>
              <td>{user.firstname}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <Button variant="warning" size="sm" 
                  onClick={() => {
                    setEditingUser(user);
                    setNewUser({
                      firstname: user.firstname,
                      lastname: user.lastname,
                      email: user.email,
                      role: user.role
                    });
                    setShowModal(true);
                  }}>Modifier</Button>
                <Button variant="danger" size="sm" className="ms-2" onClick={() => handleDelete(user.id)}>Supprimer</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination>
        {[...Array(Math.ceil(users.length / usersPerPage)).keys()].map(number => (
          <Pagination.Item key={number + 1} active={number + 1 === currentPage} onClick={() => setCurrentPage(number + 1)}>
            {number + 1}
          </Pagination.Item>
        ))}
      </Pagination>

      {/* Modal Ajout/Modification */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingUser ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Nom</Form.Label>
              <Form.Control
                type="text"
                value={newUser.lastname}
                onChange={(e) => setNewUser({ ...newUser, lastname: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Prénom</Form.Label>
              <Form.Control
                type="text"
                value={newUser.firstname}
                onChange={(e) => setNewUser({ ...newUser, firstname: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Rôle</Form.Label>
              <Form.Select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
                <option value="client">Client</option>
                <option value="admin">Admin</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Annuler</Button>
          <Button variant="primary" onClick={handleSave}>Sauvegarder</Button>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  );
}