import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import RoleRoute from "./RoleRoute";
import PublicRoute from "./PublicRoutes";
import ProtectedRoute from "./ProtectedRoutes";
import Loader from "../components/ui/loader";

//public-routes
const LoginPage = lazy(() => import("../features/auth/ui/pages/Login"));
const SignupPage = lazy(() => import("../features/auth/ui/pages/Signup"));
const UserDashboardPage = lazy(
  () => import("../features/Dashboard/user/ui/pages/UserDashboard"),
);
const ProductDetailPage = lazy(
  () => import("../features/Dashboard/user/ui/components/ProductDetailPage"),
);
const UserLayout = lazy(
  () => import("../features/Dashboard/user/layout/UserLayout"),
);
const SellerDashboardPage = lazy(
  () => import("../features/Dashboard/seller/ui/pages/SellerDashboard"),
);

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
            element: (
              <Suspense fallback={<Loader label="Loading storefront..." />}>
                <UserLayout />
              </Suspense>
            ),
            children: [
              {
                index: true,
                element: (
                  <Suspense fallback={<Loader label="Loading products..." />}>
                    <UserDashboardPage />
                  </Suspense>
                ),
              },
              {
                path: "products/:id",
                element: (
                  <Suspense fallback={<Loader label="Loading product..." />}>
                    <ProductDetailPage />
                  </Suspense>
                ),
              },
            ],
          },
        ],
      },
      {
        element: <RoleRoute allowed={["seller"]} />,
        children: [
          {
            path: "/seller",
            element: (
              <Suspense
                fallback={<Loader label="Loading seller dashboard..." />}
              >
                <SellerDashboardPage />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
]);

const AppRoutes = () => {
  return <RouterProvider router={routes} />;
};

export default AppRoutes;
