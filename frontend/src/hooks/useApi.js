import { useState, useEffect } from "react";
import api from "../services/api";

export const useRestaurantInfo = () => {
  const [restaurantInfo, setRestaurantInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.fetchRestaurantInfo();
        setRestaurantInfo(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { restaurantInfo, loading, error };
};

export const useMenuData = () => {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, menuItemsData] = await Promise.all([
          api.fetchCategories(),
          api.fetchMenuItems(),
        ]);
        setCategories(categoriesData);
        setMenuItems(menuItemsData);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { categories, menuItems, loading, error };
};
