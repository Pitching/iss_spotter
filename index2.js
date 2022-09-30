const { nextISSTimesForMyLocation } = require('./iss_promised');

nextISSTimesForMyLocation()
  .then((ISSTimes) => {
    for (const each of ISSTimes) {
      const datetime = new Date(0);
      datetime.setUTCSeconds(each.risetime);
      console.log(`Next pass at ${datetime} for ${each.duration} seconds!`);
    }
  })
  .catch((error) => {
    console.log(error);
  })