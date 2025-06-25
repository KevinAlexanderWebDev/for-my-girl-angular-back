const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log global de todas las solicitudes
app.use((req, res, next) => {
  console.log(`📥 Petición: ${req.method} ${req.url}`);
  next();
});

// Conexión Mongo
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ Mongo conectado'))
  .catch((err) => console.error('❌ Error al conectar Mongo:', err.message));

// Rutas
const photosRouter = require('./routes/photos.routes');
console.log('🔗 Importando rutas de fotos');
app.use('/photos', photosRouter);

// Levantar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Backend corriendo en http://localhost:${PORT}`);
});
