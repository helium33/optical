import SunglassesDetail from "../Feature/product/Sunglasses/Component/SunglassessDetail";
import SunglassesPage from "../Feature/product/Sunglasses/Page/SunglassesPage";
import CardDetail from "../Feature/Public/Component'/CartDetail";
import Cart from "../Feature/Public/Pages/Cart";


const productRoute = [
  {
    path: "/sunglasses",
    element: <SunglassesPage />,
  },
  // {
  //   path: "/sunglasses/:id",
  //   element : <SunglassesDetail />,
  // },
  {
    path: "/sunglasses/:id",
    element: <CardDetail />,
  },

  {
    path: "/cart", // Separate cart route to avoid conflict
    element: <Cart />
  }
];

export default productRoute;