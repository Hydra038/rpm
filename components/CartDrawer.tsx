import { useCartStore } from '../store/cart';

export function CartDrawer() {
  const { items, removeFromCart, clearCart } = useCartStore();
  return (
    <div className="fixed right-0 top-0 w-80 h-full bg-white shadow-lg p-4 z-50">
      <h3 className="text-xl font-bold mb-4">Cart</h3>
      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.id} className="flex justify-between items-center mb-2">
              <span>{item.name}</span>
              <span>Qty: {item.quantity}</span>
              <button onClick={() => removeFromCart(item.id)} className="ml-2 text-red-500">Remove</button>
            </li>
          ))}
        </ul>
      )}
      <button onClick={clearCart} className="mt-4 bg-gray-200 px-4 py-2 rounded">Clear Cart</button>
    </div>
  );
}
