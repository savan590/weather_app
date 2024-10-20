import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

function App() {
  const [weatherSummaries, setWeatherSummaries] = useState([]);

  // useEffect(() => {
  //   async function fetchWeatherSummaries() {
  //     const response = await axios.get('http://localhost:5000/summaries');
  //     setWeatherSummaries(response.data);
  //   }
  //   fetchWeatherSummaries();
  // }, []);

  useEffect(() => {
    async function fetchWeatherSummaries() {
      try {
        const response = await axios.get('http://localhost:5000/summaries');
        console.log("Fetched Data:", response.data); // Add this line to log the data
        setWeatherSummaries(response.data);
      } catch (error) {
        console.error("Error fetching data", error); // Handle the error if any
      }
    }
    fetchWeatherSummaries();
  }, []);

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" ,flexDirection:"column", marginTop :"8%"}} className="App">
      <h1>Daily Weather Summaries</h1>
      <LineChart
        width={600}
        height={300}
        data={weatherSummaries}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="city" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="averageTemp" stroke="#8884d8" />
        <Line type="monotone" dataKey="maxTemp" stroke="#82ca9d" />
        <Line type="monotone" dataKey="minTemp" stroke="#ffc658" />
      </LineChart>
    </div>
  );
}

export default App;
