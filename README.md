# ☀️ Of the Day

A modern, interactive web application designed to deliver daily inspiration through Motivational Quotes, Daily Affirmations, Life Advice, and Bible Verses. Developed as a second-year Information Technology finals project, this application features a decoupled architecture combining a sleek, responsive frontend with a robust Java backend.

## ✨ Features
* **Categorized Inspiration:** Seamlessly switch between four distinct content categories. The app remembers your place in each category as you navigate.
* **Favorites System:** Save your favorite quotes using an animated heart button. Favorites are persistently stored in the browser's local storage so they are never lost.
* **One-Click Copy:** Easily copy quotes to your clipboard, complete with a custom "Copied!" toast notification.
* **Modern UI/UX:** Features a sticky frosted-glass navigation bar, sliding underline animations, and a fully responsive design that compresses into a swipeable card row on mobile devices.
* **Decoupled Architecture:** Built using industry-standard practices, separating the client-side presentation from the server-side data API.

## 🛠️ Tech Stack
**Frontend:**
* HTML5, CSS3, Vanilla JavaScript
* Node.js & Express (Static File Server)

**Backend:**
* Java 17
* Spring Boot (REST API)
* JSON-based static database



## 🚀 How to Run the Project

Because this project uses a decoupled architecture, the frontend and backend must be run simultaneously on two separate servers.

### 1. Start the Backend API (Spring Boot)
The backend acts as the data vault, serving the quotes to the frontend via a REST API.
1. Open the `oftheday` Java folder in your IDE (e.g., IntelliJ, VS Code, Eclipse).
2. Ensure you have Maven installed and dependencies loaded.
3. Run the `OfthedayApplication.java` file.
4. The backend will start running on **http://localhost:8080**.

### 2. Start the Frontend (Node.js)
The frontend serves the visual UI to the user's browser.
1. Open a terminal and navigate to your `frontend` folder.
2. Run the server using the command:
    `node server.js`
3. The frontend will start running on http://localhost:3000.
   
### 3. View the App
Once both servers are running, open your web browser and navigate to:
    `http://localhost:3000`




👥 Meet the Team

This project was collaboratively designed and developed by:

- Clive Owen Delima
- Francisco Jubelag Jr XX
- Eduardo Patalinjug
