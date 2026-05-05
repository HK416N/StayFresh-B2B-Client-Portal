import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
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

  //check how many items are already in the cart
  const getCartQuantity = (productId) => {
    const item = items.find((i) => i.product_id === productId);
    return item ? item.quantity : 0;
  };

  
  const addToCart = (product, quantity) => {
    //guard
    if (quantity <= 0) {
      return { 
        success: false, 
        error: 'Quantity must be 1 or more'
      };
    }

    const alreadyInCart = getCartQuantity(product.id);
    const newTotal = alreadyInCart + quantity;

    if (newTotal > product.stock) {
      const remaining = product.stock - alreadyInCart;
      return {
        success: false,
        error:
          remaining > 0
            ? `Only ${remaining} ${product.uom} left available (${alreadyInCart} already in cart)`
            : `${product.description} is fully reserved in cart`,
      };
    }

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

    return { success: true };
  };


  // update
  // similar logic.. map prev state creating a new array,
  // looks for item by product id (look for specific row), 
  // spread item when row is found,
  // update the quantity. if id doesnt match just return row as is  
  const updateQuantity = (productId, quantity) => {

    //guards. prevents 0 or negative additions to cart
    if (quantity <= 0) {
      return { 
        success: false, 
        error: 'Quantity must be 1 or more' 
      };
    }

    // prevent adding more products than available stock
    if (quantity > item.stock) {
      return {
        success: false,
        error: `Only ${item.stock} ${item.uom} available`,
      };
    }

    setItems((prevState) =>
      prevState.map((item) => (
        item.product_id === productId
          ? { ...item, quantity }
          : item
      ))
    );

    return { success: true };
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
  const total = items.reduce((sum, item) => sum + item.sale_price * item.quantity, 0);
  // counting individual items (quantity) turned out to be silly. 
  // changed to count the array length so the notification only shows the number of items not the total QTY 
  const itemCount = items.length;


  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getCartQuantity,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
