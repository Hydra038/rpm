import { CheckoutForm } from '../../../components/CheckoutForm';

export default function ShopCheckoutPage() {
  function handleSubmit(data: any) {
    // TODO: Call order creation logic
    alert('Order placed!');
  }
  return (
    <main className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>
      <CheckoutForm onSubmit={handleSubmit} />
    </main>
  );
}
