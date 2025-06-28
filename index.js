const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

const app = express();

// 🔐 Configurar CORS dinámico
const allowedOrigins = [
  'http://localhost:4200',
  'https://for-my-girl-angular-front.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Permitir solicitudes sin origen (como desde Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('❌ Origen bloqueado por política CORS: ' + origin));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🌐 Log global de todas las solicitudes
app.use((req, res, next) => {
  console.log(`📥 Petición: ${req.method} ${req.url}`);
  next();
});

// 📦 Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ Mongo conectado'))
  .catch((err) => console.error('❌ Error al conectar Mongo:', err.message));

// 📸 Rutas de fotos
const photosRouter = require('./routes/photos.routes');
console.log('🔗 Importando rutas de fotos');
app.use('/photos', photosRouter);

// 🚀 Levantar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🎧 Backend corriendo en http://localhost:${PORT}`);
});
