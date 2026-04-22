# Smart Waste Management System

A real-time IoT-based waste monitoring and route optimization system that helps cities manage garbage collection efficiently, reduce fuel costs, and minimize carbon emissions.

---

## Overview

This project integrates **IoT sensors**, a **backend server**, and a **modern web dashboard** to monitor dustbin levels in real-time and generate optimized collection routes.

It enables:

* Smart monitoring of bin fill levels
* Efficient garbage collection
* Reduced operational costs
* Cleaner and smarter cities

---

## Tech Stack

### Hardware (IoT)

* Arduino Uno
* Ultrasonic Sensors (HC-SR04)
* Gas Sensor (MQ series)
* Temperature Sensor (LM35)

### Software

* **Frontend:** React.js + Tailwind CSS + Leaflet Maps
* **Backend:** Node.js + Express.js
* **Database:** MongoDB
* **Communication:** Serial Port (Arduino → Node.js)
* **Routing API:** OSRM (Open Source Routing Machine)

---

## Features

### Real-Time Monitoring

* Tracks fill levels of multiple bins
* Displays status: **EMPTY / MODERATE / FULL**

### Smart Route Optimization

* Truck starts from a fixed depot
* Only visits **FULL bins**
* Uses optimized routing logic (TSP-based approach)

### Intelligent Decision Making

* BIN_01 includes gas + temperature analysis
* Other bins use fill-level logic

### Auto Refresh Dashboard

* Updates every 3 seconds
* Smooth UI animations for status changes

### Authentication System

* Login & Register functionality
* JWT-based authentication
* Protected API routes

---

## How It Works

1. Sensors detect distance (fill level)
2. Arduino sends data via Serial (COM port)
3. Node.js reads and sends data to backend API
4. Backend processes and updates database
5. React dashboard fetches and displays data
6. Map shows optimized route for garbage collection

---

## System Architecture

```text
Arduino → Serial Port → Node.js → Express API → MongoDB → React Dashboard
```

---

## Sample Data Format

```text
BIN_01,89,100,30
BIN_02,65,0,0
```

* `binId`
* `fillLevel`
* `gasLevel`
* `temperature`

---

## Project Structure

```bash
smart-waste-management/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── utils/
│
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── App.jsx
│
├── arduino/
│   └── smart_bins.ino
│
└── README.md
```

---

## Setup Instructions

### Clone the Repository

```bash
git clone https://github.com/devrajmandal/smart-waste-management.git
cd smart-waste-management
```

---

### Backend Setup

```bash
cd backend
npm install
npm start
```

---

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

### Arduino Setup

* Upload `.ino` file using Arduino IDE
* Connect sensors properly
* Set correct COM port

---

## Authentication

* Users can register and login
* JWT token stored in localStorage
* Protected routes using middleware

---

## Screenshots

* Landing page
   <img width="1919" height="823" alt="image" src="https://github.com/user-attachments/assets/8a90e1e7-22dc-4be6-a043-441a4e23111d" />

* Login page
   <img width="1919" height="823" alt="image" src="https://github.com/user-attachments/assets/312ac5a7-503b-4ec4-a5da-bf89a69328de" />

* Dashboard view
   <img width="1919" height="829" alt="image" src="https://github.com/user-attachments/assets/0aa92827-d80e-41f5-a2c9-662e39bf8595" />

* Map with optimized route
   <img width="1919" height="813" alt="image" src="https://github.com/user-attachments/assets/3cb781c9-962e-486c-8727-f24c439c250b" />


---

## Author

**Devraj Mandal**

---

## Contribution

Feel free to fork, improve, and submit PRs!

---

## License

This project is open-source and available under the MIT License.
