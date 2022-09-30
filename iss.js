const request = require('request');

const fetchMyIP = function (callback) {
  request('https://api.ipify.org/?format=json', (error, response, body) => {
    if (error) {
      return callback(error, null);
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statuscode} when fetching IP. Response: ${body}`;
      return callback(Error(msg), null);
    }

    const data = JSON.parse(body);
    return callback(null, data.ip);
  });
};

const fetchCoordsByIp = function (ip, callback) {
  request(`http://ipwho.is/${ip}`, (error, response, body) => {
    if (error) {
      return callback(error, null);
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statuscode} when fetching coordinates. Response: ${body}`;
      return callback(Error(msg), null);
    }

    const responseCheck = JSON.parse(body);

    if (!responseCheck.success) {
      return callback(`IP is invalid, please enter a valid IP. The response is: ${responseCheck.message}`, null);
    }
    return callback(null, [responseCheck.longitude, responseCheck.latitude, responseCheck.timezone]);
  })
}

const fetchISSFlyOverTimes = function (coords, callback) {
  request(`https://iss-flyover.herokuapp.com/json/?lat=${coords[1]}&lon=${coords[0]}&alt=2`, (error, response, body) => {
    if (error) {
      return callback(error, null);
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statuscode} when fetching times. Response: ${body}`;
      return callback(Error(msg), null);
    }

    const risetime = JSON.parse(body).response;
    return callback(null, [risetime, coords[2]]);
  })
}

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }
    fetchCoordsByIp(ip, (error, data) => {
      if (error) {
        return callback(error, null);
      }
      fetchISSFlyOverTimes(data, (error, flyOverData) => {
        if (error) {
          console.log("It didn't work!", error);
          return;
        }
      
      return callback(null, flyOverData);
      });
    });
  });
}

module.exports = { nextISSTimesForMyLocation };