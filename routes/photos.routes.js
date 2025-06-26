const express = require('express');
const Photo = require('../models/Photo');
const parser = require('../config/upload');
const cloudinary = require('../config/cloudinary');
const multer = require('multer');

const router = express.Router();

// Usar memoria para multer (no guarda en disco)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ GET - Listar todas las fotos
router.get('/', async (req, res) => {
  try {
    const photos = await Photo.find().sort({ createdAt: -1 });
    res.status(200).json(photos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las fotos: ' + error.message });
  }
});

// ✅ GET - Obtener una sola foto por ID
router.get('/:id', async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) {
      return res.status(404).json({ error: 'Foto no encontrada' });
    }
    res.status(200).json(photo);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la foto: ' + error.message });
  }
});

// ✅ POST - Subir una imagen con fecha personalizada
router.post('/', upload.single('image'), async (req, res) => {
  console.log('🔄 Iniciando POST /');

  try {
    console.log('📦 req.body:', req.body);
    console.log('🖼️ req.file:', req.file);

    const { title, description, date } = req.body;
    const parsedDate = new Date(date);

    if (!req.file) {
      console.log('❌ No se recibió archivo');
      return res.status(400).send('No hay archivo');
    }

    cloudinary.uploader.upload_stream(
      { folder: 'for-my-girl' },
      async (error, result) => {
        if (error) {
          console.error('🚫 Error al subir a Cloudinary:', error.message);
          return res.status(500).send('Error al subir a Cloudinary: ' + error.message);
        }

        console.log('✅ Imagen subida a Cloudinary:', result.secure_url);
        console.log('📝 Guardando en Mongo con:', {
          title,
          description,
          date: new Date(date),
          imgUrl: result.secure_url
        });

        const photo = new Photo({
          title,
          description,
          imgUrl: result.secure_url,
          date: new Date(date)
        });

        await photo.save();
        console.log('📅 Fecha personalizada recibida:', date);
        console.log('📅 Fecha parseada:', parsedDate);
        console.log('📸 Foto guardada correctamente en MongoDB');
        res.status(201).json(photo);
      }
    ).end(req.file.buffer);
  } catch (err) {
    console.error('🔥 Error general en el POST /:', err.message);
    res.status(500).send('Error al crear la foto: ' + err.message);
  }
});
//EDITOR CON PETICION PUT
  router.put('/:id', async (req, res) => {
    try {
      const { title, description, date } = req.body;
      const updatedPhoto = await Photo.findByIdAndUpdate(
        req.params.id,
        { title, description, date: new Date(date) },
        { new: true }
      );

      if (!updatedPhoto) {
        return res.status(404).json({ error: 'Foto no encontrada' });
      }

      res.status(200).json(updatedPhoto);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar la foto: ' + error.message });
    }
  });

  // ✅ DELETE - Eliminar una foto por ID
  router.delete('/:id', async (req, res) => {
    try {
      const deletedPhoto = await Photo.findByIdAndDelete(req.params.id);
      if (!deletedPhoto) return res.status(404).json({ error: 'Foto no encontrada' });

      res.status(200).json({ message: 'Foto eliminada con éxito', data: deletedPhoto });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar la foto: ' + error.message });
    }
  });

  module.exports = router;
