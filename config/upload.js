// config/upload.js
const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('./cloudinary') // asegúrate que este exporte cloudinary correctamente

// Configuración del almacenamiento en Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'recuerdos',               // Carpeta en tu Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png'],
    // filename opcional si quieres un nombre único
    filename: (req, file, cb) => {
      const timestamp = Date.now()
      const ext = file.originalname.split('.').pop()
      cb(null, `${timestamp}.${ext}`)
    }
  },
})

const parser = multer({ storage })
module.exports = parser
