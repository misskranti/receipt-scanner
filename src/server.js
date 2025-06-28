
const express = require('express');
const multer = require('multer');
const path = require('path');
const routes = require('./routes');
const app = express();
const PORT = 3000;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../database/uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  if (ext === '.pdf' && mime === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

const upload = multer({ storage, fileFilter });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', routes(upload));
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError || err.message === 'Only PDF files are allowed') {
    return res.status(400).json({ success: false, error: err.message });
  }
  next(err);
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
