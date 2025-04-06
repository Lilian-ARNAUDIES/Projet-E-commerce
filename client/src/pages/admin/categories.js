import { useEffect, useState } from 'react';
import { axiosAuthInstance } from '../../utils/auth';
import AdminLayout from '../../layouts/AdminLayout';
import { Table, Pagination, Form, Button, Modal } from 'react-bootstrap';
import { Dropdown } from 'react-bootstrap';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const categoriesPerPage = 5;

  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({ name: '' });

  const fetchCategories = async () => {
    try {
      const res = await axiosAuthInstance.get('/api/admin/categories');
      setCategories(res.data);
    } catch (error) {
      console.error("❌ Erreur récupération catégories :", error);
    }
  };

  const handleSave = async () => {
    try {
      if (editingCategory) {
        await axiosAuthInstance.put(`/api/admin/categories/${editingCategory.id}`, newCategory);
      } else {
      await axiosAuthInstance.post('/api/admin/categories', newCategory);
      }
      fetchCategories();
      setShowModal(false);
    } catch (error) {
      console.error("❌ Erreur sauvegarde catégorie :", error.response?.data || error.message);
      alert("Une erreur est survenue lors de la sauvegarde de la catégorie.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Supprimer cette catégorie ?")) {
      try {
        await axiosAuthInstance.delete(`/api/admin/categories/${id}`);
        fetchCategories();
      } catch (error) {
        console.error("❌ Erreur suppression :", error);
      }
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const indexOfLast = currentPage * categoriesPerPage;
  const indexOfFirst = indexOfLast - categoriesPerPage;
  const currentCategories = categories.slice(indexOfFirst, indexOfLast);

  return (
    <AdminLayout>
      <h1>Gestion des catégories</h1>
      <Button className="mb-3" onClick={() => {
        setEditingCategory(null);
        setNewCategory({ name: '' });
        setShowModal(true);
      }}>Ajouter une catégorie</Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentCategories.map(cat => (
            <tr key={cat.id}>
              <td>{cat.id}</td>
              <td>{cat.name}</td>
              <td>
                <Dropdown>
                  <Dropdown.Toggle variant="secondary" size="sm">Actions</Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => {
                      setEditingCategory(cat);
                      setNewCategory({ name: cat.name });
                      setShowModal(true);
                    }}>Modifier</Dropdown.Item>
                    <Dropdown.Item className="text-danger" onClick={() => handleDelete(cat.id)}>Supprimer</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination>
        {[...Array(Math.ceil(categories.length / categoriesPerPage)).keys()].map(number => (
          <Pagination.Item key={number + 1} active={number + 1 === currentPage} onClick={() => setCurrentPage(number + 1)}>
            {number + 1}
          </Pagination.Item>
        ))}
      </Pagination>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingCategory ? "Modifier" : "Ajouter"} une catégorie</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Nom</Form.Label>
              <Form.Control
                type="text"
                value={newCategory.name}
                onChange={e => setNewCategory({ ...newCategory, name: e.target.value })}
              />
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