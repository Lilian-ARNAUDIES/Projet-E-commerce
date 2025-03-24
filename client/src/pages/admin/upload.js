import { useState } from 'react';

export default function UploadImage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [productId, setProductId] = useState('');
  const [altText, setAltText] = useState('');
  const [message, setMessage] = useState('');

  // Gérer la sélection d'un fichier et la prévisualisation
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    if (selectedFile) {
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !productId) {
      setMessage('Veuillez sélectionner une image et renseigner l\'ID du produit.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('productId', productId);
    formData.append('alt', altText);

    try {
      // Adaptez l'URL de l'API en fonction de votre environnement.
      // Ici, pour la communication entre conteneurs, on peut utiliser l'URL interne si nécessaire.
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/images`, {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (data.success) {
        setMessage('Image uploadée avec succès !');
      } else {
        setMessage(`Erreur: ${data.message}`);
      }
    } catch (error) {
      console.error(error);
      setMessage('Erreur lors de l\'upload.');
    }
  };

  return (
    <div>
      <h1>Upload d'une image produit</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <label htmlFor="productId">ID du produit :</label>
          <input
            type="text"
            id="productId"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="alt">Texte alternatif :</label>
          <input
            type="text"
            id="alt"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="image">Sélectionnez une image :</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
        </div>
        {preview && (
          <div>
            <h3>Prévisualisation</h3>
            <img src={preview} alt="Prévisualisation" style={{ maxWidth: '200px' }} />
          </div>
        )}
        <button type="submit">Uploader</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}