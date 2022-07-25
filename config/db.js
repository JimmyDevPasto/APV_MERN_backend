import mongoose from "mongoose";
import dotenv from "dotenv";

const conectarDB = async ()=>{

    try {

        const db= await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser:true,
            useUnifiedTopoLogy: true
        });

        const url= `${db.connection.host}:${db.connection.port}`;
        console.log(`Mongo BD conectado en: ${url}`);
        
    } catch (error) {
        console.log(`error: ${error.message}`);
        process.exit(1); 

    }
};

export default conectarDB;