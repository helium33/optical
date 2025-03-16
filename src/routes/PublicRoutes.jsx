import { lazy } from 'react';
import Cart from '../Feature/Public/Pages/Cart';
import CardDetail from '../Feature/Public/Component\'/CartDetail';
import VoucherPage from "../Feature/Public/Pages/VoucherPage";
import VoucherDetailPage from '../Feature/Public/Pages/VoucherDetailPage';


const ContactUsPage = lazy(() => import("../Feature/Public/Pages/ContactUsPage"));
const Feature = lazy(() => import("../Feature/Public/Pages/Feature"));
const HomePage = lazy(() => import("../Feature/Public/Pages/HomePage"));


const PublicRoutes = [
    {
        index : true,
        element : <HomePage />
    },
    {
        path :"/features/:id" ,
        element :<Feature />
    },
    {
        path : "/sunglasses/: id" ,
        element : <CardDetail />
    },
    {
        path : "/cart/:id",
        element : <Cart />
    },
    {
        path : "/voucher",
        element : <VoucherPage />
      },
      {
        path : '/voucher/:id',
        element : <VoucherDetailPage />
      },
      {
        path : '/faq',
        element : <ContactUsPage />
      },
    {
        path : '/Contact-us',
        element : <ContactUsPage />
    }

];
export default PublicRoutes;