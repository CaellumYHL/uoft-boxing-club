'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

/** localStorage key holding the cart between visits. */
const STORAGE_KEY = 'uoft-boxing-cart';

export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    size?: string;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (item: CartItem) => void;
    updateQuantity: (itemId: string, size: string | undefined, newQuantity: number) => void;
    removeFromCart: (itemId: string, size?: string) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [hydrated, setHydrated] = useState(false);

    // Restore the cart on first load so a page navigation or refresh mid-order
    // doesn't lose it. Wrapped in try/catch because storage can throw in
    // private windows and when site data is blocked.
    useEffect(() => {
        try {
            const saved = window.localStorage.getItem(STORAGE_KEY);
            // One-time hydration from localStorage after mount.
            // eslint-disable-next-line react-hooks/set-state-in-effect
            if (saved) setItems(JSON.parse(saved));
        } catch {
            // Ignore - an unreadable cart is simply an empty one.
        }
        setHydrated(true);
    }, []);

    // Persist on change, but not before hydration or we'd overwrite the saved
    // cart with the initial empty array.
    useEffect(() => {
        if (!hydrated) return;
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        } catch {
            // Ignore - persistence is a convenience, not a requirement.
        }
    }, [items, hydrated]);

    const addToCart = (newItem: CartItem) => {
        setItems((prevItems) => {
            const existingItemIndex = prevItems.findIndex(
                (item) => item.id === newItem.id && item.size === newItem.size
            );

            if (existingItemIndex > -1) {
                // Copy the matched item rather than mutating it in place, so the
                // previous state object is never modified.
                const newItems = [...prevItems];
                newItems[existingItemIndex] = {
                    ...newItems[existingItemIndex],
                    quantity: newItems[existingItemIndex].quantity + newItem.quantity,
                };
                return newItems;
            }
            return [...prevItems, newItem];
        });
    };

    const updateQuantity = (itemId: string, size: string | undefined, newQuantity: number) => {
        if (newQuantity < 1) {
            removeFromCart(itemId, size);
            return;
        }
        setItems((prevItems) =>
            prevItems.map((item) =>
                (item.id === itemId && item.size === size)
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
    };

    const removeFromCart = (itemId: string, size?: string) => {
        setItems((prevItems) =>
            prevItems.filter((item) => !(item.id === itemId && item.size === size))
        );
    };

    const clearCart = () => setItems([]);

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{ items, addToCart, updateQuantity, removeFromCart, clearCart, totalItems, totalPrice }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
