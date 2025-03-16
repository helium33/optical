// router.js
import { createBrowserRouter } from "react-router-dom";
import NotFound from "../Component/NotFound";
import PublicLayout from "../Feature/Public/Component'/PublicLayout";
import PublicRoutes from "./PublicRoutes";
import authRoute from "./authRoute";
import lensRoute from "./lensRoute";
import productRoute from "./productRoute";
import VoucherPage from "../Feature/Public/Pages/VoucherPage";
import eyeRoute from "./eyeRoute";


const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    errorElement: <NotFound />,
    children: [
      ...PublicRoutes,
      ...productRoute,
      ...lensRoute,
      ...eyeRoute
     
    
    ],
  
  },
  ...authRoute,
  {
    path : "/voucher",
    element : <VoucherPage />
  }
]);

export default router;