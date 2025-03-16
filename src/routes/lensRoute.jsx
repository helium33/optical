import CategoryDetail from "../Feature/product/Lens/Component/CatagoryDetail";

import LensPage from "../Feature/product/Lens/Pages/LensPage";
import CardDetail from "../Feature/Public/Component'/CartDetail";
 // Same CardDetail import
import Cart from "../Feature/Public/Pages/Cart";
import VoucherPage from "../Feature/Public/Pages/VoucherPage";

const lensRoute = [
  {
    path: "/lenses",
    element: <LensPage />,
  },
//   {
//     path : "/lenses/:id",
//     element : <LensDetailPage />
//   },
  {
    path: "/lenses/:id",
    element: <CardDetail />,
  },
  {
    path : "/voucher",
    element : <VoucherPage />
  },
  
  {
    path: "/cart", // Same cart route, will be deduplicated in router
    element: <Cart />,
  },
  {
    path: "/learn/:category", // Matches Lens links like /learn/bifocal-lenses
    element: <CategoryDetail />,
  },


];

export default lensRoute;