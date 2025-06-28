
🧾 Receipt Scanner Web Application

This project automates the extraction of key data from scanned PDF receipts using OCR (Optical Character Recognition) and stores the results in a structured SQLite database. A RESTful API allows easy uploading, validating, processing, and retrieving of receipt data.

✅ Features
Upload and validate receipt files (.pdf)

Extract essential data using OCR:

Purchase Date

Merchant Name

Total Amount

Store raw and processed data in SQLite

RESTful APIs for interacting with receipt files and metadata

Robust error handling and validation

🧠 Tech Stack
Layer	Technology
Backend	Node.js + Express
File Upload	multer
OCR	tesseract.js
PDF Parsing	pdf-parse
Database	SQLite3
Utils	fs, path, dayjs

🛠️ Getting Started
1. Install Dependencies
bash
Copy
Edit
npm install
2. Set Up SQLite Database
Create and initialize the database:

bash
Copy
Edit
sqlite3 database/receipts.db
Inside the SQLite prompt, run:

sql
Copy
Edit
-- Table for uploaded receipt metadata
CREATE TABLE receipt_file (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  file_name TEXT,
  file_path TEXT,
  is_valid INTEGER,
  invalid_reason TEXT,
  is_processed INTEGER,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Table for extracted receipt data
CREATE TABLE receipt (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  purchased_at TEXT,
  merchant_name TEXT,
  total_amount REAL,
  file_path TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
.quit
🚀 Running the App
Start the server:

bash
Copy
Edit
node src/server.js
Server runs at: http://localhost:3000

📮 API Endpoints
🔹 1. Upload Receipt
POST /api/upload

Form Field: file

Content-Type: multipart/form-data

Allowed Format: PDF

Example:

bash
Copy
Edit
curl -F "file=@receipt1.pdf" http://localhost:3000/api/upload
Response:

json
Copy
Edit
{
  "success": true,
  "message": "Receipt uploaded successfully!",
  "receipt": {
    "id": 17,
    "filename": "receipt1.pdf",
    "filepath": "D:/receipt-processor/database/uploads/receipt1.pdf"
  }
}
🔹 2. Validate Receipt
POST /api/validate

A. File Validation (Auto)
bash
Copy
Edit
curl -F "file=@receipt1.pdf" http://localhost:3000/api/validate
B. Manual Validation
POST /api/validate

Content-Type: application/json

json
Copy
Edit
{
  "file_id": 17,
  "is_valid": false,
  "invalid_reason": "Unreadable text or format"
}
Response:

json
Copy
Edit
{
  "success": true,
  "message": "File is valid!",
  "fileInfo": {
    "originalName": "receipt1.pdf",
    "mimeType": "application/pdf",
    "size": 2652
  }
}
🔹 3. Process Receipt (OCR)
POST /api/process/:fileId

Extracts key data from the uploaded file.

Stores in the receipt table.

Example:

bash
Copy
Edit
curl -X POST http://localhost:3000/api/process/1
Response:

json
Copy
Edit
{
  "success": true,
  "message": "Receipt processed, but some required data is missing. Please review and resubmit.",
  "extracted": {
    "purchased_at": null,
    "merchant_name": null,
    "total_amount": null,
    "is_valid": false,
    "invalid_reason": "Missing required data in receipt."
  }
}
🔹 4. Get All Receipts
GET /api/receipts

bash
Copy
Edit
curl http://localhost:3000/api/receipts
Response:

json
Copy
Edit
{
  "receipts": [
    {
      "id": 1,
      "file_name": "receipt1.pdf",
      "file_path": "D:/receipt-processor/database/uploads/receipt1.pdf",
      "is_valid": 0,
      "invalid_reason": "Missing required data in receipt.",
      "is_processed": 1,
      "created_at": "2025-06-28 08:46:14",
      "updated_at": "2025-06-28 08:46:14"
    }
  ]
}
🔹 5. Get Receipt by ID
GET /api/receipts/:id

bash
Copy
Edit
curl http://localhost:3000/api/receipts/1
Response:

json
Copy
Edit
{
  "receipt": {
    "id": 1,
    "file_name": "receipt1.pdf",
    "file_path": "D:/receipt-processor/database/uploads/receipt1.pdf",
    "is_valid": 0,
    "invalid_reason": "Missing required data in receipt.",
    "is_processed": 1,
    "created_at": "2025-06-28 08:46:14",
    "updated_at": "2025-06-28 08:46:14"
  }
}
🧪 Sample Data
The repository includes a pre-populated receipts.db with test records to explore functionality quickly.

⚠️ Error Handling
Invalid file types

Missing required fields

File not found on disk

Graceful handling of database errors

OCR failures with descriptive messages

📦 Dependencies
Install via:

bash
Copy
Edit
npm install express multer sqlite3 tesseract.js pdf-parse dayjs

