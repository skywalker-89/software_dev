import React from "react";

interface PropertyCardProps {
  name: string;
  price: number;
  beds: number;
  baths: number;
  rating: number;
}

const PropertyCard = ({
  name,
  price,
  beds,
  baths,
  rating,
}: PropertyCardProps) => {
  return (
    <div className="rounded-lg border bg-white shadow hover:shadow-lg transition-all">
      <div className="h-40 bg-gray-300"></div> {/* Placeholder for image */}
      <div className="p-4">
        <h3 className="font-semibold text-PrimaryColor">{name}</h3>
        <p className="text-sm text-gray-500">
          {beds} Bed · {baths} Bath · {rating}⭐
        </p>
        <p className="mt-2 text-gray-500 font-bold">${price} / Night</p>
      </div>
    </div>
  );
};

export default PropertyCard;
