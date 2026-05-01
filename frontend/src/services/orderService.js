// frontend/src/services/orderService.js
const BASE_URL = import.meta.env.VITE_BACKEND_HOST;

import { getAuthHeaders } from './authService';

// list  all active orders (PLACED and TRANSIT only - CANCELLED and COMPLETE are history)
export const getOrders = async (statuses = ['PLACED', 'TRANSIT']) => {

    const url = `${BASE_URL}/orders?status=${statuses.join(',')}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || `Response status: ${response.status}`);
        }

        return {
            ...data,
            success: true
        };

    } catch (error) {
        console.error(error.message);
        return {
            success: false,
            error: error.message
        };
    }
};

// get one order
export const getOrderById = async (id) => {

    const url = `${BASE_URL}/orders/${id}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || `Response status: ${response.status}`);
        }

        return { ...data, success: true };

    } catch (error) {
        console.error(error.message);
        return {
            success: false,
            error: error.message
        };
    }
};

// create order
export const placeOrder = async (items) => {

    const url = `${BASE_URL}/orders`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ items }),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || `Response status: ${response.status}`);
        }

        return {
            ...data,
            success: true
        };

    } catch (error) {
        console.error(error.message);
        return {
            success: false,
            error: error.message
        };
    }
};

// update order status
export const updateOrderStatus = async (id, status) => {

    const url = `${BASE_URL}/orders/${id}/status`;

    try {
        const response = await fetch(url, {
            method: 'PATCH',
            headers: getAuthHeaders(),
            body: JSON.stringify({ status }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || `Response status: ${response.status}`);
        }

        return {
            ...data,
            success: true
        };

    } catch (error) {
        console.error(error.message);
        return {
            success: false,
            error: error.message
        };
    }
};
