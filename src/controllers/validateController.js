
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const dbPath = path.resolve(__dirname, '../database/receipts.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to connect to the database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

exports.validateFile = async (req, res) => {
  try {

    const contentType = req.headers['content-type'] || '';

    if (contentType.includes('multipart/form-data')) {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Please upload a file.',
        });
      }

      const file = req.file;

      const allowedTypes = ['application/pdf'];
      if (!allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({
          success: false,
          message: 'Only PDF files are allowed.',
        });
      }

      if (file.size === 0) {
        return res.status(400).json({
          success: false,
          message: 'Uploaded file is empty.',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'File is valid!',
        fileInfo: {
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
        },
      });
    }


    const { file_id, is_valid, invalid_reason } = req.body;

    if (!file_id || typeof is_valid !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'file_id and is_valid (as boolean) are required.',
      });
    }

    db.get('SELECT * FROM receipt_file WHERE id = ?', [file_id], (err, row) => {
      if (err) {
        console.error('DB Error:', err.message);
        return res.status(500).json({
          success: false,
          message: 'Database error occurred while fetching file.',
        });
      }

      if (!row) {
        return res.status(404).json({
          success: false,
          message: 'File not found with the provided file_id.',
        });
      }

      const filePath = row.file_path;

      if (!filePath || !fs.existsSync(filePath)) {
        return res.status(404).json({
          success: false,
          message: 'File does not exist at the specified path.',
        });
      }

      const ext = path.extname(filePath).toLowerCase();
      if (ext !== '.pdf') {
        return res.status(400).json({
          success: false,
          message: 'Only PDF files are allowed.',
        });
      }

      const reason = is_valid ? null : invalid_reason || 'Invalid file';

      db.run(
        `UPDATE receipt_file 
         SET is_valid = ?, invalid_reason = ?, is_processed = 1, updated_at = CURRENT_TIMESTAMP 
         WHERE id = ?`,
        [is_valid ? 1 : 0, reason, file_id],
        function (err) {
          if (err) {
            console.error('DB Update Error:', err.message);
            return res.status(500).json({
              success: false,
              message: 'Failed to update validation status in DB.',
            });
          }

          return res.status(200).json({
            success: true,
            message: 'File validation updated successfully.',
          });
        }
      );
    });
  } catch (error) {
    console.error('Validation error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during file validation.',
    });
  }
};
