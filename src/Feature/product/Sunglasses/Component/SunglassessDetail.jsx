import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useSWR from "swr";
import { infinity } from "ldrs";

// Register the loader
infinity.register();

// SWR Fetcher function
const fetcher = (url) =>
  fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    return res.json();
  });

const SunglassesDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedColors, setSelectedColors] = useState({});

  const {
    data: product,
    error: productError,
    isLoading: productLoading,
  } = useSWR(`http://localhost:3001/products/${id}`, fetcher); // Changed to /products to match Sunglasses

  const handleColorSelect = (productId, color, colorsArray) => {
    const colorIndex = colorsArray.indexOf(color);
    setSelectedColors((prev) => ({
      ...prev,
      [productId]: { color, index: colorIndex },
    }));
  };

  const getDisplayImage = (product) => {
    const selected = selectedColors[product?.id];
    if (Array.isArray(product?.image)) {
      return selected && selected.index >= 0 && selected.index < product.image.length
        ? product.image[selected.index]
        : product.image[0];
    }
    return product?.image;
  };

  const handleAddToBag = (product) => {
    if (product.stock > 0) {
      navigate(`/cart/${product.id}`, { state: { product } });
    } else {
      alert("Sorry, this item is out of stock.");
    }
  };

  if (productLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <l-infinity
          size="65"
          stroke="5"
          stroke-length="0.15"
          bg-opacity="0.1"
          speed="1.3"
          color="hsl(13, 68%, 63%)"
        ></l-infinity>
      </div>
    );
  }

  if (productError) {
    return (
      <div className="text-center text-red-500 p-4 bg-red-50 rounded-lg m-6">
        Error: {productError.message}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center text-gray-600 p-4 bg-gray-50 rounded-lg m-6">
        Product not found
      </div>
    );
  }

  const images = Array.isArray(product.image) ? product.image : [product.image];

  return (
    <section className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-2xl">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Image Section */}
          <div className="lg:w-1/2">
            <button
              className="mb-6 text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2 transition-colors duration-200"
              onClick={() => navigate("/sunglasses")}
            >
              <span className="text-lg">←</span> Back to Sunglasses
            </button>
            <div className="relative group">
              <img
                src={getDisplayImage(product)}
                alt={product.name}
                className="w-full h-[250px] object-cover rounded-lg shadow-md transform transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300 rounded-lg"></div>
            </div>
            {images.length > 1 && (
              <div className="flex flex-wrap gap-3 mt-4 justify-center">
                {images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className={`w-20 h-20 object-cover rounded-md cursor-pointer transition-all duration-200 ${
                      selectedColors[product.id]?.index === idx
                        ? "border-2 border-blue-600 scale-110 shadow-lg"
                        : "border border-gray-200 hover:border-gray-400"
                    }`}
                    onClick={() => handleColorSelect(product.id, product.colors[idx], product.colors)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">{product.name}</h2>
            <p className="text-gray-600 text-2xl font-semibold mb-3">${product.price}</p>
            <p className="text-gray-500 mb-3">
              Stock:{" "}
              <span className={product.stock > 0 ? "text-green-600" : "text-red-600"}>
                {product.stock > 0 ? product.stock : "Out of Stock"}
              </span>
            </p>
            <p className="text-yellow-500 mb-4 flex items-center gap-1">
              {"⭐".repeat(Math.floor(product.star || 0))}
              <span className="text-gray-600 text-sm ml-2">({product.star || "N/A"})</span>
            </p>
            <div className="mb-6">
              <p className="text-gray-700 font-semibold mb-2">Available Colors:</p>
              <div className="flex gap-3 flex-wrap">
                {product.colors.map((color, idx) => (
                  <span
                    key={idx}
                    className={`w-10 h-10 rounded-full border-2 cursor-pointer transform transition-all duration-200 ${
                      selectedColors[product.id]?.color === color
                        ? "border-blue-600 scale-110 shadow-md"
                        : "border-gray-300 hover:scale-105"
                    }`}
                    style={{ backgroundColor: color.toLowerCase() }}
                    onClick={() => handleColorSelect(product.id, color, product.colors)}
                    title={color}
                  ></span>
                ))}
              </div>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>
            <div className="flex gap-4">
              <button
                onClick={() => handleAddToBag(product)}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold text-white transition-all duration-300 transform ${
                  product.stock > 0
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:scale-105"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
                disabled={product.stock <= 0}
              >
                Add to Cart
              </button>
              <button
                onClick={() => navigate(`/checkout/${product.id}`)}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold text-white transition-all duration-300 transform ${
                  product.stock > 0
                    ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 hover:scale-105"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
                disabled={product.stock <= 0}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
    
  );
};

export default SunglassesDetail;