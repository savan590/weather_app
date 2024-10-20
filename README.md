# weather_app
This project is a real-time weather monitoring system using the MERN stack. It continuously retrieves weather data from OpenWeatherMap and processes it to generate daily weather summaries, rollups, and aggregates.

Setup Instructions
1. Clone the Repository
git clone https://github.com/savan590/weather_app.git
cd weather_app

3. Running with Docker
Make sure you have Docker and Docker Compose installed.

Build and run the application using Docker Compose:

docker-compose up --build

Open the application:
Frontend: http://localhost:3000
Backend: http://localhost:5000

3. Services
Backend: Node.js + Express app running on port 5000.
Frontend: React app running on port 3000.
MongoDB: MongoDB container running on port 27017.

4. Testing the Setup
After running the application, verify:

Backend data is available at http://localhost:5000/summaries.
Frontend is accessible at http://localhost:3000.
