import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import RoleRoute from "./RoleRoute";
import UserDashboardPage from "../features/Dashboard/user/ui/pages/UserDashboard";
import PublicRoute from "./PublicRoutes";
import ProtectedRoute from "./ProtectedRoutes";
import Loader from "../components/ui/loader";
import ProductDetailPage from "../features/Dashboard/user/ui/components/ProductDetailPage";
import UserLayout from "../features/Dashboard/user/layout/UserLayout";
import SellerDashboardPage from "../features/Dashboard/seller/ui/pages/SellerDashboard";

//public-routes
const LoginPage = lazy(() => import("../features/auth/ui/pages/Login"));
const SignupPage = lazy(() => import("../features/auth/ui/pages/Signup"));


const routes = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      {
        path: "/login",
        element: (
          <Suspense fallback={<Loader label="Loading Login Page" />}>
            <LoginPage />
          </Suspense>
        ),
      },
      {
        path: "/signup",
        element: (
          <Suspense fallback={<Loader label="Loading register page..." />}>
            <SignupPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <Navigate to={"/user"} replace />,
      },
      {
        element: <RoleRoute allowed={["user"]} />,
        children: [
          {
            path: "/user",
            element: <UserLayout/>,
            children:[
                {
                    index:true,
                    element:<UserDashboardPage/>
                },
                {
                    path:"products/:id",
                    element:<ProductDetailPage/>
                }
            ]
          },
         
        ],
      },
      {
        element:<RoleRoute allowed={['seller']}/>,
        children:[
            {
                path:"/seller",
                element:<SellerDashboardPage/>
            }
        ]
      }
    ],
  },
]);

const AppRoutes = () => {
  return <RouterProvider router={routes} />;
};

export default AppRoutes;
