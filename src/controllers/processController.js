
const fs = require('fs');
const pdfParse = require('pdf-parse');
const db = require('../db');

exports.processReceipt = async (req, res) => {
  try {
    const { id } = req.params;

    const fileData = await new Promise((resolve, reject) => {
      db.get(`SELECT * FROM receipt_file WHERE id = ?`, [id], (err, row) => {
        if (err) return reject(err);
        if (!row) return reject(new Error("Receipt file not found"));
        resolve(row);
      });
    });

    const dataBuffer = fs.readFileSync(fileData.file_path);
    const pdfData = await pdfParse(dataBuffer);
    const text = pdfData.text;

    const purchasedAtMatch = text.match(/(?:Date|Purchased At)[:\s]+([0-9\-\/]+ ?[0-9:APMapm]*)/);
    const merchantMatch = text.match(/(?:Merchant|Store)[:\s]+(.+)/);
    const totalMatch = text.match(/(?:Total Amount|Total)[:\s]*\$?([\d,]+\.\d{2})/);

    const purchased_at = purchasedAtMatch ? new Date(purchasedAtMatch[1]).toISOString() : null;
    const merchant_name = merchantMatch ? merchantMatch[1].trim() : null;
    const total_amount = totalMatch ? parseFloat(totalMatch[1].replace(',', '')) : null;

    let isValid = true;
    let reason = null;

    if (!purchased_at || !merchant_name || !total_amount) {
      isValid = false;
      reason = 'Missing required data in receipt.';
    }

    if (isValid) {
      await new Promise((resolve, reject) => {
        const insert = `INSERT INTO receipt (purchased_at, merchant_name, total_amount, file_path) VALUES (?, ?, ?, ?)`;
        db.run(insert, [purchased_at, merchant_name, total_amount, fileData.file_path], function (err) {
          if (err) return reject(err);
          resolve();
        });
      });
    }

    await new Promise((resolve, reject) => {
      const update = `UPDATE receipt_file SET is_valid = ?, invalid_reason = ?, is_processed = 1 WHERE id = ?`;
      db.run(update, [isValid ? 1 : 0, reason, id], function (err) {
        if (err) return reject(err);
        resolve();
      });
    });

    res.status(200).json({
      success: true,
      message: isValid
        ? 'Receipt has been processed and saved successfully.'
        : 'Receipt processed, but some required data is missing. Please review and resubmit.',
      extracted: {
        purchased_at,
        merchant_name,
        total_amount,
        is_valid: isValid,
        invalid_reason: reason || null,
      },
    });

  } catch (error) {
    console.error('Processing error:', error.message);
    res.status(500).json({
      success: false,
      message: `Server error: ${error.message}`,
    });
  }
};

