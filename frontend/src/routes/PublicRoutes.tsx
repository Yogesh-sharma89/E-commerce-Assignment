import { Navigate, Outlet } from "react-router"
import { useGetUser } from "../features/auth/hooks/server/useAuth"
import Loader from "../components/ui/loader";


const PublicRoutes = () => {

 const {data:user,isLoading} = useGetUser();

 if(isLoading){
  return(
    <Loader label="Loading..."/>
  )
 }


 if(user){
  return <Navigate to={user.role} replace/>
 }


  return (
    <>
      <Outlet/>
    </>
  )
}

export default PublicRoutes
