const db = require('../db'); 

exports.getAllReceipts = (req, res) => {
  const query = 'SELECT * FROM receipt_file';
  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json({ receipts: rows });
  });
};

exports.getReceiptById = (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM receipt_file WHERE id = ?';
  db.get(query, [id], (err, row) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (!row) return res.status(404).json({success:true, message: 'Receipt not found' });
    res.json({ receipt: row });
  });
};
