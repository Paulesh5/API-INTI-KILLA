import nodemailer from "nodemailer"
import dotenv from 'dotenv'
import fs from 'fs'
dotenv.config()

// Función para preparar el HTML reemplazando la URL
const prepareHTML = (htmlContent, token) => {
    const urlBackend = process.env.URL_BACKEND;
    return htmlContent.replace('${process.env.URL_BACKEND}confirmar/${encodeURIComponent(token)}', `${urlBackend}confirmar/${encodeURIComponent(token)}`);
};

const prepareHTMLEmpleado = (htmlContent, token) => {
    const urlBackend = process.env.URL_BACKEND;
    return htmlContent.replace('${process.env.URL_BACKEND}empleado/confirmar/${encodeURIComponent(token)}', `${urlBackend}empleado/confirmar/${encodeURIComponent(token)}`);
};

const prepareHTMLPassword = (htmlContent, token) => {
    const urlBackend = process.env.URL_BACKEND;
    return htmlContent.replace('${process.env.URL_BACKEND}recuperar-password/${encodeURIComponent(token)}', `${urlBackend}recuperar-password/${encodeURIComponent(token)}`);
};

const prepareHTMLPasswordEmpleado = (htmlContent, token) => {
    return htmlContent.replace('${token}', token);
};

const prepareHTMLUsername = (htmlContent, username) => {
    return htmlContent.replace('${username}', username);
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

    const htmlVerificar = fs.readFileSync('src/config/verificar_cuenta.html', 'utf8');
    const preparedHTML = prepareHTML(htmlVerificar, token);

    let mailOptions = {
        from: `INTI-KILLA ${process.env.USER_MAILTRAP}`,
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

    const htmlRestablecer = fs.readFileSync('src/config/restablecer_password.html', 'utf8');
    const preparedHTMLPassword = prepareHTMLPassword(htmlRestablecer, token);

    let info = await transporter.sendMail({
    from: `INTI-KILLA ${process.env.USER_MAILTRAP}`,
    to: userMail,
    subject: "Correo para reestablecer tu contraseña",
    html: preparedHTMLPassword
    });
    console.log("Mensaje enviado satisfactoriamente: ", info.messageId);
}

// Función para enviar correo electrónico de recuperacion de username
const sendMailToRecoveryUsername = async(username, userMail) => {
    const htmlRecuperarUsuario = fs.readFileSync('src/config/recuperar_username.html', 'utf8');
    const preparedHTMLUsername = prepareHTMLUsername(htmlRecuperarUsuario, username);

    let info = await transporter.sendMail({
        from: `INTI-KILLA ${process.env.USER_MAILTRAP}`,
        to: userMail,
        subject: "Recuperación de nombre de usuario",
        html: preparedHTMLUsername
    });
    console.log("Mensaje enviado satisfactoriamente: ", info.messageId);
}

const sendMailToEmpleado = (userMail, token) => {

    const htmlVerificar = fs.readFileSync('../config/verificar_cuenta_empleado.html', 'utf8');
    const preparedHTML = prepareHTMLEmpleado(htmlVerificar, token);

    let mailOptions = {
        from: `INTI-KILLA ${process.env.USER_MAILTRAP}`,
        to: userMail,
        subject: "Verifica tu cuenta",
        html: preparedHTML
    };
    

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Correo enviado: ' + info.response);
        }
    });
};

const sendMailToRecoveryPasswordEmpleado = async(userMail,token)=>{

    const htmlRestablecer = fs.readFileSync('src/config/restablecer_password_empleado.html', 'utf8');
    const preparedHTMLPassword = prepareHTMLPasswordEmpleado(htmlRestablecer, token);

    let info = await transporter.sendMail({
    from: `INTI-KILLA ${process.env.USER_MAILTRAP}`,
    to: userMail,
    subject: "Correo para reestablecer tu contraseña",
    html: preparedHTMLPassword
    });
    console.log("Mensaje enviado satisfactoriamente: ", info.messageId);
}

// Función para enviar correo electrónico de recuperacion de username
const sendMailToRecoveryUsernameEmpleado = async(username, userMail) => {
    const htmlRecuperarUsuario = fs.readFileSync('src/config/recuperar_username_empleado.html', 'utf8');
    const preparedHTMLUsername = prepareHTMLUsername(htmlRecuperarUsuario, username);

    let info = await transporter.sendMail({
        from: `INTI-KILLA ${process.env.USER_MAILTRAP}`,
        to: userMail,
        subject: "Recuperación de nombre de usuario",
        html: preparedHTMLUsername
    });
    console.log("Mensaje enviado satisfactoriamente: ", info.messageId);
}


export {
    sendMailToUser,
    sendMailToRecoveryPassword,
    sendMailToRecoveryUsername,
    sendMailToEmpleado,
    sendMailToRecoveryPasswordEmpleado,
    sendMailToRecoveryUsernameEmpleado
}