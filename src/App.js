import React, {useState, useEffect} from 'react';
import './App.css';

function App() {
  const [coords, setCoords] = useState(false);
  const [results, setResults] = useState({});
//  const numberOfDays = useState(7);
  const days = ["Sunday", 'Monday', 'Tuesday', "Wednesday", "Thrusday", "Friday", "Saturday"]

  useEffect(() => {
    if (!coords) {
      navigator.geolocation.getCurrentPosition(
        c => {
          setCoords({latitude: c.coords.latitude, longitude: c.coords.longitude});
        }, 
        error => {
          console.log(error);
          setCoords(null)
        }, 
        {enableHighAccuracy:true,maximumAge:600000, timeout:10000}
      );

    } else {
      getWeather({...coords, days: 7})
      .then(response => response.json())
      .then(data => {
        console.log(data); 
        return data
      })
      .then(data => setResults(data))
      .catch(e => console.log(e))
    }
  }, [coords]);

  return (
    <div className="App">
    <div className="App-wrapper">
    {Object.keys(results).length ?
      <>
    <div className="App-city">{results.location.name}</div>
    <div className="App-condition">{results.current.condition.text}</div>
    <div className="App-temp">{results.current.temp_f}</div>

    <div className="App-line" />

    {results.forecast.forecastday.map((i, index) => (
      <div key={index} className="App-item">
      <div className="App-day">{days[new Date(i.date).getDay()]}</div>
      <img alt="weather-icon" src={i.day.condition.icon} />
      <div className="App-temp2">{i.day.avgtemp_f}</div>
      </div>

    ))}

    </>
    : coords === null ? <div>Please Enable Location</div> : <div>Loading</div>
    }
    </div>
    </div>
  );
}


async function getWeather(props) {
  return await fetch(`https://api.weatherapi.com/v1/forecast.json?key=fb0e6949c1e34887bac233528201204&q=${props.latitude.toFixed(2)},${props.longitude.toFixed(2)}&days=${props.days}`)
}

export default App;
