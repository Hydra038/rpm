export default function CheckoutPage() {
  return (
    <main className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>
      {/* CheckoutForm goes here */}
      <form className="space-y-4">
        <input className="w-full border p-2" placeholder="Shipping Address" />
        <input className="w-full border p-2" placeholder="Payment Method" />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Place Order</button>
      </form>
    </main>
  );
}
