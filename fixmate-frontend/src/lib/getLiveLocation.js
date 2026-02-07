export const getLiveLocation = async () => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const data =await response.json();
            const address = `${data.locality}, ${data.city}, ${data.countryName}`;
            resolve(address);
          } catch (error) {
            reject("Unable to retrieve your location");
          }
        },
        (error) => {
          reject("Unable to retrieve your location");
        }
      );
    } else {
      reject("Geolocation is not supported by this browser.");
    }
  });
};
