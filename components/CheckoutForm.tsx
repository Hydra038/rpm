type CheckoutFormProps = {
  onSubmit: (data: any) => void;
};

export function CheckoutForm({ onSubmit }: CheckoutFormProps) {
  // TODO: Implement form state and handlers
  return (
    <form className="space-y-4" onSubmit={e => { e.preventDefault(); onSubmit({}); }}>
      <input className="w-full border p-2" placeholder="Shipping Address" />
      <input className="w-full border p-2" placeholder="Payment Method" />
      <button className="bg-blue-600 text-white px-4 py-2 rounded">Place Order</button>
    </form>
  );
}
