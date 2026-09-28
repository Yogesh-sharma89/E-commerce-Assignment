import { Navigate, Outlet, useLocation } from "react-router";
import { useGetUser } from "../features/auth/hooks/server/useAuth";
import Loader from "../components/ui/loader";

type Role = "user" | "seller"

interface roleRouteProps{
    allowed:Role[]
}

const RoleRoute = ({allowed}:roleRouteProps) => {

   const location = useLocation();

   const {data:user,isLoading} = useGetUser();

   if(isLoading){
    return <Loader/>
   }

   if(!user){
    return <Navigate to={'/login'} replace state={{from:location}}/>
   }

   if(!allowed.includes(user?.role)){
     return <Navigate to={user.role} replace />;
   }

  return (
    <Outlet/>
  )
}

export default RoleRoute
