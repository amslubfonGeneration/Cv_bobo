import fastifyFormbody from "@fastify/formbody"
import fastify from "fastify"
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import {fileURLToPath} from 'node:url'
import {dirname, join} from 'node:path'
import fastifyStatic from "@fastify/static"
import fastifyCookie from "@fastify/cookie"

const rootDir = dirname(fileURLToPath(import.meta.url))

dotenv.config({
    path: join(rootDir, 'file.env'),
    debug: true,
    encoding: 'utf8'
})
/*const email_to = process.env.EMAIL_TO
const email_user = process.env.EMAIL_USER
const email_pass = process.env.EMAIL_PASS*/

const host = ("RENDER" in process.env) ? `0.0.0.0` : `localhost`;

const app = fastify({logger:true})
app.register(fastifyFormbody)
app.register(fastifyStatic, {
    root:join(rootDir,'public')
})
app.register(fastifyCookie)
const transporte = nodemailer.createTransport({
  service: 'gmail',
  host:'smtp.gmail.com',
  port: 587,
  secure:false,
  auth: {
    user: email_user,
    pass: email_pass,
  },
})
app.get('/', async (req, res)=>{
  res.redirect('cv.html')
})
app.post('/register', async (req, res) => {
    const { name,email,message } = req.body
    try {
    // Envoyer un e-mail avec Nodemailer
    await transporte.sendMail({
        from: `"Formulaire de contact CV EEIA" <${email_user}>`,
        to: email_to,
        subject: 'Contact support CV EEIA', // Sujet de l'e-mail
            text: `Nom et Prénoms: ${name}\nContact/Email: ${email}\nMessage: ${message}`, // Contenu en texte brut
            html: `<p><strong>Matricule:</strong> ${name}</p>
                    <p><strong>Contact/Email:</strong> ${email}</p>
                    <p><strong>Message:</strong> ${message}</p>`
    });
    return res.redirect('/')
    }catch (error) {
      return res.redirect('error.html')
    }
})


app.listen({host: host, port: 8000 }, function (err, address) {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }
})