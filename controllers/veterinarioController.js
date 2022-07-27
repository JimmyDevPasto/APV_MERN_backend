import Veterinario from "../models/Veterinario.js";
import generarJWT from "../helpers/generarJWT.js";
import generarId from "../helpers/generarId.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js"


const registrar = async (req, res)=>{

   
    const {email, nombre}=req.body;

   // Prevenir usuarios duplicados 

    const existeUsuario= await Veterinario.findOne({email})

        if (existeUsuario) {
            const error = new Error('Usuario ya registrado');              
            return  res.status(400).json({msg: error.message});            
        }

    
   try {
        //guardar un nuevo veterianiro 
        const veterianiro = new Veterinario(req.body); 
        const veterinarioroGuardado= await veterianiro.save(); 

        //Enviar el email 

        emailRegistro({
            email,
            nombre,
            token: veterinarioroGuardado.token
        });

        res.json(veterinarioroGuardado);

   } catch (error) {
    console.log(error); 
   }
    
}

const perfil= (req, res)=>{
    const {veterinario} = req;
     res.json(veterinario); 
}

const confirmar = async (req, res)=>{ 
    const {token} = req.params; 
 
    const usuarioConfirmar= await Veterinario.findOne({token});
    if(!usuarioConfirmar){
        const error = new Error('Token no valido');
        return res.status(404).send({msg:error.message});
      
    }      
    try {

        usuarioConfirmar.token=null;
        usuarioConfirmar.confirmado= true;
        await usuarioConfirmar.save();    
        
        res.json({msg: 'Usuario confirmando correctamente'})
        
    } catch (error) {
        console.log(error);
    }

};

const autenticar = async (req, res)=>{ 
    const {email, password}=req.body; 

    // comprobar si el usuario existe 

        
        const usuario= await Veterinario.findOne({email}); 
        if(!usuario){
            const error = new Error('El usuario no existe');
            return res.status(403).json({msg:error.message});
         } 


    // comprobar si el usuario esta confirmado 

    if (!usuario.confirmado) {
        const error = new Error('Tu cuenta no ha sido confirmada');
            return res.status(403).json({msg:error.message});
    }

    //revisar el password del usuario 
    
    if (await usuario.comprobarPassword(password)) {
        //Autenticar 
        
        res.json({
            _id: usuario.nombre,
            nombre: usuario.nombre,
            email:usuario.email,
            token: generarJWT(usuario.id)

        }); 

    } else {
        const error = new Error('El password es incorrecto');
        return res.status(403).json({msg:error.message});; 
    }
        
}

const oldvidePassword = async (req,res)=> {
    const {email} =req.body; 
    const existeVeterinario= await Veterinario.findOne({email})
    if (!existeVeterinario) {
        const error = new Error('El usuario no existe');
        return res.status(400).json({msg:error.message});; 
    }
    try {
        existeVeterinario.token = generarId()
        await existeVeterinario.save()

        //Enviar email con instrucciones 
        
        emailOlvidePassword({
            nombre: existeVeterinario.nombre,
            email,
            token: existeVeterinario.token
        })
        res.json({msg:'Hemos enviado un email con las instrucciones'});
    } catch (error) {
        console.log(error);
    }
    
}

const comprobarToken = async (req,res)=> {
    const {token} =req.params //  info de la url
    console.log(token);

    const tokenValido= await Veterinario.findOne({token}); 
    if (tokenValido) {
        // el token es valido el usuario existe 
        res.json({msg:"token valido y el usuario existe"})
    } else {
        const error = new Error('Token no valido');
        return res.status(400).json({msg:error.message});
    }
}

const nuevoPassword = async (req,res)=> {
        const {token}= req.params;
        const {password}= req.body; 
        
        const veterinario= await Veterinario.findOne({token})
        if (!veterinario) {
            const error = new Error('Hubo un error');
            return res.status(400).json({msg:error.message});
        }

        try {
            veterinario.token= null
            veterinario.password= password
            await veterinario.save();
            res.json({msg:'Password modificado correctamente'}); 
        } catch (error) {
            console.log(error)
        }
}


const actualizarPerfil = async (req,res)=>{
    
    const veterinario = await Veterinario.findById(req.params._id); 
    if (!veterinario) {
        const error= new Error("Hubo un error");
        return res.status(400).json({msg:error.message});
    }

    const {email}= req.body;
    if (veterinario.email !== req.body.email) {
        const existeEmail= await Veterinario.findOne({email});
        if (existeEmail) {
            const error= new Error("El email ya esta en uso");
        return res.status(400).json({msg:error.message});
        }
    }
    try {
        veterinario.nombre= req.body.nombre 
        veterinario.email= req.body.email 
        veterinario.telefono= req.body.telefono 
        veterinario.web= req.body.web 

        const veterinarioActualizado= await veterinario.save()
        res.json(veterinarioActualizado)
    } catch (error) {
        console.log(error);
    }
}

const actualizarPassword = async (req, res) =>{
    // Leer los datos 
        const {id} = req.veterinario;
        const {pwd_actual,pwd_nuevo}= req.body;
    // Comprobar que el veterinario existe 
    const veterinario= await Veterinario.findById(id)
    if (!veterinario) {
        const error = new Error('Hubo un error');
        return res.status(400).json({msg:error.message});
    }

    //Comprobar su password
    if (await veterinario.comprobarPassword(pwd_actual) ) {
        //Almacenar el nuevo password
        veterinario.password= pwd_nuevo;

        await veterinario.save()
        res.json({msg: 'Password almacenado correctamente'})
        
        
    } else {
        const error = new Error('El password actual es incorrecto');
        return res.status(400).json({msg:error.message});
    }

    

}

export { 
    registrar,
    perfil,
    confirmar,
    autenticar,
    oldvidePassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword
}