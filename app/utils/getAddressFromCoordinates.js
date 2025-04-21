import * as Location from "expo-location";

const getAddressFromCoordinates = async (latitude, longitude) => {
  try {
    const place = await Location.reverseGeocodeAsync({ latitude, longitude });

    if (place.length > 0) {
      const { city, district, region, country } = place[0];
      return `${district || city}, ${region}, ${country}`;
    } else {
      return "Address not found";
    }
  } catch (error) {
    console.error("Error fetching address:", error);
    return "Error fetching address";
  }
};

export default getAddressFromCoordinates;
