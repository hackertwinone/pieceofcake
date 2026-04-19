import React from "react";
import { useRestaurantInfo } from "../../hooks/useApi";

const HomePage = () => {
  const { restaurantInfo, loading } = useRestaurantInfo();

  if (loading) {
    return <div className="text-center py-16 text-espresso">Loading...</div>;
  }

  return <div className="space-y-12"></div>;
};

export default HomePage;
