const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../database/receipts.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Could not connect to database', err);
  } else {
    console.log('Connected to SQLite database');

    db.all(`PRAGMA table_info(receipt_file);`, (err, columns) => {
      if (err) {
        console.error('Failed to read table info:', err.message);
        return;
      }else{
        console.log('Table info retrieved successfully');
      }


    });
  }
});

module.exports = db;
