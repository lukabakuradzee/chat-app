const dotenv = require("dotenv");
dotenv.config();

const getGeoLocation = async (ipAddress) => {
  try {
    const apiKey = process.env.GEO_LOCATION_API_KEY;
    const url = `https://api.ipgeolocation.io/ipgeo?apiKey=${apiKey}&ip=${ipAddress}`;

    const response = await fetch(url);
    const data = await response.json();

    console.log('data: ', data)

    if (response.ok) {
        return {
          ip: data.ip || "unknown",
          country: data.country_name || "unknown",
          city: data.city || "unknown",
          district: data.district || "unknown",
          latitude: data.latitude || "unknown",
          longitude: data.longitude || "unknown",
          zipCode: data.zipcode || 'unknown',
          serviceProvider: data.isp ||"unknown",
        };
      }

      
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