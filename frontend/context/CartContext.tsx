'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

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
    totalItems: number;
    totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    const addToCart = (newItem: CartItem) => {
        setItems((prevItems) => {
            const existingItemIndex = prevItems.findIndex(
                (item) => item.id === newItem.id && item.size === newItem.size
            );

            if (existingItemIndex > -1) {
                const newItems = [...prevItems];
                newItems[existingItemIndex].quantity += newItem.quantity;
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

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{ items, addToCart, updateQuantity, removeFromCart, totalItems, totalPrice }}>
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
