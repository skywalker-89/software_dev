import React, { useState } from "react";
import Image from "next/image";
import {
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

interface ImageGalleryProps {
  images: string[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Track current image index
  const [modalImage, setModalImage] = useState<string | null>(null); // State for modal image

  // Function to go to the previous image
  const goToPreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Function to go to the next image
  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Open image in modal view
  const openImageInModal = (image: string) => {
    setModalImage(image);
  };

  // Close the modal
  const closeModal = () => {
    setModalImage(null);
  };

  return (
    <div className="relative">
      {/* Image carousel */}
      <div className="flex justify-center items-center">
        {/* Previous Image Button */}
        <button
          onClick={goToPreviousImage}
          className="absolute left-0.5 z-10 p-2 bg-gray-800 text-white rounded-full opacity-75 hover:opacity-100 transition-opacity duration-300"
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </button>

        <div className="relative">
          {/* Display current image */}
          <Image
            src={images[currentImageIndex]}
            alt={`Image ${currentImageIndex + 1}`}
            width={200} // Fixed width for consistent image size
            height={200} // Fixed height for consistent image size
            className="rounded-lg cursor-pointer object-cover"
            onClick={() => openImageInModal(images[currentImageIndex])}
          />
          {/* Current image number / total images */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full">
            {currentImageIndex + 1} / {images.length}
          </div>
        </div>

        {/* Next Image Button */}
        <button
          onClick={goToNextImage}
          className="absolute right-0.5 z-10 p-2 bg-gray-800 text-white rounded-full opacity-75 hover:opacity-100 transition-opacity duration-300"
        >
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      </div>

      {/* Modal for detailed image view */}
      {modalImage && (
        <div
          className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-70 z-50"
          onClick={closeModal}
        >
          <div className="relative max-w-3xl max-h-3xl">
            <Image
              src={modalImage}
              alt="Zoomed-in"
              width={800} // Larger size for modal view
              height={800} // Larger size for modal view
              className="rounded-lg object-contain"
            />
            {/* Close modal button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 bg-gray-800 text-white rounded-full p-2"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
