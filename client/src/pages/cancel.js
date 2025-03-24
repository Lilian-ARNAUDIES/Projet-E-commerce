export default function Cancel() {
  return (
    <div className="container text-center py-5">
      <h1 className="mb-4">Paiement annulé</h1>
      <p className="mb-4">
        Votre paiement a été annulé. Vous pouvez continuer vos achats en retournant à la boutique.
      </p>
      <a href="/" className="btn btn-primary">
        Retour à la boutique
      </a>
    </div>
  );
}