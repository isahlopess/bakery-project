import CheckoutForm from "@/components/checkout/CheckoutForm";

export const metadata = {
    title: "Finalizar Pedido - Bakery Project",
};

export default function CheckoutPage() {
    return (
        <main className="min-h-screen bg-[var(--color-creme)] pt-24 px-4 sm:px-6 lg:px-8">
            <CheckoutForm />
        </main>
    );
}
