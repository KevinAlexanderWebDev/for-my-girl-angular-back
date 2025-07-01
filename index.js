const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

const app = express();

// 🔐 Configurar CORS dinámico para producción, localhost y previews de Vercel
const allowedOrigins = [
  'http://localhost:4200',
  'https://for-my-girl-angular-front.vercel.app',
  /^https:\/\/for-my-girl-angular-front.*\.vercel\.app$/ // previews
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // Permitir tools como Postman

    const isAllowed = allowedOrigins.some(allowed =>
      typeof allowed === 'string'
        ? allowed === origin
        : allowed instanceof RegExp
        ? allowed.test(origin)
        : false
    );

    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn('❌ Origen bloqueado por CORS:', origin);
      callback(null, false);
    }
  },
  credentials: true
}));

// 📦 Middlewares
app.use(express.json({}));
app.use(express.urlencoded({ extended: true }));

// 🌐 Log global
app.use((req, res, next) => {
  console.log(`📥 Petición: ${req.method} ${req.url}`);
  next();
});

// 📡 Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ Mongo conectado'))
  .catch((err) => console.error('❌ Error al conectar Mongo:', err.message));

// 🖼️ Rutas de fotos
const photosRouter = require('./routes/photos.routes');
console.log('🔗 Importando rutas de fotos');
app.use('/photos', photosRouter);

// 🚀 Arranque del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🎧 Backend corriendo en http://localhost:${PORT}`);
});
