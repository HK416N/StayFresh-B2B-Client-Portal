// frontend/src/services/productService.js
const BASE_URL = import.meta.env.VITE_BACKEND_HOST;

import { getAuthHeaders } from "./authService";

// list with optional filtering
export const getProducts = async (search = '') => {
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI
    // see section under encodeURIComponent()
// !
    const url = `${BASE_URL}/products?search=${encodeURIComponent(search)}`;
    
    try {
        const response = await fetch(url, {
            headers: getAuthHeaders(),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        
        return { 
            success: true, 
            data: data 
        };
    
    } catch (error) {
        console.error(error.message);

        return { 
            success: false, 
            error: error.message 
        };
    }
};

// get one
export const getProductById = async (id) => {

    const url = `${BASE_URL}/products/${id}`;

    try {
        const response = await fetch(url, {
            headers: getAuthHeaders(),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        return { 
            success: true, 
            data: data 
        };
    
    } catch (error) {
        console.error(error.message);

        return { 
            success: false, 
            error: error.message 
        };
    }
};

//product stats for stat card on admin dashboard (home)
export const getProductStats = async () => {

    const url = `${BASE_URL}/products/stats`;

    try {
        const response = await fetch(url, {
        headers: getAuthHeaders(),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

    return { 
            success: true, 
            data: data 
        };
    
    } catch (error) {
        console.error(error.message);

        return { 
            success: false, 
            error: error.message 
        };
    }
};

// create product 
export const createProduct = async (productData) => {

    const url = `${BASE_URL}/products`;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(productData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || `Response status: ${response.status}`);
        }

        return { 
            success: true, 
            data: data 
        };
    
    } catch (error) {
        console.error(error.message);

        return { 
            success: false, 
            error: error.message 
        };
    }
};

// edit prodcut
export const updateProduct = async (id, productData) => {

    const url = `${BASE_URL}/products/${id}`;

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(productData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || `Response status: ${response.status}`);
        }

        return { 
            success: true, 
            data: data 
        };
    
    } catch (error) {
        console.error(error.message);

        return { 
            success: false, 
            error: error.message 
        };
    }
};

//delete product
export const deleteProduct = async (id) => {

    const url = `${BASE_URL}/products/${id}`;

    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || `Response status: ${response.status}`);
        }

        return { 
            success: true, 
            data: data 
        };
    
    } catch (error) {
        console.error(error.message);

        return { 
            success: false, 
            error: error.message 
        };
    }
};


// proj 3 ref

// const BASE_URL = import.meta.env.VITE_BACKEND_HOST;

// import { getAuthHeaders } from './authService'

// //List
// export const getAllClaims = async () => {

//     const url = `${BASE_URL}/claims`

//     try {
//         const response = await fetch(url, {
//             headers: getAuthHeaders(),
//         });

//         if (!response.ok) {
//             throw new Error(`Resoponse status: ${response.status}`);
//         };

//         return await response.json();

//     } catch (error) {
//         console.error(error.message);
//         return {
//             success: false,
//             error: error.message,
//         }
//     };
// };

// //one
// export const getClaimById = async (claimId) => {

//     const url = `${BASE_URL}/claims/${claimId}`

//     try {
//         const response = await fetch(url, {
//             headers: getAuthHeaders(),
//         })

//         if (!response.ok) {
//             throw new Error(`Response status: ${response.status}`)
//         };

//         return await response.json();

//     } catch (error) {
//         console.error(error.message);
//         return {
//             success: false,
//             error: error.message,
//         }
//     };
// };

// //new
// export const createClaim = async (claimData) => {

//     const url = `${BASE_URL}/claims`

//     try {
//         const response = await fetch(url, {
//             method: 'POST',
//             headers: getAuthHeaders(),
//             body: JSON.stringify(claimData),
//         });

//         if (!response.ok) {
//             throw new Error(`Response status: ${response.status}`)
//         };

//         return await response.json();

//     } catch (error) {
//         console.error(error.message);
//         return {
//             success: false,
//             error: error.message,
//         };
//     };

// };

// //edit
// export const updateClaim = async (claimId, updatedData) => {

//     const url = `${BASE_URL}/claims/${claimId}`

//     try {
//         const response = await fetch(url, {
//             method: 'PUT',
//             headers: getAuthHeaders(),
//             body: JSON.stringify(updatedData)

//         });

//         if (!response.ok) {
//             throw new Error(`Response status: ${response.status}`)
//         };

//         return await response.json();

//     } catch (error) {
//         console.error(error.message);
//         return {
//             success: false,
//             error: error.message,
//         }
//     };
// };

// //delete
// export const deleteClaim = async (claimId) => {

//     const url = `${BASE_URL}/claims/${claimId}`;

//     try {
//         const response = await fetch(url, {
//             method: 'DELETE',
//             headers: getAuthHeaders(),
//         });

//         if (!response.ok) {
//             throw new Error(`Response status: ${response.status}`)
//         };

//         return await response.json()

//     } catch (error) {
//         console.error(error.message);
//         return {
//             success: false,
//             error: error.message,
//         };
//     };

// };