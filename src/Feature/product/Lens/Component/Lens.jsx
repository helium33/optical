import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useSWR from "swr";
import useVoucherStore from "../../../../Store/UseVoucherStore";
import PageLoader from "../../../../Component/PageLoader";

const fetcher = async (url) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error(`HTTP error! Status: ${res.status}`);
    error.status = res.status;
    throw error;
  }
  return res.json();
};

const Lens = () => {
  const navigate = useNavigate();
  const { data: navItems, error: navError } = useSWR("http://localhost:3001/navbar", fetcher);
  const { data: lenses, error: lensError } = useSWR("http://localhost:3001/lens", fetcher);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const setLensData = useVoucherStore((state) => state.setLensData);

  // Debugging: Log data and search query
  console.log("Lenses Data:", lenses);
  console.log("Search Query:", searchQuery);

  if (navError || lensError) return <p>Failed to load data.</p>;
  if (!navItems || !lenses) return <PageLoader />;

  const availableCategories = [
    { id: 1, title: "All", filter: "all" },
    { id: 2, title: "Polarized Sunglasses", filter: "Polarized Sunglasses" },
    { id: 3, title: "Blue Light Glasses", filter: "Blue Light Glasses" },
    { id: 4, title: "Reading Glasses", filter: "Reading Glasses" },
    { id: 5, title: "Transitions®", filter: "Transitions®" },
    { id: 6, title: "Bifocal Lenses", filter: "Bifocal Lenses" },
    { id: 7, title: "Progressive Lenses", filter: "Progressive Lenses" },
    { id: 8, title: "Prism Lenses", filter: "Prism Lenses" },
    { id: 9, title: "KODAK Lenses", filter: "KODAK Lenses" },
    { id: 10, title: "Coatings", filter: "Coatings" },
    { id: 11, title: "Anti-Reflective Coating", filter: "Anti-Reflective Coating" },
    { id: 12, title: "Mirrored Sunglasses", filter: "Mirrored Sunglasses" },
  ];

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleAddToBag = (lens) => {
    setLensData({
      name: lens.name,
      price: lens.price,
      finalPrice: lens.price, // Set initial finalPrice to price
    });
    navigate("/voucher");
  };

  const filteredLenses = lenses
    .filter((lens) => {
      // Ensure lens.categories is an array; fallback to true if missing
      const categories = Array.isArray(lens.categories) ? lens.categories : [];
      return selectedCategory === "all" || categories.includes(selectedCategory);
    })
    .filter((lens) => {
      // Ensure name and description are strings; fallback to empty string if missing
      const name = lens.name || "";
      const description = lens.description || "";
      const query = searchQuery.toLowerCase();
      return name.toLowerCase().includes(query) || description.toLowerCase().includes(query);
    });

  // Debugging: Log filtered results
  console.log("Filtered Lenses:", filteredLenses);

  return (
    <div className="p-6">
      {/* Back to Home Icon and Search Bar */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate("/")} className="flex items-center text-blue-500 hover:text-blue-700">
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          Back to Home
        </button>

        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Search lenses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-md pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg
            className="absolute left-3 w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Category Buttons with Horizontal Scroll */}
      <div className="mb-6 overflow-x-auto whitespace-nowrap scrollbar-hide">
        <div className="flex gap-2">
          {availableCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.filter)}
              className={`px-4 py-2 border rounded ${
                selectedCategory === category.filter ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              {category.title}
            </button>
          ))}
        </div>
      </div>

      {/* Lens List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredLenses.length > 0 ? (
          filteredLenses.map((lens) => (
            <div key={lens.id} className="border p-4 rounded shadow-md flex flex-col">
              <img
                src={Array.isArray(lens.image) ? lens.image[0] : lens.image}
                alt={lens.name}
                className="w-full h-40 object-cover rounded"
              />
              <h3 className="text-lg font-semibold mt-2">{lens.name}</h3>
              <p className="text-gray-600 text-sm">{lens.description || "No description available"}</p>
              <p className="text-blue-500 font-bold mt-1">${lens.price.toFixed(2)}</p>

              <div className="mt-2">
                <p className="text-sm font-medium">Colors:</p>
                <div className="flex space-x-2">
                  {(Array.isArray(lens.color) ? lens.color : [lens.color || "clear"]).map((color, index) => (
                    <span
                      key={index}
                      className="w-5 h-5 rounded-full border"
                      style={{ backgroundColor: color.toLowerCase() === "clear" ? "transparent" : color.toLowerCase() }}
                      title={color}
                    ></span>
                  ))}
                </div>
              </div>

              {/* Category Links */}
              <div className="mt-2">
                {Array.isArray(lens.categories) && lens.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {lens.categories.map((category, index) => (
                      <Link
                        key={index}
                        to={`/learn/${category.toLowerCase().replace(/\s+/g, "-")}`}
                        className="text-sm text-blue-500 hover:underline"
                      >
                        What is {category}?
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* View Details and Add to Bag Buttons */}
              <div className="mt-auto flex justify-between gap-2">
                <Link
                  to={`/lenses/${lens.id}`}
                  className="text-blue-500 hover:text-blue-700 font-semibold py-1 px-3"
                >
                  View Details
                </Link>
                <button
                  onClick={() => handleAddToBag(lens)}
                  className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                >
                  Add to Bag
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">No lenses found.</p>
        )}
      </div>
    </div>
  );
};

export default Lens;