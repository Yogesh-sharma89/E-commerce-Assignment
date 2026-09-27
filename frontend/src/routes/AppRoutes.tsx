import { lazy, Suspense } from "react";
import {createBrowserRouter, Navigate, RouterProvider} from "react-router";


const PublicRoute = lazy(()=>import("../routes/PublicRoutes"))
const ProtectedRoute = lazy(()=>import("../routes/ProtectedRoutes"));

const Loader = lazy(()=>import("../components/ui/loader"))

//public-routes
const LoginPage = lazy(()=>import("../features/auth/ui/pages/Login"))
const SignupPage = lazy(()=>import("../features/auth/ui/pages/Signup"))

const AppRoutes = () => {

  const routes = createBrowserRouter([
    {
        path:"/",
        element:<PublicRoute/>,
        children:[
            {
                path:"login",
                element:<Suspense fallback={<Loader label="Loading Login Page"/>}>
                    <LoginPage/>
                </Suspense>
            },
            {
                path:"signup",
                element:<Suspense fallback={<Loader label="Loading register page..."/>}>
                    <SignupPage/>
                </Suspense>
            }
        ]
    },
    {
        path:"",
        element:<ProtectedRoute/>,
        children:[
            {
                path:"",
                element:<Navigate to={'/dashboard'} replace/>
            },
            {
                path:"dashboard",
                element:
            }
        ]
    }
  ])

  return (
    <RouterProvider router={routes}/>
  )
}

export default AppRoutes
