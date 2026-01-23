'use client';

import Navbar from '../../components/Navbar';
import { useCart } from '../../context/CartContext';
import Link from 'next/link';

export default function Cart() {
    const { items, removeFromCart, updateQuantity, totalPrice } = useCart();

    const handleCheckout = () => {
        alert("Checkout process would start here! (Stripe/Paypal)");
    };

    return (
        <main className="min-h-screen bg-background text-white pb-20">
            <Navbar />

            <div className="max-w-4xl mx-auto px-6 mt-10">
                <h1 className="text-4xl font-bold mb-10">Your Cart</h1>

                {items.length === 0 ? (
                    <div className="text-center py-20 bg-white/5 rounded-2xl">
                        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                        <Link href="/store" className="text-primary hover:underline text-lg">
                            Go to Store
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {/* Items List */}
                        <div className="bg-white/5 rounded-2xl p-6">
                            {items.map((item, index) => (
                                <div key={`${item.id}-${item.size}-${index}`} className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-white/10 py-6 last:border-0 capitalize">

                                    <div className="flex items-center gap-6">
                                        <div className="w-24 h-24 bg-[#3B71CA] rounded-lg flex items-center justify-center">
                                            <div className="w-16 h-16 bg-[#3B71CA] rounded"></div>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-xl">{item.name}</h3>
                                            {item.size && <p className="text-gray-400">Size: {item.size}</p>}
                                            <p className="text-gray-300 font-mono">${item.price} each</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        {/* Quantity Controls */}
                                        <div className="flex items-center gap-3 bg-background rounded-lg px-4 py-2 border border-white/20">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                                                className="text-gray-400 hover:text-white text-xl font-bold transition"
                                            >
                                                -
                                            </button>
                                            <span className="w-6 text-center font-mono">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                                                className="text-gray-400 hover:text-white text-xl font-bold transition"
                                            >
                                                +
                                            </button>
                                        </div>

                                        <p className="font-mono text-xl w-20 text-right">${item.price * item.quantity}</p>

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

                        {/* Summary */}
                        <div className="bg-white/5 rounded-2xl p-8 flex flex-col items-end">
                            <div className="text-2xl font-bold mb-8">
                                Total: <span className="font-mono">${totalPrice}</span>
                            </div>

                            <button
                                onClick={handleCheckout}
                                className="bg-[#C92C2C] hover:bg-red-700 text-white font-bold py-4 px-12 rounded-full shadow-lg transition transform hover:scale-105"
                            >
                                Checkout
                            </button>
                        </div>

                    </div>
                )}
            </div>
        </main>
    );
}