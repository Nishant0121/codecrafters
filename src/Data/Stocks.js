const INTERVAL = "5min";

export const fetchStockData = async (SYMBOL) => {
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${SYMBOL}&interval=${INTERVAL}&apikey=CLY2WS42R103U78S`;

  try {
    const response = await fetch(url);
    console.log(response);
    const data = await response.json();
    console.log(data);

    if (data["Error Message"]) {
      console.error("Error:", data["Error Message"]);
      return;
    }

    const timeSeries = data[`Time Series (${INTERVAL})`];
    const formattedData = Object.keys(timeSeries).map((timestamp) => ({
      timestamp,
      open: timeSeries[timestamp]["1. open"],
      high: timeSeries[timestamp]["2. high"],
      low: timeSeries[timestamp]["3. low"],
      close: timeSeries[timestamp]["4. close"],
      volume: timeSeries[timestamp]["5. volume"],
    }));

    console.log(formattedData);
  } catch (error) {
    console.error("Fetch error:", error);
  }
};

export const sampleStocks = [
  { symbol: "RELIANCE", name: "Reliance Industries Limited" },
  { symbol: "TCS", name: "Tata Consultancy Services" },
  { symbol: "INFY", name: "Infosys Limited" },
  { symbol: "HDFC", name: "HDFC Bank Limited" },
  { symbol: "ICICIBANK", name: "ICICI Bank Limited" },
  { symbol: "HDFCBANK", name: "HDFC Bank Limited" },
  { symbol: "KOTAKBANK", name: "Kotak Mahindra Bank Limited" },
  { symbol: "LT", name: "Larsen & Toubro Limited" },
  { symbol: "BAJFINANCE", name: "Bajaj Finance Limited" },
  { symbol: "ASIANPAINT", name: "Asian Paints Limited" },
  { symbol: "SUNPHARMA", name: "Sun Pharmaceutical Industries Limited" },
  { symbol: "MARUTI", name: "Maruti Suzuki India Limited" },
  { symbol: "M&M", name: "Mahindra & Mahindra Limited" },
  { symbol: "TITAN", name: "Titan Company Limited" },
  { symbol: "BHARTIARTL", name: "Bharti Airtel Limited" },
  { symbol: "ADANIENT", name: "Adani Enterprises Limited" },
  {
    symbol: "ADANIPORTS",
    name: "Adani Ports and Special Economic Zone Limited",
  },
  { symbol: "ONGC", name: "Oil and Natural Gas Corporation" },
  { symbol: "ITC", name: "ITC Limited" },
  { symbol: "SBIN", name: "State Bank of India" },
];

export const sampleStockData = [
  {
    symbol: "RELIANCE",
    timestamp: "2024-03-14T09:30:00Z",
    open: 2450.0,
    high: 2505.5,
    low: 2442.2,
    close: 2480.0,
    volume: 3200000,
  },
  {
    symbol: "TCS",
    timestamp: "2024-03-14T09:30:00Z",
    open: 3450.0,
    high: 3500.0,
    low: 3440.0,
    close: 3485.0,
    volume: 2200000,
  },
  {
    symbol: "INFY",
    timestamp: "2024-03-14T09:30:00Z",
    open: 1580.0,
    high: 1605.0,
    low: 1575.0,
    close: 1595.0,
    volume: 1800000,
  },
  {
    symbol: "HDFC",
    timestamp: "2024-03-14T09:30:00Z",
    open: 2800.0,
    high: 2850.0,
    low: 2785.0,
    close: 2830.0,
    volume: 2500000,
  },
  {
    symbol: "ICICIBANK",
    timestamp: "2024-03-14T09:30:00Z",
    open: 925.0,
    high: 940.0,
    low: 920.0,
    close: 935.0,
    volume: 2700000,
  },
  {
    symbol: "HDFCBANK",
    timestamp: "2024-03-14T09:30:00Z",
    open: 1570.0,
    high: 1600.0,
    low: 1565.0,
    close: 1590.0,
    volume: 2300000,
  },
  {
    symbol: "KOTAKBANK",
    timestamp: "2024-03-14T09:30:00Z",
    open: 1725.0,
    high: 1755.0,
    low: 1715.0,
    close: 1745.0,
    volume: 2000000,
  },
  {
    symbol: "LT",
    timestamp: "2024-03-14T09:30:00Z",
    open: 3200.0,
    high: 3250.0,
    low: 3185.0,
    close: 3230.0,
    volume: 1500000,
  },
  {
    symbol: "BAJFINANCE",
    timestamp: "2024-03-14T09:30:00Z",
    open: 7100.0,
    high: 7200.0,
    low: 7050.0,
    close: 7150.0,
    volume: 1800000,
  },
  {
    symbol: "ASIANPAINT",
    timestamp: "2024-03-14T09:30:00Z",
    open: 3050.0,
    high: 3100.0,
    low: 3035.0,
    close: 3080.0,
    volume: 1400000,
  },
  {
    symbol: "SUNPHARMA",
    timestamp: "2024-03-14T09:30:00Z",
    open: 1090.0,
    high: 1110.0,
    low: 1080.0,
    close: 1105.0,
    volume: 1250000,
  },
  {
    symbol: "MARUTI",
    timestamp: "2024-03-14T09:30:00Z",
    open: 9600.0,
    high: 9750.0,
    low: 9550.0,
    close: 9700.0,
    volume: 1600000,
  },
  {
    symbol: "M&M",
    timestamp: "2024-03-14T09:30:00Z",
    open: 1680.0,
    high: 1725.0,
    low: 1665.0,
    close: 1705.0,
    volume: 1550000,
  },
  {
    symbol: "TITAN",
    timestamp: "2024-03-14T09:30:00Z",
    open: 3300.0,
    high: 3350.0,
    low: 3280.0,
    close: 3325.0,
    volume: 1400000,
  },
  {
    symbol: "BHARTIARTL",
    timestamp: "2024-03-14T09:30:00Z",
    open: 910.0,
    high: 925.0,
    low: 900.0,
    close: 915.0,
    volume: 2100000,
  },
  {
    symbol: "ADANIENT",
    timestamp: "2024-03-14T09:30:00Z",
    open: 2860.0,
    high: 2905.0,
    low: 2840.0,
    close: 2890.0,
    volume: 1900000,
  },
  {
    symbol: "ADANIPORTS",
    timestamp: "2024-03-14T09:30:00Z",
    open: 1250.0,
    high: 1275.0,
    low: 1235.0,
    close: 1260.0,
    volume: 1750000,
  },
  {
    symbol: "ONGC",
    timestamp: "2024-03-14T09:30:00Z",
    open: 190.0,
    high: 195.0,
    low: 185.0,
    close: 192.0,
    volume: 2200000,
  },
  {
    symbol: "ITC",
    timestamp: "2024-03-14T09:30:00Z",
    open: 430.0,
    high: 440.0,
    low: 425.0,
    close: 435.0,
    volume: 2600000,
  },
  {
    symbol: "SBIN",
    timestamp: "2024-03-14T09:30:00Z",
    open: 600.0,
    high: 615.0,
    low: 590.0,
    close: 610.0,
    volume: 2800000,
  },
];

export const historicalPrices = {
  RELIANCE: [2450, 2480, 2475, 2490, 2500, 2550, 2600, 2580, 2620, 2650],
  TCS: [3450, 3485, 3490, 3475, 3505, 3550, 3600, 3625, 3650, 3680],
  INFY: [1580, 1595, 1600, 1585, 1610, 1625, 1650, 1670, 1690, 1700],
  HDFC: [2800, 2830, 2825, 2810, 2850, 2880, 2900, 2925, 2950, 2980],
  ICICIBANK: [925, 935, 930, 940, 950, 960, 970, 975, 980, 990],
  HDFCBANK: [1570, 1590, 1585, 1600, 1610, 1625, 1630, 1645, 1660, 1675],
  KOTAKBANK: [1725, 1745, 1735, 1760, 1780, 1800, 1815, 1825, 1840, 1855],
  LT: [3200, 3230, 3210, 3245, 3260, 3280, 3300, 3325, 3350, 3375],
  BAJFINANCE: [7100, 7150, 7120, 7180, 7200, 7250, 7300, 7350, 7400, 7450],
  ASIANPAINT: [3050, 3080, 3065, 3100, 3125, 3150, 3175, 3200, 3225, 3250],
  SUNPHARMA: [1090, 1105, 1095, 1110, 1125, 1135, 1145, 1160, 1175, 1190],
  MARUTI: [9600, 9700, 9650, 9750, 9800, 9900, 10000, 10100, 10200, 10300],
  MM: [1680, 1705, 1695, 1720, 1740, 1760, 1780, 1800, 1820, 1840],
  TITAN: [3300, 3325, 3310, 3340, 3360, 3385, 3400, 3425, 3450, 3475],
  BHARTIARTL: [910, 915, 920, 925, 930, 940, 950, 960, 970, 980],
  ADANIENT: [2860, 2890, 2875, 2910, 2930, 2950, 2970, 2990, 3010, 3030],
  ADANIPORTS: [1250, 1260, 1245, 1275, 1290, 1305, 1320, 1335, 1350, 1370],
  ONGC: [190, 192, 194, 196, 198, 200, 202, 204, 206, 208],
  ITC: [430, 435, 440, 445, 450, 455, 460, 465, 470, 475],
  SBIN: [600, 610, 605, 620, 630, 640, 650, 660, 670, 680],
};
