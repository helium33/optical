import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useSWR from "swr";
import { infinity } from "ldrs";

infinity.register();

const fetcher = (url) =>
  fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    return res.json();
  });

const LensDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  const {
    data: lens,
    error: lensError,
    isLoading: lensLoading,
  } = useSWR(`http://localhost:3001/lens/${id}`, fetcher);

  const handleColorSelect = (index) => {
    setSelectedColorIndex(index);
  };

  const handleAddToBag = () => {
    if (lens?.stock > 0) {
      navigate(`/cart/${lens.id}`, { state: { lens } });
    } else {
      alert("Sorry, this item is out of stock.");
    }
  };

  if (lensLoading) {
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

  if (lensError) return <div className="text-center text-red-500 p-4">Error: {lensError.message}</div>;
  if (!lens) return <div className="text-center text-gray-600 p-4">Lens not found</div>;

  const images = Array.isArray(lens.image) ? lens.image : [lens.image];
  const colors = Array.isArray(lens.colors) ? lens.colors : [];
  const currentImage = images[selectedColorIndex] || images[0];

  return (
    <section className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Image Section */}
          <div className="lg:w-1/2">
            <button
              className="mb-6 text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
              onClick={() => navigate("/lens")}
            >
              <span className="text-lg">←</span> Back to Lenses
            </button>
            <img
              src={currentImage}
              alt={lens.name}
              className="w-full h-[250px] object-cover rounded-lg shadow-md"
            />
            {images.length > 1 && (
              <div className="flex flex-wrap gap-3 mt-4 justify-center">
                {images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className={`w-20 h-20 object-cover rounded-md cursor-pointer transition-all duration-200 ${
                      selectedColorIndex === idx
                        ? "border-2 border-blue-600 scale-110"
                        : "border border-gray-200 hover:border-gray-400"
                    }`}
                    onClick={() => handleColorSelect(idx)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Lens Details */}
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">{lens.name}</h2>
            <p className="text-gray-600 text-2xl font-semibold mb-3">${lens.price}</p>
            <p className="text-gray-500 mb-3">
              Stock: <span className={lens.stock > 0 ? "text-green-600" : "text-red-600"}>
                {lens.stock > 0 ? lens.stock : "Out of Stock"}
              </span>
            </p>
            <p className="text-yellow-500 mb-4 flex items-center gap-1">
              {"⭐".repeat(Math.floor(lens.star || 0))}
              <span className="text-gray-600 text-sm ml-2">({lens.star || "N/A"})</span>
            </p>
            {colors.length > 0 && (
              <div className="mb-6">
                <p className="text-gray-700 font-semibold mb-2">Available Colors:</p>
                <div className="flex gap-3 flex-wrap">
                  {colors.map((color, idx) => (
                    <span
                      key={idx}
                      className={`w-10 h-10 rounded-full border-2 cursor-pointer transition-all duration-200 ${
                        selectedColorIndex === idx
                          ? "border-blue-600 scale-110"
                          : "border-gray-300 hover:scale-105"
                      }`}
                      style={{ backgroundColor: color.toLowerCase() }}
                      onClick={() => handleColorSelect(idx)}
                      title={color}
                    ></span>
                  ))}
                </div>
              </div>
            )}
            <p className="text-gray-600 mb-6">{lens.description}</p>
            <div className="flex gap-4">
              <button
                onClick={handleAddToBag}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold text-white ${
                  lens.stock > 0
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
                disabled={lens.stock <= 0}
              >
                Add to Cart
              </button>
              <button
                onClick={() => navigate(`/checkout/${lens.id}`)}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold text-white ${
                  lens.stock > 0
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
                disabled={lens.stock <= 0}
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

export default LensDetail;