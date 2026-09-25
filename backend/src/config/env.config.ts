import dotenv from "dotenv";

dotenv.config();

const EnvConfig = {
    environment : process.env.NODE_ENV,
    port:process.env.PORT,
    db:{
        url:process.env.DATABASE_URL
    }
}

export default EnvConfig;