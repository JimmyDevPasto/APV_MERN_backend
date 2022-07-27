import express from "express";
import dotenv from 'dotenv';
import cors from 'cors';
import conectarDB from "./config/db.js";
import veterinarioRoutes from "./routes/veterinarioRoutes.js";
import pacienteRoutes from "./routes/pacienteRoutes.js"

const app = express();
app.use(express.json());
dotenv.config(); 
conectarDB();

// const dominiosPermitidos= [process.env.FRONTEND_URL];

// const corsOptions= {
//     origin:function (origin,callback) {
//         if (dominiosPermitidos.indexOf(origin) !==-1) {
//             //El orignes del Request esta permitido 
//             callback(null, true)
//         }else {
//             callback(new Error('No permitido por Cors'))
//         }
//     }
// }

//  app.use(cors(corsOptions)); 

app.use(cors({
    origin: '*'
    }));
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods','GET, PUT, POST, DELETE, OPTIONS');
    res.header('Allow','GET, PUT, POST, DELETE, OPTIONS');
    next();
    });

// app.use((req, res, next) => {
//     res.set("Access-Control-Allow-Credentials", "true");
//     res.set("Access-Control-Allow-Origin", "https://dashing-dusk-568d55.netlify.app");
//     res.set("Access-Control-Allow-Headers", "Content-Type");
//     res.set("Access-Control-Allow-Methods", "OPTIONS,GET,PUT,POST,DELETE");
//     next();
//   });
app.use("/api/veterinarios",veterinarioRoutes);
app.use("/api/pacientes",pacienteRoutes);

const PORT = process.env.PORT || 4000 
app.listen(PORT,()=>{
    console.log(`Servidor funcionando en el puerto  ${PORT}`);
}); 

