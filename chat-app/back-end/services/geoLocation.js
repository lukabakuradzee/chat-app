const dotenv = require("dotenv");
dotenv.config();

const getGeoLocation = async (ipAddress) => {
  try {
    const apiKey = process.env.GEO_LOCATION_API_KEY;
    const url = `https://api.ipgeolocation.io/ipgeo?apiKey=${apiKey}&ip=${ipAddress}`;

    const response = await fetch(url);
    const data = await response.json();
    if (response.ok) {
      return data;
    }

    console.log('Data: ', data)


    const geoLocation = {
      ipAddress: data.ip,
      country: data.country_name,
      city: data.city,
      latitude: data.latitude,
      longitude: data.longitude,
      serviceProvider: data.isp,
    };

    return geoLocation;
    
  } catch (error) {
    console.error('Error updating geo location', error.message)
    return null;
  }
};


module.exports = {getGeoLocation}