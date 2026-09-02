'use client';

import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useCart } from '../../context/CartContext';
import { useSiteConfig } from '../../context/SiteConfigContext';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import {
    CustomerDetails,
    generateOrderId,
    isCheckoutConfigured,
    submitOrder,
} from '@/lib/orders';

/** Where the checkout flow currently is. */
type CheckoutStage = 'cart' | 'details' | 'submitting' | 'done';

const EMPTY_DETAILS: CustomerDetails = { name: '', email: '', studentNumber: '', notes: '' };

export default function Cart() {
    const { items, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
    const { contactEmail } = useSiteConfig();

    const [stage, setStage] = useState<CheckoutStage>('cart');
    const [details, setDetails] = useState<CustomerDetails>(EMPTY_DETAILS);
    const [orderId, setOrderId] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setStage('submitting');

        const id = generateOrderId();
        try {
            await submitOrder({
                orderId: id,
                placedAt: new Date().toISOString(),
                customer: details,
                items,
                total: totalPrice,
            });
            setOrderId(id);
            clearCart();
            setStage('done');
        } catch (err) {
            console.error('Order submission failed', err);
            setError(`We couldn't submit your order. Please email ${contactEmail} and we'll sort it out.`);
            setStage('details');
        }
    };

    return (
        <main className="min-h-screen bg-background text-white flex flex-col">
            <Navbar />

            <div className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 pt-28 lg:pt-32 pb-20">
                <h1 className="text-3xl sm:text-4xl font-bold mb-8 sm:mb-10">
                    {stage === 'done' ? 'Order Confirmed' : 'Your Cart'}
                </h1>

                {stage === 'done' ? (
                    <OrderConfirmation orderId={orderId} contactEmail={contactEmail} />
                ) : items.length === 0 ? (
                    <div className="text-center py-16 sm:py-20 bg-white/5 rounded-2xl px-6">
                        <h2 className="text-xl sm:text-2xl font-bold mb-4">Your cart is empty</h2>
                        <Link href="/store" className="text-primary hover:underline text-lg">
                            Go to Store
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        <div className="bg-white/5 rounded-2xl p-4 sm:p-6">
                            {items.map((item, index) => (
                                <div
                                    key={`${item.id}-${item.size}-${index}`}
                                    className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 border-b border-white/10 py-5 last:border-0"
                                >
                                    <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto">
                                        <div className="w-16 h-16 sm:w-24 sm:h-24 bg-[#3B71CA] rounded-lg flex-shrink-0" />
                                        <div className="min-w-0">
                                            <h3 className="font-bold text-lg sm:text-xl break-words">{item.name}</h3>
                                            {item.size && <p className="text-gray-400 text-sm">Size: {item.size}</p>}
                                            <p className="text-gray-300 font-mono text-sm">${item.price} each</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 w-full sm:w-auto">
                                        <div className="flex items-center gap-3 bg-background rounded-lg px-3 py-2 border border-white/20">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                                                aria-label={`Decrease quantity of ${item.name}`}
                                                className="text-gray-400 hover:text-white text-xl font-bold transition w-5"
                                            >
                                                -
                                            </button>
                                            <span className="w-6 text-center font-mono">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                                                aria-label={`Increase quantity of ${item.name}`}
                                                className="text-gray-400 hover:text-white text-xl font-bold transition w-5"
                                            >
                                                +
                                            </button>
                                        </div>

                                        <p className="font-mono text-lg sm:text-xl sm:w-20 text-right">
                                            ${item.price * item.quantity}
                                        </p>

                                        <button
                                            onClick={() => removeFromCart(item.id, item.size)}
                                            className="text-red-400 hover:text-red-300 text-sm hover:underline"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white/5 rounded-2xl p-5 sm:p-8">
                            <div className="text-xl sm:text-2xl font-bold mb-6 text-right">
                                Total: <span className="font-mono">${totalPrice}</span>
                            </div>

                            {stage === 'cart' ? (
                                <div className="flex justify-end">
                                    <button
                                        onClick={() => setStage('details')}
                                        className="w-full sm:w-auto bg-[#C92C2C] hover:bg-red-700 text-white font-bold py-3.5 px-12 rounded-full shadow-lg transition transform hover:scale-105"
                                    >
                                        Checkout
                                    </button>
                                </div>
                            ) : (
                                <CheckoutForm
                                    details={details}
                                    setDetails={setDetails}
                                    onSubmit={handlePlaceOrder}
                                    submitting={stage === 'submitting'}
                                    error={error}
                                    contactEmail={contactEmail}
                                />
                            )}
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}

/**
 * Collects the buyer's details and places the order. Payment is handled in
 * person - the club confirms and collects on the door - so this form records
 * the order rather than taking card details.
 */
function CheckoutForm({
    details,
    setDetails,
    onSubmit,
    submitting,
    error,
    contactEmail,
}: {
    details: CustomerDetails;
    setDetails: (d: CustomerDetails) => void;
    onSubmit: (e: React.FormEvent) => void;
    submitting: boolean;
    error: string | null;
    contactEmail: string;
}) {
    // Without the Apps Script URL there is nowhere to send the order, so fall
    // back to a plain mailto rather than pretending checkout works.
    if (!isCheckoutConfigured()) {
        return (
            <div className="border-t border-white/10 pt-6 text-center">
                <p className="text-white/70 mb-4">
                    Online ordering isn&apos;t set up yet. Email us your order and we&apos;ll confirm it.
                </p>
                <a href={`mailto:${contactEmail}?subject=Merch%20Order`}>
                    <button className="bg-[#C92C2C] hover:bg-red-700 text-white font-bold py-3 px-10 rounded-full shadow-lg transition">
                        Email Your Order
                    </button>
                </a>
            </div>
        );
    }

    const update = (field: keyof CustomerDetails) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => setDetails({ ...details, [field]: e.target.value });

    return (
        <form onSubmit={onSubmit} className="border-t border-white/10 pt-6 flex flex-col gap-4">
            <p className="text-white/70 text-sm">
                Payment is collected in person at your next class. We&apos;ll email you to confirm.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Full name" required value={details.name} onChange={update('name')} />
                <Field label="Email" type="email" required value={details.email} onChange={update('email')} />
                <Field label="Student number" value={details.studentNumber} onChange={update('studentNumber')} />
                <Field label="Notes (optional)" value={details.notes} onChange={update('notes')} />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto bg-[#C92C2C] hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 px-12 rounded-full shadow-lg transition"
                >
                    {submitting ? 'Placing order…' : 'Place Order'}
                </button>
            </div>
        </form>
    );
}

/** A labelled text input used by the checkout form. */
function Field({
    label,
    value,
    onChange,
    type = 'text',
    required,
}: {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    required?: boolean;
}) {
    return (
        <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-bold text-white/80">
                {label}
                {required && <span className="text-primary"> *</span>}
            </span>
            <input
                type={type}
                value={value}
                onChange={onChange}
                required={required}
                className="bg-black/30 px-3 py-2.5 rounded border border-white/20 text-white focus:border-white/50 focus:outline-none transition"
            />
        </label>
    );
}

/** Shown once the order has been recorded, with the reference to quote. */
function OrderConfirmation({ orderId, contactEmail }: { orderId: string; contactEmail: string }) {
    return (
        <div className="bg-white/5 rounded-2xl p-8 sm:p-12 text-center">
            <CheckCircle2 size={56} className="mx-auto text-green-400 mb-5" />
            <h2 className="text-2xl font-bold mb-3">Thanks - we&apos;ve got your order.</h2>
            <p className="text-white/70 mb-2">
                Your reference is <span className="font-mono font-bold text-white">{orderId}</span>.
            </p>
            <p className="text-white/70 mb-8">
                We&apos;ll email you at the address you gave to confirm pickup and payment. Questions?{' '}
                <a href={`mailto:${contactEmail}`} className="text-primary hover:underline">
                    {contactEmail}
                </a>
            </p>
            <Link href="/store">
                <button className="bg-[#C92C2C] hover:bg-red-700 text-white font-bold py-3 px-10 rounded-full shadow-lg transition transform hover:scale-105">
                    Back to Store
                </button>
            </Link>
        </div>
    );
}
