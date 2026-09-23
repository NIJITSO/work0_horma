'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, ProductVariant } from '../types';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, selectedVariant?: ProductVariant) => void;
  removeItem: (productId: string, variantId?: number) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotalMAD: number;
  freeShippingThresholdMAD: number;
  freeShippingProgress: number;
  isFreeShipping: boolean;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  isCheckoutOpen: boolean;
  openCheckout: () => void;
  closeCheckout: () => void;
  quickViewProduct: Product | null;
  quickViewInitialVariantId: number | null;
  openQuickView: (product: Product, variantId?: number) => void;
  closeQuickView: () => void;
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [quickViewInitialVariantId, setQuickViewInitialVariantId] = useState<number | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Load cart from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('alhurra_cart') || localStorage.getItem('zayna_cart');
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load cart from storage', e);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('alhurra_cart', JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to storage', e);
    }
  }, [items]);

  const addItem = (product: Product, quantity: number = 1, selectedVariant?: ProductVariant) => {
    const activeVariant = selectedVariant || product.variants?.[0];
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          (activeVariant ? item.selectedVariant?.id === activeVariant.id : !item.selectedVariant)
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }

      return [...prev, { product, quantity, selectedVariant: activeVariant }];
    });
    setIsCartOpen(true);
  };

  const removeItem = (productId: string, variantId?: number) => {
    setItems((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product.id === productId &&
            (variantId ? item.selectedVariant?.id === variantId : true)
          )
      )
    );
  };

  const updateQuantity = (productId: string, quantity: number, variantId?: number) => {
    if (quantity <= 0) {
      removeItem(productId, variantId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        const matches =
          item.product.id === productId &&
          (variantId ? item.selectedVariant?.id === variantId : true);
        return matches ? { ...item, quantity } : item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotalMAD = items.reduce((acc, item) => {
    const unitPrice = item.selectedVariant ? item.selectedVariant.price : item.product.priceMAD;
    return acc + unitPrice * item.quantity;
  }, 0);

  const freeShippingProgress = 100;
  const isFreeShipping = true;

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const openCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };
  const closeCheckout = () => setIsCheckoutOpen(false);

  const openQuickView = (product: Product, variantId?: number) => {
    setQuickViewProduct(product);
    setQuickViewInitialVariantId(variantId ?? null);
  };
  const closeQuickView = () => {
    setQuickViewProduct(null);
    setQuickViewInitialVariantId(null);
  };

  const openSearch = () => setIsSearchOpen(true);
  const closeSearch = () => setIsSearchOpen(false);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        subtotalMAD,
        freeShippingThresholdMAD: 0,
        freeShippingProgress,
        isFreeShipping,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
        isCheckoutOpen,
        openCheckout,
        closeCheckout,
        quickViewProduct,
        quickViewInitialVariantId,
        openQuickView,
        closeQuickView,
        isSearchOpen,
        openSearch,
        closeSearch,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
