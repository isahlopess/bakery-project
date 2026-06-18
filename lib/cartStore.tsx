"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export interface CartItem {
    id: number;
    nome: string;
    preco: number;
    precoFormatado: string;
    imagem: string;
    quantidade: number;
}

interface CartContextType {
    items: CartItem[];
    addItem: (item: Omit<CartItem, "quantidade">) => void;
    removeItem: (id: number) => void;
    updateQuantity: (id: number, quantidade: number) => void;
    clearCart: () => void;
    getTotal: () => number;
    getTotalFormatado: () => string;
    getItemCount: () => number;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    const addItem = useCallback((newItem: Omit<CartItem, "quantidade">) => {
        setItems((prev) => {
            const existing = prev.find((item) => item.id === newItem.id);
            if (existing) {
                return prev.map((item) =>
                    item.id === newItem.id
                        ? { ...item, quantidade: item.quantidade + 1 }
                        : item
                );
            }
            return [...prev, { ...newItem, quantidade: 1 }];
        });
    }, []);

    const removeItem = useCallback((id: number) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    }, []);

    const updateQuantity = useCallback((id: number, quantidade: number) => {
        if (quantidade <= 0) {
            setItems((prev) => prev.filter((item) => item.id !== id));
            return;
        }
        setItems((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, quantidade } : item
            )
        );
    }, []);

    const clearCart = useCallback(() => {
        setItems([]);
    }, []);

    const getTotal = useCallback(() => {
        return items.reduce((sum, item) => sum + item.preco * item.quantidade, 0);
    }, [items]);

    const getTotalFormatado = useCallback(() => {
        return `R$ ${getTotal().toFixed(2).replace(".", ",")}`;
    }, [getTotal]);

    const getItemCount = useCallback(() => {
        return items.reduce((sum, item) => sum + item.quantidade, 0);
    }, [items]);

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                getTotal,
                getTotalFormatado,
                getItemCount,
                isOpen,
                setIsOpen,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart deve ser usado dentro de um CartProvider");
    }
    return context;
}
