import express from 'express';
import router from './src/routes/index.js'; 
import Initdocs from './src/pkg/libs/docs.js'
import multer from 'multer';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/uploads', express.static('src/uploads'));

Initdocs(app);

app.use('/', router);

// --- ERROR MULTER ---
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ 
      success: false, 
      message: err.message });
  }
  return res.status(500).json({ 
    success: false, 
    message: err.message });
});

app.get('/', (req, res)=>{
  res.json({
    message: 'Backend is running well',
  })
})

app.listen(8011, () => {
  console.log('Server is running on port 8080');
});