import PaymentPageClient from "./PaymentPageClient";

export default function PaymentPage({ params }: { params: { orderId: string } }) {
  return <PaymentPageClient orderId={params.orderId} />;
}
