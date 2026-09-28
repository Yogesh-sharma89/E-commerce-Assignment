import { ToastContainer } from "../components/ui/toaster"
import AppRoutes from "../routes/AppRoutes"


const AppProvider = () => {
  return (
    <>
     <ToastContainer/>

     <AppRoutes/>
      
    </>
  )
}

export default AppProvider
