# 🌦️ Real-Time Weather Visualization Web App

## 📌 Overview

A responsive weather visualization web application that provides real-time weather forecasts for multiple cities worldwide. The platform helps users quickly access reliable weather information to better plan their daily activities.

The application integrates external weather APIs to fetch live weather data and also supports geolocation-based weather retrieval using the browser's Geolocation API.

In addition to weather visualization, the project focuses on modern UI/UX design and secure client-server communication through HTTPS and backend security controls.

---

## 🚀 Features

* 🌍 Search weather forecasts by city name
* 📍 Get current weather using Geolocation API
* ⏱️ Real-time weather data retrieval
* 📅 5-day weather forecast
* 🌡️ Display temperature, humidity, and weather conditions
* 🧊 Modern Glassmorphism UI design
* 📱 Fully responsive interface for desktop and mobile devices
* 🔒 HTTPS support for encrypted communication
* 🛡️ Backend security controls and HTTP security headers
* ⚡ Fast and lightweight user experience

---

## 🛠️ Tech Stack

### Frontend

* HTML5
* CSS3
* JavaScript

### Backend

* Node.js
* dotenv
* REST API Architecture

### APIs

* Weather API integration
* Browser Geolocation API

---

## 🧠 Architecture

The application follows a client-server architecture:

* The frontend handles user interactions, UI rendering.
* The backend acts as an intermediary service for weather data processing and secure communication.
* External weather APIs are used to retrieve real-time forecast information.

---

## 🔐 Security Features

* HTTPS protocol for secure encrypted communication
* Security headers implementation:

  * Strict-Transport-Security
  * X-Content-Type-Options
  * X-Frame-Options
  * Referrer-Policy
* Controlled API communication between frontend and backend

---

## 🎨 UI Design

The application uses a modern **Glassmorphism** design style to provide:

* Smooth transparent UI elements
* Blur effects
* Modern responsive layout
* Enhanced visual experience

---

## 📷 Screenshots

<img width="300" height="500" src=https://github.com/Karim-collaborate/real-time-weather-dashboard/blob/main/assets/screenshot.png>

---

## 🌱 Environment Variables

The project uses environment variables to securely manage sensitive configuration data such as API keys and server settings.

---

## 🔒 HTTPS Configuration

This project uses a self-signed SSL certificate for local HTTPS development.

Browsers may display a security warning because the certificate is not issued by a trusted Certificate Authority (CA). This is expected for local development environments.

### Generate Local SSL Certificates

#### Generate a private key (RSA 2048-bit)
```
openssl genrsa -out key.pem 2048
```
#### Generate a self-signed certificate (valid for 365 days)
```
openssl req -new -x509 -key key.pem -out cert.pem -days 365 -nodes
```
After generating the certificate files:

* Place `key.pem` and `cert.pem` in the project directory
* Restart the Node.js server

### Important Notes

* Self-signed certificates are intended for development purposes only
* Do not use them in production environments
* Production deployments should use trusted SSL certificates (e.g., Let's Encrypt)

---



## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/Karim-collaborate/real-time-weather-dashboard.git
```

### 2️⃣ Navigate to the project folder

```bash
cd real-time-weather-dashboard
```

### 3️⃣ Install backend dependencies

```bash
npm install
```
### 4️⃣ Copy .env.example into .env

```bash
cp .env.example .env
```

### 5️⃣ Place you api key in env variables
Create an API key from your weatherapi.com and replace it inside the .env file:

```bash
API_KEY=your_weather_api_key_here
```

### 6️⃣ Start the backend servers

```bash
node server.js
node api.js
```

---

## 📌 Future Improvements

* 📈 Weather charts and data visualization
* 🔔 Weather alerts and notifications
* 🗄️ User accounts and saved cities

---

## 👨‍💻 Author

- Karim Oolahiane
