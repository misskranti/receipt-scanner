const path = require('path');
const db = require('../db');

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please choose a file to upload.',
      });
    }

    const ext = path.extname(req.file.originalname).toLowerCase();
    const mime = req.file.mimetype;

    if (ext !== '.pdf' || !mime.includes('pdf')) {
      return res.status(400).json({
        success: false,
        message: 'Only PDF files are allowed. Please select a PDF file.',
      });
    }

    const fileName = req.file.filename;
    const filePath = req.file.path;

    const insertQuery = `
      INSERT INTO receipt_file (file_name, file_path)
      VALUES (?, ?)
    `;

    const result = await new Promise((resolve, reject) => {
      db.run(insertQuery, [fileName, filePath], function (err) {
        if (err) return reject(err);
        resolve({ id: this.lastID });
      });
    });

    res.status(200).json({
      success: true,
      message: 'Receipt uploaded successfully!',
      receipt: {
        id: result.id,
        filename: fileName,
        filepath: filePath,
      },
    });

  } catch (error) {
    console.error('Upload error:', error.message);
    res.status(500).json({
      success: false,
      message: `Server error: ${error.message}`,
    });
  }
};

