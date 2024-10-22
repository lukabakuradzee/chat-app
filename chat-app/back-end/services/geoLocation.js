const dotenv = require("dotenv");
dotenv.config();

const getGeoLocation = async (ipAddress) => {
  try {
    const apiKey = process.env.GEO_LOCATION_API_KEY;
    const url = `https://api.ipgeolocation.io/ipgeo?apiKey=${apiKey}&ip=${ipAddress}`;

    const response = await fetch(url);
    const data = await response.json();

    if (response.ok) {
        return {
          ip: data.ip || "unknown",
          country: data.country_name || "unknown",
          city: data.city || "unknown",
          district: data.district || "unknown",
          zipCode: data.zipCode || 'unknown',
          serviceProvider: data.isp ||"unknown",
        };
      }

      ip, district, zipCode, serviceProvider
  
      return {
        country: "unknown",
        city: "unknown",
      };
    } catch (error) {
      console.error('Error fetching geolocation:', error.message);
      return {
        country: "unknown", // Set default to "unknown"
        city: "unknown", // Set default to "unknown"
      };
    }
  };
  


module.exports = {getGeoLocation}