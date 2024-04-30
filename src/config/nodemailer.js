import nodemailer from "nodemailer"
import dotenv from 'dotenv'
import fs from 'fs'
dotenv.config()

// Función para preparar el HTML reemplazando la URL
const prepareHTML = (htmlContent, token) => {
    const urlBackend = process.env.URL_BACKEND;
    return htmlContent.replace('${process.env.URL_BACKEND}confirmar/${encodeURIComponent(token)}', `${urlBackend}confirmar/${encodeURIComponent(token)}`);
};

let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: process.env.HOST_MAILTRAP,
    port: process.env.PORT_MAILTRAP,
    auth: {
        user: process.env.USER_MAILTRAP,
        pass: process.env.PASS_MAILTRAP,
    }
});

const sendMailToUser = (userMail, token) => {

    const htmlVerificar = fs.readFileSync('./verificar_cuenta.html', 'utf8');
    const preparedHTML = prepareHTML(htmlVerificar, token);

    let mailOptions = {
        from: process.env.USER_MAILTRAP,
        to: userMail,
        subject: "Verifica tu cuenta",
        html: preparedHTML
        //html: `<p>Hola, haz clic <a href="${process.env.URL_BACKEND}confirmar/${encodeURIComponent(token)}">aquí</a> para confirmar tu cuenta.</p>`
    };
    

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Correo enviado: ' + info.response);
        }
    });
};

const sendMailToRecoveryPassword = async(userMail,token)=>{

    const htmlVerificar = fs.readFileSync('./restablecer_password.html', 'utf8');
    const preparedHTML = prepareHTML(htmlVerificar, token);

    let info = await transporter.sendMail({
    from: process.env.USER_MAILTRA,
    to: userMail,
    subject: "Correo para reestablecer tu contraseña",
    html: preparedHTML
    });
    console.log("Mensaje enviado satisfactoriamente: ", info.messageId);
}



export {
    sendMailToUser,
    sendMailToRecoveryPassword
}