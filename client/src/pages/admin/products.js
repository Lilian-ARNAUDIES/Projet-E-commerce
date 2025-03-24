import { useEffect, useState, useRef } from 'react';
import { axiosAuthInstance } from '../../utils/auth';
import AdminLayout from '../../layouts/AdminLayout';
import { Table, Pagination, Form, Button, Modal } from 'react-bootstrap';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({name: '', price: '', stock: '', description: '', image: '', category_id: ''});  
  const imageFileRef = useRef();

  const handleSave = async () => {
    let imagePath = newProduct.image;
    if (imageFileRef.current?.files[0]) {
      const formData = new FormData();
      formData.append('image', imageFileRef.current.files[0]);
      const uploadRes = await axiosAuthInstance.post('/api/admin/images', formData);
      imagePath = `https://localhost:8000/uploads/${uploadRes.data?.data?.filename}`;
    }

    if (editingProduct) {
      await axiosAuthInstance.put(`/api/admin/products/${editingProduct.id}`, {
        ...newProduct,
        image: imagePath
      });
    } else {
      await axiosAuthInstance.post('/api/admin/products', {
        ...newProduct,
        image: imagePath
      });
    }

    const refreshed = await axiosAuthInstance.get('/api/admin/products');
    setProducts(refreshed.data.sort((a, b) => b.id - a.id));
    setShowModal(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce produit ?")) {
      await axiosAuthInstance.delete(`/api/admin/products/${id}`);
      const refreshed = await axiosAuthInstance.get('/api/admin/products');
      setProducts(refreshed.data.sort((a, b) => b.id - a.id));
    }
  };

  useEffect(() => {
    axiosAuthInstance.get('/api/admin/products')
      .then(response => {
        const sorted = response.data.sort((a, b) => b.id - a.id);
        setProducts(sorted);
      })
      .catch(error => {
        console.error("❌ Erreur récupération produits :", error);
      });
    axiosAuthInstance.get('/api/admin/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error("❌ Erreur récupération catégories :", err));
  }, []);

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  return (
    <AdminLayout>
      <h1>Gestion des produits</h1>
      <Button className="mb-3" onClick={() => {
        setEditingProduct(null);
        setNewProduct({ name: '', price: '', stock: '', description: '', image: '', category_id: '' });
        setShowModal(true);
      }}>Ajouter un produit</Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Prix</th>
            <th>Stock</th>
            <th>Catégorie</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.map(product => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.price} €</td>
              <td>{product.stock}</td>
              <td>{categories.find(c => c.id === product.category_id)?.name || '—'}</td>
              <td><img src={product.image} alt={product.name} style={{ width: '50px', height: '50px' }} /></td>
              <td>
                <Button variant="warning" size="sm" onClick={() => {
                  setEditingProduct(product);
                  setNewProduct({
                    name: product.name,
                    price: product.price,
                    stock: product.stock,
                    description: product.description,
                    category_id: product.category_id || '',
                    image: product.image
                  });
                  setShowModal(true);
                }}>Modifier</Button>
                <Button variant="danger" size="sm" className="ms-2" onClick={() => handleDelete(product.id)}>Supprimer</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Pagination */}
      <Pagination>
        {[...Array(Math.ceil(products.length / productsPerPage)).keys()].map(number => (
          <Pagination.Item key={number + 1} active={number + 1 === currentPage} onClick={() => setCurrentPage(number + 1)}>
            {number + 1}
          </Pagination.Item>
        ))}
      </Pagination>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingProduct ? "Modifier un produit" : "Ajouter un produit"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Nom</Form.Label>
              <Form.Control type="text" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Prix</Form.Label>
              <Form.Control type="number" step="0.01" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Stock</Form.Label>
              <Form.Control type="number" value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={5} value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Catégorie</Form.Label>
              <Form.Select
                value={newProduct.category_id}
                onChange={e => setNewProduct({ ...newProduct, category_id: e.target.value })}
              >
                <option value="">-- Aucune --</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Image</Form.Label>
              <Form.Control type="file" ref={imageFileRef} accept="image/*" />
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