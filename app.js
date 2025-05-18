// ===== Weather Functions =====
async function fetchWeatherData() {
  try {
    // Fetch current weather data
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${STATE.latitude}&lon=${STATE.longitude}&units=metric&appid=${CONFIG.weatherApiKey}`
    );
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Update current weather state
    STATE.weatherData = {
      temperature: data.main.temp,
      condition: data.weather[0].main,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      timestamp: new Date().toISOString()
    };
    
    // Add to weather history
    storeWeatherData(STATE.weatherData);
    
    // Update UI
    updateWeatherDisplay();
    
    // Draw trend graph
    if (STATE.weatherHistory.length > 1) {
      drawTrendGraph();
    }
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
}

function storeWeatherData(weatherData) {
  // Get existing history
  let weatherHistory = [...STATE.weatherHistory];
  
  // Add new data point
  weatherHistory.push(weatherData);
  
  // Keep only last 5 days of data (up to 40 entries with 3h intervals)
  if (weatherHistory.length > 40) {
    weatherHistory = weatherHistory.slice(weatherHistory.length - 40);
  }
  
  // Update state
  STATE.weatherHistory = weatherHistory;
  
  // Save to localStorage
  localStorage.setItem('weatherHistory', JSON.stringify(weatherHistory));
}

function updateWeatherDisplay() {
  if (!STATE.weatherData) return;
  
  // Update temperature
  document.getElementById('temperature').textContent = 
    `${Math.round(STATE.weatherData.temperature)}°C`;
  
  // Update condition
  document.getElementById('weather-condition').textContent = 
    STATE.weatherData.description;
  
  // Update icon
  const iconContainer = document.getElementById('weather-icon-container');
  iconContainer.innerHTML = `<img src="https://openweathermap.org/img/wn/${STATE.weatherData.icon}@2x.png" alt="${STATE.weatherData.description}">`;
  
  // Update trend text
  document.getElementById('weather-trend').textContent = getWeatherTrendDescription();
}

function getWeatherTrendDescription() {
  const history = STATE.weatherHistory;
  
  if (history.length <= 1) {
    return 'Collecting weather data...';
  }
  
  // Get the oldest and newest temperature points
  const oldestPoint = history[0];
  const newestPoint = history[history.length - 1];
  
  const tempDiff = newestPoint.temperature - oldestPoint.temperature;
  const timeDiff = (new Date(newestPoint.timestamp) - new Date(oldestPoint.timestamp)) / (1000 * 60 * 60);
  
  let trendText = '';
  
  if (Math.abs(tempDiff) < 1) {
    trendText = 'Temperature stable';
  } else if (tempDiff > 0) {
    trendText = `Warming trend: +${tempDiff.toFixed(1)}°C over ${Math.round(timeDiff)}h`;
  } else {
    trendText = `Cooling trend: ${tempDiff.toFixed(1)}°C over ${Math.round(timeDiff)}h`;
  }
  
  return trendText;
}

function drawTrendGraph() {
  const history = STATE.weatherHistory;
  if (history.length <= 1) return;
  
  const width = trendCanvas.width;
  const height = trendCanvas.height;
  
  // Clear canvas
  trendContext.clearRect(0, 0, width, height);
  
  // Extract data
  const temperatures = history.map(entry => entry.temperature);
  const timestamps = history.map(entry => new Date(entry.timestamp));
  
  // Find min/max for scaling
  const minTemp = Math.min(...temperatures) - 1;
  const maxTemp = Math.max(...temperatures) + 1;
  const tempRange = maxTemp - minTemp;
  
  // Draw axes
  trendContext.beginPath();
  trendContext.strokeStyle = '#95a5a6';
  trendContext.lineWidth = 1;
  trendContext.moveTo(0, height - 5);
  trendContext.lineTo(width, height - 5);
  trendContext.stroke();
  
  // Plot temperature line
  trendContext.beginPath();
  trendContext.strokeStyle = '#3498db';
  trendContext.lineWidth = 2;
  
  for (let i = 0; i < temperatures.length; i++) {
    const x = (width * i) / (temperatures.length - 1);
    const y = height - 5 - ((temperatures[i] - minTemp) / tempRange) * (height - 10);
    
    if (i === 0) {
      trendContext.moveTo(x, y);
    } else {
      trendContext.lineTo(x, y);
    }
  }
  
  trendContext.stroke();
  
  // Draw dots at each data point
  for (let i = 0; i < temperatures.length; i++) {
    const x = (width * i) / (temperatures.length - 1);
    const y = height - 5 - ((temperatures[i] - minTemp) / tempRange) * (height - 10);
    
    trendContext.beginPath();
    trendContext.arc(x, y, 2, 0, 2 * Math.PI);
    trendContext.fillStyle = '#2980b9';
    trendContext.fill();
  }
}/wn/${STATE.weatherData.icon}@2x.png" alt="${STATE.weatherData.description}">`;
  
  // Update trend text
  document.getElementById('weather-trend').textContent = getWeatherTrendDescription();
}

function getWeatherTrendDescription() {
  const history = STATE.weatherHistory;
  
  if (history.length <= 1) {
    return 'Collecting weather data...';
  }
  
  // Get the oldest and newest temperature points
  const oldestPoint = history[0];
  const newestPoint = history[history.length - 1];
  
  const tempDiff = newestPoint.temperature - oldestPoint.temperature;
  const timeDiff = (new Date(newestPoint.timestamp) - new Date(oldestPoint.timestamp)) / (1000 * 60 * 60);
  
  let trendText = '';
  
  if (Math.abs(tempDiff) < 1) {
    trendText = 'Temperature stable';
  } else if (tempDiff > 0) {
    trendText = `Warming trend: +${tempDiff.toFixed(1)}°C over ${Math.round(timeDiff)}h`;
  } else {
    trendText = `Cooling trend: ${tempDiff.toFixed(1)}°C over ${Math.round(timeDiff)}h`;
  }
  
  return trendText;
}

function drawTrendGraph() {
  const history = STATE.weatherHistory;
  if (history.length <= 1) return;
  
  const width = trendCanvas.width;
  const height = trendCanvas.height;
  
  // Clear canvas
  trendContext.clearRect(0, 0, width, height);
  
  // Extract data
  const temperatures = history.map(entry => entry.temperature);
  const timestamps = history.map(entry => new Date(entry.timestamp));
  
  // Find min/max for scaling
  const minTemp = Math.min(...temperatures) - 1;
  const maxTemp = Math.max(...temperatures) + 1;
  const tempRange = maxTemp - minTemp;
  
  // Draw axes
  trendContext.beginPath();
  trendContext.strokeStyle = '#95a5a6';
  trendContext.lineWidth = 1;
  trendContext.moveTo(0, height - 5);
  trendContext.lineTo(width, height - 5);
  trendContext.stroke();
  
  // Plot temperature line
  trendContext.beginPath();
  trendContext.strokeStyle = '#3498db';
  trendContext.lineWidth = 2;
  
  for (let i = 0; i < temperatures.length; i++) {
    const x = (width * i) / (temperatures.length - 1);
    const y = height - 5 - ((temperatures[i] - minTemp) / tempRange) * (height - 10);
    
    if (i === 0) {
      trendContext.moveTo(x, y);
    } else {
      trendContext.lineTo(x, y);
    }
  }
  
  trendContext.stroke();
  
  // Draw dots at each data point
  for (let i = 0; i < temperatures.length; i++) {
    const x = (width * i) / (temperatures.length - 1);
    const y = height - 5 - ((temperatures[i] - minTemp) / tempRange) * (height - 10);
    
    trendContext.beginPath();
    trendContext.arc(x, y, 2, 0, 2 * Math.PI);
    trendContext.fillStyle = '#2980b9';
    trendContext.fill();
  }
}// Solar Noon Clock - Main Application Code

// Configuration
const CONFIG = {
  // Default coordinates (will be updated with user's location if permission granted)
  defaultLatitude: 40.7128, // New York
  defaultLongitude: -74.0060,
  
  // Weather API settings
  weatherApiKey: 'YOUR_API_KEY_HERE', // Replace with your OpenWeatherMap API key
  weatherRefreshInterval: 30 * 60 * 1000, // 30 minutes
  
  // Clock settings
  clockUpdateInterval: 1000, // 1 second
  solarDataRefreshInterval: 24 * 60 * 60 * 1000, // 24 hours
  
  // UI settings
  clockColors: {
    face: '#34495e',
    hourMarks: '#ecf0f1',
    hourNumbers: '#ecf0f1',
    daylight: '#f1c40f',
    standardTimeHand: '#e74c3c',
    solarTimeHand: '#3498db',
    daylightIndicator: '#2ecc71'
  }
};

// Application state
const STATE = {
  latitude: CONFIG.defaultLatitude,
  longitude: CONFIG.defaultLongitude,
  locationName: 'Loading...',
  
  today: new Date(),
  sunriseTime: null,
  sunsetTime: null,
  solarNoon: null,
  daylightDuration: null,
  daylightPercentage: 0,
  offsetMinutes: 0,
  
  currentStandardTime: new Date(),
  currentSolarTime: new Date(),
  
  weatherData: null,
  weatherHistory: [],
  
  initialized: false
};

// DOM elements
let clockCanvas;
let clockContext;
let trendCanvas;
let trendContext;

// ===== Initialization =====
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
});

async function initializeApp() {
  // Initialize canvas elements
  setupCanvases();
  
  // Try to load saved data
  loadSavedData();
  
  // Set initial time
  updateTime();
  
  // Try to get user's location
  await getUserLocation();
  
  // Calculate solar data (sunrise, sunset, etc.)
  calculateSolarData();
  
  // Fetch weather data if API key is provided
  if (CONFIG.weatherApiKey !== 'fce7a0b17bbafee7a40c4933c3148b2f') {
    fetchWeatherData();
  }
  
  // Set up update intervals
  setInterval(updateTime, CONFIG.clockUpdateInterval);
  setInterval(calculateSolarData, CONFIG.solarDataRefreshInterval);
  
  if (CONFIG.weatherApiKey !== 'fce7a0b17bbafee7a40c4933c3148b2f') {
    setInterval(fetchWeatherData, CONFIG.weatherRefreshInterval);
  }
  
  // Mark as initialized
  STATE.initialized = true;
  
  // Initial drawings
  drawClockFace();
  if (STATE.weatherHistory.length > 1) {
    drawTrendGraph();
  }
  
  // Set up window resize handler
  window.addEventListener('resize', handleResize);
  
  // Set up wake lock if available (keep screen on)
  requestWakeLock();
}

function loadSavedData() {
  // Load solar data from localStorage
  const savedSolarData = localStorage.getItem('solarData');
  if (savedSolarData) {
    try {
      const data = JSON.parse(savedSolarData);
      
      // Check if data is from today
      const savedDate = new Date(data.date);
      const today = new Date();
      
      if (savedDate.toDateString() === today.toDateString()) {
        // Use saved solar data
        STATE.sunriseTime = new Date(data.sunriseTime);
        STATE.sunsetTime = new Date(data.sunsetTime);
        STATE.solarNoon = new Date(data.solarNoon);
        STATE.offsetMinutes = data.offsetMinutes;
        STATE.latitude = data.latitude;
        STATE.longitude = data.longitude;
        
        // Calculate daylight duration
        const sunriseMsec = STATE.sunriseTime.getTime();
        const sunsetMsec = STATE.sunsetTime.getTime();
        STATE.daylightDuration = calculateDaylightDuration(sunriseMsec, sunsetMsec);
        
        // Update UI
        updateSolarDisplay();
      }
    } catch (error) {
      console.error('Error loading saved solar data:', error);
    }
  }
  
  // Load weather history from localStorage
  const savedWeatherHistory = localStorage.getItem('weatherHistory');
  if (savedWeatherHistory) {
    try {
      STATE.weatherHistory = JSON.parse(savedWeatherHistory);
    } catch (error) {
      console.error('Error loading saved weather history:', error);
    }
  }
}

async function requestWakeLock() {
  if ('wakeLock' in navigator) {
    try {
      const wakeLock = await navigator.wakeLock.request('screen');
      console.log('Wake Lock is active');
      
      // Release wake lock when page is hidden
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && wakeLock.released) {
          // Re-request wake lock when page becomes visible again
          requestWakeLock();
        }
      });
    } catch (error) {
      console.error('Error requesting Wake Lock:', error);
    }
  }
}

function setupCanvases() {
  // Clock canvas setup
  clockCanvas = document.getElementById('clock-canvas');
  clockContext = clockCanvas.getContext('2d');
  resizeCanvas(clockCanvas);
  
  // Trend canvas setup
  trendCanvas = document.getElementById('trend-canvas');
  trendContext = trendCanvas.getContext('2d');
  resizeCanvas(trendCanvas);
}

function resizeCanvas(canvas) {
  // Set canvas dimensions to match CSS display size
  const displayWidth = canvas.clientWidth;
  const displayHeight = canvas.clientHeight;
  
  // Only update if necessary to avoid clearing the canvas
  if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
    canvas.width = displayWidth;
    canvas.height = displayHeight;
  }
}

function handleResize() {
  // Resize canvases on window resize
  resizeCanvas(clockCanvas);
  resizeCanvas(trendCanvas);
  
  // Redraw
  drawClockFace();
  if (STATE.weatherHistory.length > 1) {
    drawTrendGraph();
  }
}

// ===== Location Functions =====
async function getUserLocation() {
  return new Promise((resolve) => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          STATE.latitude = position.coords.latitude;
          STATE.longitude = position.coords.longitude;
          resolveLocationName();
          resolve(true);
        },
        (error) => {
          console.log('Geolocation error:', error);
          resolve(false);
        },
        { timeout: 10000 }
      );
    } else {
      resolve(false);
    }
  });
}

async function resolveLocationName() {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/reverse?lat=${STATE.latitude}&lon=${STATE.longitude}&limit=1&appid=${CONFIG.weatherApiKey}`
    );
    
    if (response.ok) {
      const data = await response.json();
      if (data && data.length > 0) {
        STATE.locationName = data[0].name;
      }
    }
  } catch (error) {
    console.error('Error getting location name:', error);
  }
}

// ===== Solar Calculations =====
function calculateSolarData() {
  // Get today's date (reset to midnight)
  STATE.today = new Date();
  STATE.today.setHours(0, 0, 0, 0);
  
  // Calculate sun times using SunCalc library
  const sunTimes = SunCalc.getTimes(
    STATE.today,
    STATE.latitude,
    STATE.longitude
  );
  
  STATE.sunriseTime = sunTimes.sunrise;
  STATE.sunsetTime = sunTimes.sunset;
  
  // Calculate solar noon (midpoint between sunrise and sunset)
  const sunriseMsec = STATE.sunriseTime.getTime();
  const sunsetMsec = STATE.sunsetTime.getTime();
  
  STATE.solarNoon = new Date((sunriseMsec + sunsetMsec) / 2);
  
  // Calculate daylight duration
  STATE.daylightDuration = calculateDaylightDuration(sunriseMsec, sunsetMsec);
  
  // Calculate offset between standard noon and solar noon
  const standardNoon = new Date(STATE.today);
  standardNoon.setHours(12, 0, 0, 0);
  
  STATE.offsetMinutes = (STATE.solarNoon.getTime() - standardNoon.getTime()) / (60 * 1000);
  
  // Update UI with calculated values
  updateSolarDisplay();
  
  // Store calculation date to localStorage
  const solarData = {
    date: STATE.today.toISOString(),
    sunriseTime: STATE.sunriseTime.toISOString(),
    sunsetTime: STATE.sunsetTime.toISOString(),
    solarNoon: STATE.solarNoon.toISOString(),
    offsetMinutes: STATE.offsetMinutes,
    latitude: STATE.latitude,
    longitude: STATE.longitude
  };
  
  localStorage.setItem('solarData', JSON.stringify(solarData));
}

function calculateDaylightDuration(sunriseMsec, sunsetMsec) {
  // Calculate total daylight in milliseconds
  const daylightMs = sunsetMsec - sunriseMsec;
  
  // Convert to hours and minutes
  const daylightHours = Math.floor(daylightMs / (1000 * 60 * 60));
  const daylightMinutes = Math.floor((daylightMs % (1000 * 60 * 60)) / (1000 * 60));
  
  return {
    totalMs: daylightMs,
    hours: daylightHours,
    minutes: daylightMinutes,
    formattedString: `${daylightHours}h ${daylightMinutes}m`
  };
}

function calculateDaylightPercentage() {
  const currentMsec = STATE.currentStandardTime.getTime();
  const sunriseMsec = STATE.sunriseTime.getTime();
  const sunsetMsec = STATE.sunsetTime.getTime();
  
  // If before sunrise or after sunset, handle appropriately
  if (currentMsec < sunriseMsec) {
    return 0; // Before sunrise
  }
  
  if (currentMsec > sunsetMsec) {
    return 100; // After sunset
  }
  
  // Calculate elapsed daylight
  const elapsedMs = currentMsec - sunriseMsec;
  const totalDaylightMs = sunsetMsec - sunriseMsec;
  
  // Calculate percentage
  const percentage = (elapsedMs / totalDaylightMs) * 100;
  
  return percentage;
}

function updateSolarDisplay() {
  // Update sunrise time display
  document.getElementById('sunrise-time').textContent = 
    STATE.sunriseTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
  // Update sunset time display
  document.getElementById('sunset-time').textContent = 
    STATE.sunsetTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
  // Update daylight duration
  document.getElementById('daylight-duration').textContent = 
    STATE.daylightDuration.formattedString;
}

// ===== Time Management =====
function updateTime() {
  // Update standard time
  STATE.currentStandardTime = new Date();
  
  // Calculate solar time (standard time adjusted by offset)
  STATE.currentSolarTime = new Date(
    STATE.currentStandardTime.getTime() - STATE.offsetMinutes * 60 * 1000
  );
  
  // Calculate daylight percentage
  STATE.daylightPercentage = calculateDaylightPercentage();
  
  // Update UI
  updateTimeDisplay();
  
  // Draw clock face
  drawClockFace();
}

function updateTimeDisplay() {
  // Update digital time display
  document.getElementById('digital-time').textContent = 
    STATE.currentSolarTime.toLocaleTimeString();
    
  // Update date display
  document.getElementById('date-display').textContent = 
    STATE.currentStandardTime.toLocaleDateString(undefined, { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
    
  // Update daylight percentage
  document.getElementById('daylight-percentage').textContent = 
    `${Math.round(STATE.daylightPercentage)}%`;
}

// ===== Clock Face Drawing =====
function drawClockFace() {
  const width = clockCanvas.width;
  const height = clockCanvas.height;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2 * 0.85;
  
  // Clear canvas
  clockContext.clearRect(0, 0, width, height);
  
  // Draw clock circle
  clockContext.beginPath();
  clockContext.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  clockContext.fillStyle = CONFIG.clockColors.face;
  clockContext.fill();
  
  // Draw hour markers and numbers
  for (let hour = 0; hour < 24; hour++) {
    const angle = (hour / 24) * 2 * Math.PI - Math.PI / 2;
    const outerX = centerX + radius * 0.9 * Math.cos(angle);
    const outerY = centerY + radius * 0.9 * Math.sin(angle);
    const innerX = centerX + radius * 0.8 * Math.cos(angle);
    const innerY = centerY + radius * 0.8 * Math.sin(angle);
    
    // Draw hour markers
    clockContext.beginPath();
    clockContext.moveTo(outerX, outerY);
    clockContext.lineTo(innerX, innerY);
    clockContext.strokeStyle = CONFIG.clockColors.hourMarks;
    clockContext.lineWidth = hour % 6 === 0 ? 3 : 1;
    clockContext.stroke();
    
    // Draw hour numbers (only for 0, 6, 12, 18)
    if (hour % 6 === 0) {
      const textX = centerX + radius * 0.7 * Math.cos(angle);
      const textY = centerY + radius * 0.7 * Math.sin(angle);
      
      clockContext.font = `${radius * 0.12}px Arial`;
      clockContext.fillStyle = CONFIG.clockColors.hourNumbers;
      clockContext.textAlign = 'center';
      clockContext.textBaseline = 'middle';
      clockContext.fillText(hour.toString(), textX, textY);
    }
  }
  
  // Draw daylight arc if we have sunrise/sunset data
  if (STATE.sunriseTime && STATE.sunsetTime) {
    const sunriseHour = STATE.sunriseTime.getHours() + STATE.sunriseTime.getMinutes() / 60;
    const sunsetHour = STATE.sunsetTime.getHours() + STATE.sunsetTime.getMinutes() / 60;
    
    const sunriseAngle = (sunriseHour / 24) * 2 * Math.PI - Math.PI / 2;
    const sunsetAngle = (sunsetHour / 24) * 2 * Math.PI - Math.PI / 2;
    
    clockContext.beginPath();
    clockContext.arc(centerX, centerY, radius * 0.95, sunriseAngle, sunsetAngle);
    clockContext.strokeStyle = CONFIG.clockColors.daylight;
    clockContext.lineWidth = radius * 0.05;
    clockContext.stroke();
    
    // Draw daylight indicator
    const percentAngle = sunriseAngle + (STATE.daylightPercentage / 100) * (sunsetAngle - sunriseAngle);
    const indicatorX = centerX + radius * 0.95 * Math.cos(percentAngle);
    const indicatorY = centerY + radius * 0.95 * Math.sin(percentAngle);
    
    clockContext.beginPath();
    clockContext.arc(indicatorX, indicatorY, radius * 0.06, 0, 2 * Math.PI);
    clockContext.fillStyle = CONFIG.clockColors.daylightIndicator;
    clockContext.fill();
  }
  
  // Draw standard time hand
  const standardHours = STATE.currentStandardTime.getHours() + 
    STATE.currentStandardTime.getMinutes() / 60 + 
    STATE.currentStandardTime.getSeconds() / 3600;
  
  const standardAngle = (standardHours / 24) * 2 * Math.PI - Math.PI / 2;
  const standardHandLength = radius * 0.6;
  
  clockContext.beginPath();
  clockContext.moveTo(centerX, centerY);
  clockContext.lineTo(
    centerX + standardHandLength * Math.cos(standardAngle),
    centerY + standardHandLength * Math.sin(standardAngle)
  );
  clockContext.strokeStyle = CONFIG.clockColors.standardTimeHand;
  clockContext.lineWidth = radius * 0.02;
  clockContext.lineCap = 'round';
  clockContext.stroke();
  
  // Draw solar time hand
  const solarHours = STATE.currentSolarTime.getHours() + 
    STATE.currentSolarTime.getMinutes() / 60 + 
    STATE.currentSolarTime.getSeconds() / 3600;
  
  const solarAngle = (solarHours / 24) * 2 * Math.PI - Math.PI / 2;
  const solarHandLength = radius * 0.7;
  
  clockContext.beginPath();
  clockContext.moveTo(centerX, centerY);
  clockContext.lineTo(
    centerX + solarHandLength * Math.cos(solarAngle),
    centerY + solarHandLength * Math.sin(solarAngle)
  );
  clockContext.strokeStyle = CONFIG.clockColors.solarTimeHand;
  clockContext.lineWidth = radius * 0.02;
  clockContext.lineCap = 'round';
  clockContext.stroke();
  
  // Draw a small circle at the center
  clockContext.beginPath();
  clockContext.arc(centerX, centerY, radius * 0.03, 0, 2 * Math.PI);
  clockContext.fillStyle = CONFIG.clockColors.hourNumbers;
  clockContext.fill();
}
