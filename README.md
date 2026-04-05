# 🎪 Fest 2025 — Event Registration Website

A beginner-friendly event registration web app built with:
- **Frontend**: HTML, CSS, Vanilla JavaScript
- **Backend**: Node.js + Express
- **Database**: MongoDB + Mongoose

---

## 📁 Project Structure

```
event-registration/
├── public/
│   ├── index.html       ← Homepage (3 event cards)
│   ├── event.html       ← Event page (time slot selection)
│   ├── register.html    ← Registration form
│   ├── style.css        ← All styles
│   └── script.js        ← Form logic & API call
│
├── models/
│   └── Registration.js  ← Mongoose schema & model
│
├── server.js            ← Express server & /register API
├── package.json
└── README.md
```

---

## 🚀 How to Run

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v16+)
- [MongoDB](https://www.mongodb.com/try/download/community) installed locally  
  **OR** a free [MongoDB Atlas](https://www.mongodb.com/atlas) cloud account

### 2. Install dependencies
```bash
cd event-registration
npm install
```

### 3. Configure MongoDB (if using Atlas)
Open `server.js` and replace the `MONGO_URI` value:
```js
const MONGO_URI = 'mongodb+srv://<username>:<password>@cluster.mongodb.net/fest_registrations';
```

### 4. Start the server
```bash
# Normal start
npm start

# Development mode (auto-restarts on file changes)
npm run dev
```

### 5. Open in browser
Visit: [http://localhost:3000](http://localhost:3000)

---

## 🔄 User Flow

```
Homepage (index.html)
   └─ Click an event card (Lucida / Nrityadarpan / Metanoia)
         └─ Event Page (event.html?event=...)
               └─ Click "12 PM" or "3 PM" button
                     └─ Registration Form (register.html?event=...&slot=...)
                           └─ Fill in details → Submit
                                 └─ "Registration Successful!" ✅
```

---

## 🔌 API Reference

### `POST /register`
Registers a participant for an event.

**Request Body (JSON):**
```json
{
  "name":           "Max williams",
  "email":          "maxv@example.com",
  "mobile":         "9876543210",
  "registerNumber": "22CS001",
  "department":     "Computer Science",
  "eventName":      "Lucida",
  "timeSlot":       "12 PM"
}
```

**Success Response (201):**
```json
{ "success": true, "message": "Registration successful!" }
```

**Error Response (400 / 409 / 500):**
```json
{ "success": false, "message": "Error details here" }
```

---

## ✅ Validations

| Field          | Rule                                      |
|----------------|-------------------------------------------|
| Name           | Required, non-empty                       |
| Email          | Required, valid format                    |
| Mobile         | Required, exactly 10 digits              |
| Register No.   | Required, non-empty                       |
| Department     | Required, from dropdown                   |
| Event Name     | Must be Lucida / Nrityadarpan / Metanoia  |
| Time Slot      | Must be 12 PM or 3 PM                     |

**Duplicate prevention**: Same email + event + time slot combination is rejected.

---

## 💡 Tips

- To view all registrations in MongoDB shell:
  ```
  use fest_registrations
  db.registrations.find().pretty()
  ```
- To change port, set the `PORT` environment variable:
  ```bash
  PORT=5000 npm start
  ```
