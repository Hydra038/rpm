import { useCartStore } from '../../store/cart';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, clearCart } = useCartStore();
  return (
    <main className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
      {/* Cart item list, quantity update, coupon, checkout button */}
      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.id} className="mb-2 flex justify-between items-center">
              <span>{item.name}</span>
              <span>Qty: {item.quantity}</span>
              <button onClick={() => removeFromCart(item.id)} className="ml-2 text-red-500">Remove</button>
            </li>
          ))}
        </ul>
      )}
      <button onClick={clearCart} className="mt-4 bg-gray-200 px-4 py-2 rounded">Clear Cart</button>
    </main>
  );
}
