// ../Feature/product/Lens/Component/CategoryDetail.js
import { useParams, useNavigate } from "react-router-dom";
import useSWR from "swr";

const fetcher = async (url) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error(`HTTP error! Status: ${res.status}`);
    error.status = res.status;
    throw error;
  }
  return res.json();
};

const CategoryDetail = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const { data: categories, error, isLoading } = useSWR("http://localhost:3001/categories", fetcher);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
        <div className="text-center text-gray-600 p-6">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-indigo-600 hover:text-indigo-800 flex items-center transition-colors duration-200"
        >
          <svg
            className="w-6 h-6 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-semibold">Back</span>
        </button>
        <div className="text-center text-red-500 p-6 bg-white rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-2">Error</h2>
          <p>Failed to load categories: {error.message}</p>
        </div>
      </div>
    );
  }

  const categoryTitle = category
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const categoryData = categories.find((cat) => cat.title === categoryTitle);

  if (!categoryData) {
    return (
      <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-indigo-600 hover:text-indigo-800 flex items-center transition-colors duration-200"
        >
          <svg
            className="w-6 h-6 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-semibold">Back</span>
        </button>
        <div className="text-center text-red-500 p-6 bg-white rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-2">Category Not Found</h2>
          <p>The category "{categoryTitle}" is not available. Please check back or explore other options.</p>
        </div>
      </div>
    );
  }

  // Handle both "details" and "catagory" fields in JSON
  const details = categoryData.details || categoryData.catagory;

  if (!details) {
    return (
      <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-indigo-600 hover:text-indigo-800 flex items-center transition-colors duration-200"
        >
          <svg
            className="w-6 h-6 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-semibold">Back</span>
        </button>
        <div className="text-center text-red-500 p-6 bg-white rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-2">Details Not Found</h2>
          <p>No details available for "{categoryTitle}".</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-indigo-600 hover:text-indigo-800 flex items-center transition-colors duration-200"
      >
        <svg
          className="w-6 h-6 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
        <span className="font-semibold">Back</span>
      </button>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{categoryData.title}</h1>
        <p className="text-gray-700 mb-6">{details.description}</p>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-indigo-800 mb-2">Benefits</h2>
          <ul className="list-disc pl-5 text-gray-600">
            {details.benefits.map((benefit, idx) => (
              <li key={idx}>{benefit}</li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-indigo-800 mb-2">Drawbacks</h2>
          <ul className="list-disc pl-5 text-gray-600">
            {details.drawbacks.map((drawback, idx) => (
              <li key={idx}>{drawback}</li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-indigo-800 mb-2">Use Cases</h2>
          <ul className="list-disc pl-5 text-gray-600">
            {details.useCases.map((useCase, idx) => (
              <li key={idx}>{useCase}</li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-indigo-800 mb-2">Price Range</h2>
          <p className="text-gray-700">
            ${details.priceRange.min} - ${details.priceRange.max} {details.priceRange.currency}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CategoryDetail;