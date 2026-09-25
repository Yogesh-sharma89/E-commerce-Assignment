import dotenv from "dotenv";

dotenv.config();

const EnvConfig = {
    environment : process.env.NODE_ENV,
    port:process.env.PORT,
    db:{
        url:process.env.DATABASE_URL
    },
    token:{
        access:process.env.ACCESS_TOKEN_SECRET,
        refresh:process.env.REFRESH_TOKEN_SECRET
    }
}

export default EnvConfig;