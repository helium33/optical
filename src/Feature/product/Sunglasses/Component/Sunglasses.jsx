import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useSWR from "swr";
import UseVoucherStore from "../../../../Store/UseVoucherStore";
import PageLoader from "../../../../Component/PageLoader";

const fetcher = (url) => fetch(url).then((res) => res.json());

const Sunglasses = () => {
  const navigate = useNavigate();
  const { data: navItems, error: navError } = useSWR("http://localhost:3001/navbar", fetcher);
  const { data: products, error: productError } = useSWR("http://localhost:3001/products", fetcher);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const setProductData = UseVoucherStore((state) => state.setProductData);

  if (navError || productError) return <p>Failed to load data.</p>;
  if (!navItems || !products) return <PageLoader />;

  const availableCategories = [
    { id: 1, title: "All", filter: "all" },
    { id: 2, title: "Men", filter: "Men" },
    { id: 3, title: "Women", filter: "Women" },
    { id: 4, title: "Sunglasses", filter: "Sunglasses" },
    { id: 5, title: "UV Protection", filter: "UV Protection" },
    { id: 6, title: "Best Seller", filter: "Best Seller" },
    { id: 7, title: "New Arrivals", filter: "New Arrivals" },
    { id: 8, title: "Blue Light Blocking", filter: "Blue Light Blocking" },
  ];

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleAddToBag = (product) => {
    setProductData({
      name: product.name,
      price: product.price,
      finalPrice: product.price,
    });
    navigate("/voucher");
  };

  const filteredProducts = products
    .filter((product) =>
      selectedCategory === "all" ? true : product.categories.includes(selectedCategory)
    )
    .filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
            placeholder="Search sunglasses..."
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
      <div className="mb-6 overflow-x-auto whitespace-nowrap scrollbar scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
        <div className="flex gap-2">
          {availableCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.filter)}
              className={`px-4 py-2 border rounded ${
                selectedCategory === category.filter ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
              }`}
            >
              {category.title}
            </button>
          ))}
        </div>
      </div>

      {/* Product List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="border p-4 rounded shadow-md">
            <img
              src={Array.isArray(product.image) ? product.image[0] : product.image}
              alt={product.name}
              className="w-full h-40 object-cover rounded"
            />
            <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
            <p className="text-gray-600 text-sm">{product.description}</p>
            <p className="text-blue-500 font-bold mt-1">${product.price.toFixed(2)}</p>

            <div className="mt-2">
              <p className="text-sm font-medium">Colors:</p>
              <div className="flex space-x-2">
                {product.colors.map((color, index) => (
                  <span
                    key={index}
                    className="w-5 h-5 rounded-full border"
                    style={{ backgroundColor: color.toLowerCase() }}
                    title={color}
                  ></span>
                ))}
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between gap-2">
              <Link to={`/sunglasses/${product.id}`} className="text-blue-500 hover:text-blue-700 font-semibold">
                View Details
              </Link>
              <button
                onClick={() => handleAddToBag(product)}
                className="bg-indigo-500 text-white py-1 px-3 rounded hover:bg-blue-600"
              >
                Add to Bag
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sunglasses;