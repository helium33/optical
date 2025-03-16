import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import useSWR from "swr";
import { toast } from "react-hot-toast";
import { MinusCircle, PlusCircle, Trash2, ArrowLeft, Star } from "lucide-react";
import PageLoader from "../../../Component/PageLoader";
import useCartStore from "../../../Store/UseCartStore";
import useVoucherStore from "../../../Store/UseVoucherStore";

const fetcher = async (url) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP error! Status: ${res.status}`);
  }
  return res.json();
};

const getColorStyle = (color) => {
  const colorMap = {
    clear: "transparent",
    amber: "#ffbf00",
    gray: "#808080",
    "light gray": "#d3d3d3",
    "yellow tint": "#ffff99",
    "light blue": "#add8e6",
    "clear to gray": "linear-gradient(to right, transparent, #808080)",
    "clear to brown": "linear-gradient(to right, transparent, #8b4513)",
    "clear to dark gray": "linear-gradient(to right, transparent, #404040)",
    "clear to green": "linear-gradient(to right, transparent, #006400)",
    "clear to black": "linear-gradient(to right, transparent, #000000)",
    brown: "#8b4513",
    green: "#006400",
    black: "#000000",
    navy: "#000080",
    gold: "#ffd700",
    silver: "#c0c0c0",
    pink: "#ffc1cc",
    white: "#ffffff",
    "light tortoise": "#d2a679",
    tortoise: "#8b5a2b",
    blue: "#0000ff",
    purple: "#800080",
    rose: "#ff007f",
    "matte black": "#1a1a1a",
    olive: "#808000",
    bronze: "#cd7f32",
    gunmetal: "#2a3439",
    "rose gold": "#b76e79",
    "mettle black": "#1c2526",
  };
  return colorMap[color.toLowerCase()] || color.toLowerCase();
};

const CartDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [mainImage, setMainImage] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const { cart, addToCart, decreaseQuantity, increaseQuantity, removeFromCart, updateStock } = useCartStore();
  const setLensData = useVoucherStore((state) => state.setLensData);
  const setProductData = useVoucherStore((state) => state.setProductData);

  // Determine the type based on the URL path
  const type = location.pathname.includes("lenses")
    ? "lens"
    : location.pathname.includes("eyeglasses")
    ? "eyeglasses"
    : "products";
  const apiEndpoint = id ? `http://localhost:3001/${type}/${id}` : null;
  const { data: item, error, isLoading } = useSWR(apiEndpoint, fetcher);

  useEffect(() => {
    if (item && item.image) {
      setMainImage(Array.isArray(item.image) ? item.image[0] : item.image);
    }
  }, [item]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const handleAddToCart = () => {
    if (!item) return;
    if (item.stock === 0) {
      toast.error(`${item.name} is out of stock!`, { position: "top-right" });
      return;
    }
    addToCart(item, type);
    updateStock(item.id, type, item.stock - 1);
    toast.success(`${item.name} added to cart!`, { position: "top-right" });
  };

  const handleIncreaseQuantity = (cartItem) => {
    if (cartItem.quantity >= cartItem.stock) {
      toast.error(`Cannot add more than ${cartItem.stock} items!`, { position: "top-right" });
      return;
    }
    increaseQuantity(cartItem.id, cartItem.type);
    updateStock(cartItem.id, cartItem.type, cartItem.stock - 1);
  };

  const handleDecreaseQuantity = (cartItem) => {
    if (cartItem.quantity === 1) {
      toast.error(`Minimum quantity is 1!`, { position: "top-right" });
      return;
    }
    decreaseQuantity(cartItem.id, cartItem.type);
    updateStock(cartItem.id, cartItem.type, cartItem.stock + 1);
  };

  const handleRemoveFromCart = (cartItem) => {
    removeFromCart(cartItem.id, cartItem.type);
    updateStock(cartItem.id, cartItem.type, cartItem.stock + cartItem.quantity);
    toast.success(`${cartItem.name} removed from cart!`, { position: "top-right" });
  };

  const calculateTotal = () => {
    return cart.reduce((total, cartItem) => total + cartItem.price * cartItem.quantity, 0).toFixed(2);
  };

  const handleBuyNow = () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty!", { position: "top-right" });
      return;
    }

    const totalPrice = calculateTotal();

    if (type === "lens") {
      setLensData({
        name: item.name,
        price: parseFloat(totalPrice),
        finalPrice: parseFloat(totalPrice),
      });
    } else {
      setProductData({
        name: item.name,
        price: parseFloat(totalPrice),
        finalPrice: parseFloat(totalPrice),
      });
    }

    toast.success(`Proceeding to checkout with total: $${totalPrice}`, { position: "top-right" });
    navigate("/voucher");
  };

  if (isLoading) return <PageLoader />;
  if (error) return <div className="text-red-500 text-center text-xl">Failed to load data: {error.message}</div>;

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      {id && item && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <button
            onClick={() => navigate(`/${type === "lens" ? "lenses" : type === "eyeglasses" ? "eyeglasses" : "sunglasses"}`)}
            className="mb-6 text-indigo-600 hover:text-indigo-800 flex items-center transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="font-semibold">
              Back to {type === "lens" ? "Lenses" : type === "eyeglasses" ? "Eyeglasses" : "Sunglasses"}
            </span>
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="relative w-full max-w-md mx-auto aspect-square overflow-hidden rounded-xl">
                <img
                  src={mainImage}
                  alt={item.name}
                  className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                />
              </div>
              {Array.isArray(item.image) && item.image.length > 1 && (
                <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
                  {item.image.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setMainImage(img)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        mainImage === img ? "border-indigo-500 ring-2 ring-indigo-200" : "border-gray-200 hover:border-indigo-300"
                      }`}
                    >
                      <img src={img} alt={`${item.name} view ${idx + 1}`} className="w-[500px] h-[500px] object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-800 mb-2">{item.name}</h1>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < (item.star || 0) ? "fill-current" : "fill-gray-200"}`}
                      />
                    ))}
                  </div>
                  {item.star && <span className="text-gray-500">({item.star})</span>}
                </div>
                <p className="text-3xl font-bold text-indigo-600">${item.price.toFixed(2)}</p>
              </div>

              {item.description && (
                <div className="prose prose-indigo">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              )}

              {(item.color || item.colors) && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {type === "lens" ? "Lens Colors" : "Frame Colors"}
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {(item.colors || [item.color]).map((color, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedColor(color)}
                        className={`w-10 h-10 rounded-full border-2 transition-all ${
                          selectedColor === color
                            ? "border-indigo-500 ring-2 ring-indigo-200"
                            : "border-gray-200 hover:border-indigo-300"
                        }`}
                        // style={{ background: getColorStyle(color) }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${item.stock > 0 ? "bg-green-500" : "bg-red-500"}`} />
                  <span className={`text-lg ${item.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                    {item.stock > 0 ? `${item.stock} in stock` : "Out of stock"}
                  </span>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={item.stock === 0}
                  className={`w-full py-4 px-6 rounded-xl text-white font-semibold transition-all ${
                    item.stock > 0
                      ? "bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-indigo-200"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  {item.stock > 0 ? "Add to Cart" : "Out of Stock"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Shopping Cart</h2>
        {cart.length > 0 ? (
          <>
            <ul className="space-y-4">
              {cart.map((cartItem) => (
                <li
                  key={`${cartItem.id}-${cartItem.type}`}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                      <img
                        src={Array.isArray(cartItem.image) ? cartItem.image[0] : cartItem.image}
                        alt={cartItem.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{cartItem.name}</h3>
                      <p className="text-indigo-600 font-medium">${cartItem.price.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">
                        {cartItem.type === "lens" ? "Lens" : cartItem.type === "eyeglasses" ? "Eyeglasses" : "Frame"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDecreaseQuantity(cartItem)}
                        className="text-gray-500 hover:text-indigo-600 transition-colors"
                      >
                        <MinusCircle className="w-6 h-6" />
                      </button>
                      <span className="w-8 text-center font-medium">{cartItem.quantity}</span>
                      <button
                        onClick={() => handleIncreaseQuantity(cartItem)}
                        className="text-gray-500 hover:text-indigo-600 transition-colors"
                      >
                        <PlusCircle className="w-6 h-6" />
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemoveFromCart(cartItem)}
                      className="text-red-500 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-6 h-6" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8 space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-xl font-semibold">${calculateTotal()}</span>
              </div>

              <Link
                to="/voucher"
                onClick={handleBuyNow}
                className="block w-full py-4 px-6 bg-indigo-600 text-white text-center font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200"
              >
                Proceed to Checkout
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Your cart is empty</p>
            <Link
              to={`/${type === "lens" ? "lenses" : type === "eyeglasses" ? "eyeglasses" : "sunglasses"}`}
              className="mt-4 inline-block text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDetail;