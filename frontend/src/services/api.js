import { API_BASE } from "../utils/constants";

const api = {
  async fetchRestaurantInfo() {
    try {
      const response = await fetch(`${API_BASE}/restaurant-info/`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching restaurant info:", error);
      throw error;
    }
  },

  async fetchCategories() {
    try {
      const response = await fetch(`${API_BASE}/categories/`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },

  async fetchMenuItems() {
    try {
      const response = await fetch(`${API_BASE}/menu/`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching menu items:", error);
      throw error;
    }
  },

  async createOrder(orderData) {
    try {
      const response = await fetch(`${API_BASE}/orders/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error("Failed to place order");
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  },
};

export default api;
