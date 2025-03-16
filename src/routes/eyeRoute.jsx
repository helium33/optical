import { lazy } from 'react';
import CartDetail from "../Feature/Public/Component'/CartDetail";
import Cart from "../Feature/Public/Pages/Cart";

const EyeGlassesPage = lazy(() => import("../Feature/EyeGlasses/Page/EyeGlassesPage"));


const eyeRoute = [
    {
        path: "/eyeglasses",
        element: <EyeGlassesPage />
      },
      // {
      //   path: "/sunglasses/:id",
      //   element : <SunglassesDetail />,
      // },
      {
        path: "/eyeglasses/:id",
        element: <CartDetail />
      },
    
      {
        path: "/cart", // Separate cart route to avoid conflict
        element: <Cart/>
      }
]
export default eyeRoute