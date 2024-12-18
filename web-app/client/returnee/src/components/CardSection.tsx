import React from "react";
import PropertyCard from "./PropertyCard";

const properties = [
  {
    id: 1,
    name: "Karya Doma Homies",
    price: 210,
    beds: 3,
    baths: 4,
    rating: 4.5,
  },
  {
    id: 2,
    name: "Karya Bau Homies",
    price: 310,
    beds: 6,
    baths: 4,
    rating: 4.5,
  },
  {
    id: 3,
    name: "Karya Kru Homies",
    price: 510,
    beds: 4,
    baths: 4,
    rating: 4.5,
  },
];

const CardSection = () => {
  return (
    <div className="grid grid-cols-1 gap-6 p-4 sm:grid-cols-2 lg:grid-cols-3">
      {properties.map((property) => (
        <PropertyCard key={property.id} {...property} />
      ))}
    </div>
  );
};

export default CardSection;
