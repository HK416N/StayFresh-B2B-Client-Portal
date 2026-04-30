// frontend/src/services/authService.js
const BASE_URL = import.meta.env.VITE_BACKEND_HOST;

// header helper - get token from localstorage for header
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

export const signup = async (userData) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Signup failed',
      };
    }

    return { 
      ...data, 
      success: true 
    }; //added success: true to all fetches to match error returns

  } catch (error) {
    console.error(error.message);
    return {
      success: false,
      error: "Could not connect to server",
    };
  }
};

export const login = async (userData) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Invalid Credentials',
      };
    }

    return { 
      ...data, 
      success: true };

  } catch (error) {
    console.error(error.message);
    return {
      success: false,
      error: "Could not connect to server",
    };
  }
};



//! proj 3 ref - remember to remove

// const BASE_URL = import.meta.env.VITE_BACKEND_HOST;

// //get token from localstorage for header
// export const getAuthHeaders = () => {
//     const token = localStorage.getItem('token');
//     const headers = {
//         "Content-Type": "application/json"
//     };

//     if (token) {
//         headers["Authorization"] = `Bearer ${token}`;
//     };

//     return headers;
// };

// export const signup = async (userData) => {
//     const url = `${BASE_URL}/auth/signup`
//     try {
//         const response = await fetch(url, {
//             method: 'POST',
//             headers: getAuthHeaders(),
//             body: JSON.stringify(userData),
//         });

//         return await response.json();

//     } catch (error) {
//         console.error(error.message);
//     };
// };

// export const login = async (userData) => {
//     const url = `${BASE_URL}/auth/login`
//     try {
//         const response = await fetch(url, {
//             method: 'POST',
//             headers: getAuthHeaders(),
//             body: JSON.stringify(userData),
//         });

//         return await response.json();
        
//     } catch (error) {
//         console.error(error.message);
//         return {
//             success: false,
//             error: error.message,
//         }
        
//     };
// };