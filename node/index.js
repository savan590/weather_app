const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const Weather = require('./models/Weather');
const dotenv = require('dotenv')
dotenv.config()
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const apiKey = process.env.API_KEY; // OpenWeatherMap API key
const cities = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL).then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Fetch weather data every 5 minutes
async function fetchWeatherData() {
  for (const city of cities) {
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    try {
      const response = await axios.get(url);
      const weatherData = response.data;

      // Process the weather data
      const weatherSummary = processWeatherData(weatherData);

      // Save daily summary
      saveDailySummary(city, weatherSummary);
      
      // Check alerts
      checkAlerts(weatherData, city);
    } catch (error) {
      console.log(`Error fetching weather for ${city}:`, error);
    }
  }
}

setInterval(fetchWeatherData, 5 * 60 * 1000); // Every 5 minutes

// Temperature conversion function
const kelvinToCelsius = (temp) => (temp - 273.15).toFixed(2);

// Function to process weather data
function processWeatherData(data) {
  const temp = kelvinToCelsius(data.main.temp);
  const feelsLike = kelvinToCelsius(data.main.feels_like);
  const condition = data.weather[0].main;
  return { temp, feelsLike, condition };
}

// Function to save daily summary to MongoDB
async function saveDailySummary(city, summary) {
  const date = new Date().toISOString().split('T')[0];
  let weatherEntry = await Weather.findOne({ city, date });
  if (!weatherEntry) {
    weatherEntry = new Weather({ city, date, tempSum: 0, maxTemp: -Infinity, minTemp: Infinity, count: 0 });
  }

  weatherEntry.tempSum += parseFloat(summary.temp);
  weatherEntry.maxTemp = Math.max(weatherEntry.maxTemp, parseFloat(summary.temp));
  weatherEntry.minTemp = Math.min(weatherEntry.minTemp, parseFloat(summary.temp));
  weatherEntry.count += 1;
  weatherEntry.dominantCondition = summary.condition;  // Simplified dominant condition
  await weatherEntry.save();
}

// User-defined alert thresholds
const userThresholds = { temp: 35 };

// Function to check alerts
function checkAlerts(weatherData, city) {
  const temp = kelvinToCelsius(weatherData.main.temp);
  if (temp > userThresholds.temp) {
    console.log(`ALERT: ${city} temperature exceeded ${userThresholds.temp}°C`);
    // Optionally send an email or notification
  }
}

// Routes
app.get('/summaries', async (req, res) => {
  const summaries = await Weather.find();
  res.json(summaries);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
