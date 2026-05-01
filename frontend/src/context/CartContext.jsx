import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
    // same lazy init as AuthProvider
    const [items, setItems] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        try {
            return savedCart ? JSON.parse(savedCart) : [];
        } catch {
            return [];
        }
    });

    // similar to AuthContext, save state to localStorage to prevent
    // cart from clearing on refresh, sync automatically with useEffect
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(items));
    }, [items]);

    const addToCart = (product, quantity) => {
        //guard
        if (quantity <= 0) return;

        setItems((prevState) => {
            //find existing item to add new quantity to it
            const existing = prevState.find((item) => item.product_id === product.id);

            // create new array with existing data (keep all other items in the cart)
            // update quantity of the item we are adding to cart
            if (existing) {
                return prevState.map((item) =>
                    item.product_id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }

            // not existing, spread prevState + new item
            return [
                ...prevState,
                {
                    product_id: product.id,
                    description: product.description,
                    sale_price: Number(product.sale_price),
                    uom: product.uom,
                    quantity,
                },
            ];
        });
    };


    // update
    const updateQuantity = (productId, quantity) => {
        // similar logic.. map prev state creating a new array,
        // looks for item by product id (look for specific row), 
        // spread item when row is found,
        // update the quantity. if id doesnt match just return row as is  
        setItems((prevState) =>
            prevState.map((item) => (
                item.product_id === productId 
                ? { ...item, quantity } 
                : item
            ))
        );
    };

    // delete using filter - setItems  to everything that is NOT productId
    const removeFromCart = (productId) => {
        setItems((prevState) => prevState.filter((item) => 
            item.product_id !== productId));
    };

    // clear cart, setItems state to empty array and remove from localStorage
    const clearCart = () => {
        setItems([]);
        localStorage.removeItem('cart');
    };

    // Derived values - automatically recalculated when 'items' changes
    const total = items.reduce((sum, i) => sum + i.sale_price * i.quantity, 0);
    const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

    
    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                updateQuantity,
                removeFromCart,
                clearCart,
                total,
                itemCount,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
