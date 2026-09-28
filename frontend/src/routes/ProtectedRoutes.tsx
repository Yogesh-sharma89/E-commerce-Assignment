import { Navigate, Outlet } from "react-router"
import { useGetUser } from "../features/auth/hooks/server/useAuth"
import Loader from "../components/ui/loader";


const ProtectedRoutes = () => {

  const {data:user,isLoading} = useGetUser();

  if(isLoading){
    return <Loader/>
  }

  if(!user){
   return <Navigate to={'/login'} replace/>
  }
  return (
    <>
      <Outlet/>
    </>
  )
}

export default ProtectedRoutes
