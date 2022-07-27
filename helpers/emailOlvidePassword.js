import nodemailer from 'nodemailer'; 

const emailOlvidePassword= async(datos)=>{

    const  transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
      
      const {email,nombre,token}= datos; 

      //enviar email 
      const info= await transporter.sendMail({
        from: "APV- Administrador de pacientes de Veterinaria",
        to: email,
        subject: 'Reestablece tu Password',
        text: 'Restablece tu Password',
        html: `<p>Hola: ${nombre}, has solicitado reestablecer tu password.</p>
        <p> Sigue el siguiente enlace para generar un nuevo password:
        <a href="${env.process.FRONTEND_URL}/${token}">Reestablecer Password</a> </p> 

        <p> Si tu no solicistaste, puedes ignorar este mensaje </p>
        
        `
      });

      console.log("Mensaje envaido: %s", info.messageId);

};



  export default emailOlvidePassword; 