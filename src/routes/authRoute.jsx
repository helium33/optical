import { lazy, Suspense } from "react";
import PageLoader from "../Component/PageLoader";
const LoginPage = lazy(() => import("../Feature/auth/Page/LoginPage"));
const SignPage = lazy(() => import("../Feature/auth/Page/SignPage"));




const authRoute = [
  {
    path: "/login",
    element: (
      <Suspense fallback={<PageLoader />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: "/signup",
    element: (
      <Suspense fallback={<PageLoader />}>
       <SignPage />
      </Suspense>
    ),
  },
];

export default authRoute;