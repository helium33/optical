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

const FeatureSection = () => {
  const { id } = useParams(); // Get product ID from URL
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("New Arrivals");
  const [selectedColors, setSelectedColors] = useState({});

  // SWR hooks for fetching data
  const {
    data: features,
    error: featuresError,
    isLoading: featuresLoading,
  } = useSWR("http://localhost:3001/features", fetcher);
  const {
    data: product,
    error: productError,
    isLoading: productLoading,
  } = useSWR(id ? `http://localhost:3001/features/${id}` : null, fetcher);
  const { data: quiz, error: quizError, isLoading: quizLoading } = useSWR(
    "http://localhost:3001/quiz",
    fetcher
  ); // Kept this as it was in your code, though not used here

  // Derived data
  const newArrivals = (features || []).slice(0, 5);
  const bestSellers = (features || []).slice(5, 10);
  const noProductsFound =
    !featuresLoading && !featuresError && features && features.length === 0;

  // Handle color selection
  const handleColorSelect = (productId, color, colorsArray) => {
    const colorIndex = colorsArray.indexOf(color);
    setSelectedColors((prev) => ({
      ...prev,
      [productId]: { color, index: colorIndex },
    }));
  };

  // Get display image based on selected color
  const getDisplayImage = (product) => {
    const selected = selectedColors[product?.id];
    if (Array.isArray(product?.image)) {
      return selected &&
        selected.index >= 0 &&
        selected.index < product.image.length
        ? product.image[selected.index]
        : product.image[0];
    }
    return product?.image;
  };

  // Cart functionality
  const handleAddToBag = (product) => {
    if (product.stock > 0) {
      alert(`${product.name} added to bag!`);
    } else {
      alert("Sorry, this item is out of stock.");
    }
    navigate(`/cart/${product.id}`, { state: { product } });
  };

  // Detail View
  if (id) {
    if (productLoading)
      return (
        <div className="flex justify-center items-center h-screen">
          <l-infinity
            size="55"
            stroke="4"
            stroke-length="0.15"
            bg-opacity="0.1"
            speed="1.3"
            color="hsl(13, 68%, 63%)"
          ></l-infinity>
        </div>
      );
    if (productError)
      return (
        <div className="text-center text-red-500 p-4">
          Error: {productError.message}
        </div>
      );
    if (!product)
      return (
        <div className="text-center text-gray-600 p-4">Product not found</div>
      );

    const images = Array.isArray(product.image) ? product.image : [product.image];

    return (
      <section className="p-6 bg-gray-100 min-h-screen">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="md:w-1/2 relative">
            <button
              className="mb-4 text-blue-600 hover:underline"
              onClick={() => navigate("/features")}
            >
              ← Back to Products
            </button>
            <img
              src={getDisplayImage(product)}
              alt={product.name}
              className="w-full h-96 object-cover rounded mb-4"
            />
            {images.length > 1 && (
              <div className="flex space-x-2 mt-2 justify-center">
                {images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className={`w-16 h-16 object-cover rounded cursor-pointer ${
                      selectedColors[product.id]?.index === idx
                        ? "border-2 border-blue-600"
                        : "border"
                    }`}
                    onClick={() =>
                      handleColorSelect(product.id, product.colors[idx], product.colors)
                    }
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="md:w-1/2 md:pl-6">
            <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
            <p className="text-gray-600 text-xl mb-2">${product.price}</p>
            <p className="text-gray-500 mb-2">
              Stock: {product.stock > 0 ? product.stock : "Out of Stock"}
            </p>
            <p className="text-yellow-500 mb-2">
              {"⭐".repeat(Math.floor(product.star))} {product.star}
            </p>
            <div className="mb-4">
              <p className="text-gray-700 font-semibold">Colors:</p>
              <div className="flex space-x-2 mt-1">
                {product.colors.map((color, idx) => (
                  <span
                    key={idx}
                    className={`w-8 h-8 rounded-full border cursor-pointer ${
                      selectedColors[product.id]?.color === color
                        ? "border-2 border-black scale-110"
                        : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color.toLowerCase() }}
                    onClick={() =>
                      handleColorSelect(product.id, color, product.colors)
                    }
                    title={color}
                  ></span>
                ))}
              </div>
              <p className="text-gray-600 mt-2">{product.colors.join(", ")}</p>
            </div>
            <p className="text-gray-700 mb-6">{product.description}</p>
            <div className="flex space-x-4 mb-4">
              <button
                onClick={() => handleAddToBag(product)}
                className={`px-6 py-2 rounded text-white ${
                  product.stock > 0
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
                disabled={product.stock <= 0}
              >
                Add to Bag
              </button>
              <button
                onClick={() => navigate(`/checkout/${product.id}`)}
                className={`px-6 py-2 rounded text-white ${
                  product.stock > 0
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
                disabled={product.stock <= 0}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // List View
  return (
    <section className="p-6 bg-gray-100">
      {/* Tab Switcher */}
      <div className="flex justify-center mb-6 space-x-4">
        {["New Arrivals", "Best Sellers"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 font-semibold transition rounded ${
              activeTab === tab
                ? "bg-blue-600 text-white"
                : "bg-gray-300 text-gray-700 hover:bg-gray-400"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {featuresLoading && (
        <div className="flex justify-center items-center h-64">
          <l-infinity
            size="55"
            stroke="4"
            stroke-length="0.15"
            bg-opacity="0.1"
            speed="1.3"
            color="hsl(13, 68%, 63%)"
          ></l-infinity>
        </div>
      )}

      {/* Error State */}
      {featuresError && (
        <div className="text-center text-red-500 p-4">
          <p>Error: {featuresError.message}</p>
          <p>
            Please ensure the server is running at http://localhost:3001/features
          </p>
        </div>
      )}

      {/* No Products Found */}
      {noProductsFound && (
        <div className="text-center text-gray-600 p-4">
          <p>No products found.</p>
        </div>
      )}

      {/* Product Grid */}
      {!featuresLoading && !featuresError && features && (
        <div>
          <h2 className="text-2xl font-bold mb-4">{activeTab}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(activeTab === "New Arrivals" ? newArrivals : bestSellers).map(
              (product) => (
                <div
                  key={product.id}
                  className="p-4 bg-white shadow rounded transition-colors"
                >
                  <img
                    src={getDisplayImage(product)}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded cursor-pointer"
                    onClick={() => navigate(`/features/${product.id}`)}
                  />
                  <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
                  <p className="text-gray-600">${product.price}</p>
                  <p className="text-sm text-gray-500">
                    Stock: {product.stock}
                  </p>
                  <p className="text-yellow-500 mb-2">
                    {"⭐".repeat(Math.floor(product.star))} {product.star}
                  </p>
                  <div className="mb-4">
                    <p className="text-gray-700 font-semibold">Colors:</p>
                    <div className="flex space-x-2 mt-1">
                      {product.colors.map((color, idx) => (
                        <span
                          key={idx}
                          className="w-6 h-6 rounded-full border"
                          style={{ backgroundColor: color.toLowerCase() }}
                          title={color}
                        ></span>
                      ))}
                    </div>
                    <p className="text-gray-600 mt-1 text-sm">
                      {product.colors.join(", ")}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <button
                      className="text-blue-500 hover:text-blue-700 font-semibold"
                      onClick={() => navigate(`/features/${product.id}`)}
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleAddToBag(product)}
                      className={`text-white px-4 py-2 rounded transition ${
                        product.stock > 0
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                      disabled={product.stock <= 0}
                    >
                      {product.stock > 0 ? "Add to Bag" : "Out of Stock"}
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default FeatureSection;