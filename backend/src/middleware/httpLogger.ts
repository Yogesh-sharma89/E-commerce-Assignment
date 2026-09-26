import morgan from "morgan";
import logger from "../config/logger.js";


const httpLogger = morgan((tokens,req,res)=>{

    return [
        tokens.method?.(req,res),
        tokens.url?.(req,res),
        tokens.status?.(req,res),
        `${tokens["response-time"]?.(req,res)} ms`
    ].join(" ")
},
{
    stream:{
        write:(message)=>{
            logger.info(message.trim())
        }
    }
}
)

export default httpLogger;