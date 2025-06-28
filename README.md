**🧾 Receipt Scanner**:

---

# 🧾 Receipt Scanner Web Application

This project is a Node.js-powered web application that automates the extraction of key information from **PDF receipts** using **OCR (Optical Character Recognition)**. It stores extracted data in a **SQLite database** and provides a set of **RESTful APIs** to upload, validate, process, and retrieve receipt data.

---

## ✅ Features

* 📤 Upload and validate receipt files (`.pdf`)
* 🔍 OCR-powered data extraction (using `tesseract.js`) to detect:

  * Purchase Date
  * Merchant Name
  * Total Amount
* 🗃️ Store raw and extracted data in SQLite
* 🧩 RESTful API for file operations and receipt metadata
* 🛡️ Robust error handling for file type, data integrity, and processing failures

---

## 🧠 Tech Stack

| Layer       | Technology       |
| ----------- | ---------------- |
| Backend     | Node.js, Express |
| File Upload | Multer           |
| OCR Engine  | Tesseract.js     |
| PDF Parser  | pdf-parse        |
| Database    | SQLite3          |
| Utilities   | fs, path, dayjs  |

---

## 🛠️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/misskranti/receipt-scanner.git
cd receipt-scanner
go to feature/receipt-scanner branch
```

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Set Up SQLite Database

Create and initialize local database:

```bash
sqlite3 database/receipts.db
.tables
```

Inside the SQLite prompt, run the following schema:

```sql
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
```

---

### 4. Start the Server

```bash
node src/server.js
```

 API is now live at:
📍 **[http://localhost:3000](http://localhost:3000)**

---

## 📮 API Endpoints

---

### 🔹 1. Upload Receipt

**Endpoint:** `POST /api/upload`
**Content-Type:** `multipart/form-data`
**Field:** `file`

```bash
curl -F "file=@receipt1.pdf" http://localhost:3000/api/upload
```

**Response:**

```json
{
  "success": true,
  "message": "Receipt uploaded successfully!",
  "receipt": {
    "id": 17,
    "filename": "receipt1.pdf",
    "filepath": "D:/receipt-processor/database/uploads/receipt1.pdf"
  }
}
```

---

### 🔹 2. Validate Receipt

#### A. Auto Validation (on upload)

```bash
curl -F "file=@receipt1.pdf" http://localhost:3000/api/validate
```

#### B. Manual Validation

**Endpoint:** `POST /api/validate`
**Content-Type:** `application/json`

```json
{
  "file_id": 17,
  "is_valid": false,
  "invalid_reason": "Unreadable text or format"
}
```

**Response:**

```json
{
  "success": true,
  "message": "File is valid!",
  "fileInfo": {
    "originalName": "receipt1.pdf",
    "mimeType": "application/pdf",
    "size": 2652
  }
}
```

---

### 🔹 3. Process Receipt (OCR)

**Endpoint:** `POST /api/process/:fileId`

```bash
curl -X POST http://localhost:3000/api/process/1
```

**Response:**

```json
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
```

---

### 🔹 4. Get All Receipts

**Endpoint:** `GET /api/receipts`

```bash
curl http://localhost:3000/api/receipts
```

**Response:**

```json
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
```

---

### 🔹 5. Get Receipt by ID

**Endpoint:** `GET /api/receipts/:id`

```bash
curl http://localhost:3000/api/receipts/1
```

**Response:**

```json
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
```

---

---

## ⚠️ Error Handling

The app gracefully handles the following issues:

* ❌ Invalid file types (non-PDFs)
* ❌ Missing required fields in uploads
* 🧾 Missing files on disk
* 🧠 OCR failures with descriptive fallback messages
* 💥 Database query failures

---

## 📦 Installable Dependencies

```bash
npm install express multer sqlite3 tesseract.js pdf-parse dayjs
```

---
