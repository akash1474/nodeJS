const nodemailer=require('nodemailer');
const sendEmail=options=>{
    //1]CREATE A TRANSPORTER
    const transporter=nodemailer.createTransport({
        service:'Gmail',
        auth:{
            user:
        }
    })
    //2]DEFINE EMAIL OPTIONS

    //3]SEND THE EMAIL WITH NODEMAILER
}