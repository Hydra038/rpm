type ProductCardProps = {
  name: string;
  price: number;
  image_url?: string;
  onAddToCart?: () => void;
};

export function ProductCard({ name, price, image_url, onAddToCart }: ProductCardProps) {
  return (
    <div className="border rounded-lg p-4 flex flex-col items-center bg-white shadow">
      {image_url && <img src={image_url} alt={name} className="h-32 object-contain mb-2" />}
      <h3 className="font-semibold text-lg mb-1">{name}</h3>
      <div className="text-blue-700 font-bold mb-2">${price.toFixed(2)}</div>
      {onAddToCart && (
        <button onClick={onAddToCart} className="bg-blue-600 text-white px-3 py-1 rounded">Add to Cart</button>
      )}
    </div>
  );
}
