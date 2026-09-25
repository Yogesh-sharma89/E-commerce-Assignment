import app from "./app.js";
import ConnectDb from "./config/db.js";
import EnvConfig from "./config/env.config.js";

const port = EnvConfig.port || 3000;

const InitializeConnection = async () => {
    try {

        await ConnectDb();

        app.listen(port, () => {
            console.log("Server is listening on port ", port);
        })

    } catch (err) {
       console.log("Error in main server :",err);
       process.exit(1);  
    }
}

InitializeConnection();

