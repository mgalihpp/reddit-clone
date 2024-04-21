import store from "@/store";

class Token {
  // Method to set authentication token
  setAuthToken(token: string) {
    // Implement token storage logic here
    localStorage.setItem("token", token); // Example: Store token in localStorage
  }

  // Method to get authentication token
  getAuthToken() {
    // Implement token retrieval logic here
    return localStorage.getItem("token"); // Example: Retrieve token from localStorage
  }

  // Method to clear authentication token
  clearAuthToken() {
    // Implement token clearing logic here
    localStorage.removeItem("token"); // Example: Remove token from localStorage
  }

  // Method to bring authorization headers
  authorization() {
    const token = store.getState().auth.token;

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }
}

export default new Token();

// // Example usage:
// const tokenManager = new Token();

// // Set authentication token
// tokenManager.setAuthToken("your_token_here");

// // Get authentication token
// const authToken = tokenManager.getAuthToken();
// console.log(authToken); // Output: your_token_here

// // Clear authentication token
// tokenManager.clearAuthToken();
