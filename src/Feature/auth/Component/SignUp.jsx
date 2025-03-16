import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify"; // Import react-toastify
import "react-toastify/dist/ReactToastify.css"; // Import CSS for toast

const SignUp = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false); // Loading state

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when sign-up starts

    // Basic validation: check if passwords match
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      // Simulate API call for sign-up (replace with actual API)
      const response = await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulating successful sign-up (replace with real API logic)
          if (email && password) {
            resolve("Sign Up successful!");
          } else {
            reject("Sign Up failed, please try again!");
          }
        }, 2000);
      });

      // Show success toast and redirect to home page
      toast.success(response);
      setTimeout(() => navigate("/"), 2000); // Redirect after 2 seconds
    } catch (error) {
      // Show error toast
      toast.error(error);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <h2 className="text-center text-2xl font-bold text-blue-600 mb-4">
          Sign Up for Your Optical Store
        </h2>

        {/* Sign-Up Form */}
        <form onSubmit={handleSignUp} className="space-y-4">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirmPassword" className="block text-gray-700 font-semibold mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm your password"
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading} // Disable button while loading
              className="w-full py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition duration-300"
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </div>
        </form>

        {/* Switch to Login */}
        <div className="mt-4 text-center">
          <span className="text-gray-600">Already have an account?</span>
          <button
            onClick={() => navigate("/login")}
            className="ml-2 text-blue-600 hover:text-blue-700 font-semibold"
          >
            Login
          </button>
        </div>
      </div>

      {/* Toast Container (to display toast messages) */}
      <ToastContainer />
    </div>
  );
};

export default SignUp;
