
import { AuthLayout } from "../../Layout/AuthLayout";
import LoginForm from "../components/LoginForm";


const LoginPage = () => {



  const handleGoogleSignIn = () => {
    // Kick off your OAuth flow here
    console.log("continue with Google");
  };
   
  return(
    
      <AuthLayout>
        <LoginForm  />
      </AuthLayout>
   
  )

 
};

export default LoginPage;
