import { useState, useEffect } from 'react';
import './App.css';

const moonImages = {
  "New Moon": "new-moon.png",
  "Waxing Crescent": "waxing-crescent.png",
  "First Quarter": "first-quarter.png",
  "Waxing Gibbous": "waxing-gibbous.png",
  "Full Moon": "full.png",
  "Waning Gibbous": "waning-gibbous.png",
  "Last Quarter": "third-quarter.png",
  "Waning Crescent": "waning-crescent.png",
};

function App() {
  const [selectedDate, setSelectedDate] = useState('');
  const [moonData, setMoonData] = useState(null);

  useEffect(() => {
    if (!selectedDate) return;

    const fetchMoonData = async () => {
      try {
        const timestamp = Math.floor(new Date(selectedDate).getTime() / 1000);
        const res = await fetch(`https://api.farmsense.net/v1/moonphases/?d=${timestamp}`);
        const json = await res.json();

        const phase = json[0].Phase;
        const imageKey = phase
          .toLowerCase()
          .split(" ")
          .map(w => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");

        setMoonData({
          ...json[0],
          date: selectedDate,
          imageKey,
        });
      } catch (err) {
        console.error("Failed to fetch moon data:", err);
      }
    };

    fetchMoonData();
  }, [selectedDate]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  return (
    <div className="app">
      <div className="container">
        <h1>🌙 Moon Phase Viewer</h1>
        <input
          type="date"
          className="date-picker"
          value={selectedDate}
          onChange={handleDateChange}
        />

        {moonData && (
          <>
            <img
              src={`/images/${moonImages[moonData.imageKey]}`}
              alt={moonData.Phase}
              className="moon-image"
            />
            <div className="info-box">
              <p><strong>Date:</strong> {moonData.date}</p>
              <p><strong>Phase:</strong> {moonData.Phase}</p>
              <p>
                <strong>Illumination:</strong> {moonData.Illum
                  ? (parseFloat(moonData.Illum) * 100).toFixed(1)
                  : 'N/A'}%
              </p>

            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
