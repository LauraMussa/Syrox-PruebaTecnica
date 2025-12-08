
const Card = () => {
  return (
    <div className="bg-card text-card-foreground border border-border p-4 rounded-lg">
      <h1 className="text-foreground">Título</h1>
      <p className="text-muted-foreground">Subtítulo gris</p>
      <span className="bg-badge-green text-badge-green-text px-2 py-1 rounded">Activo</span>
         <span className="bg-badge-blue text-badge-blue-text px-2 py-1 rounded">Activo</span>
    </div>
  );
};

export default Card;
