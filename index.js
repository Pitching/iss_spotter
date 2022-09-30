const { nextISSTimesForMyLocation } = require('./iss');

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error)
  }

  cycleThroughFlyoverTimes(passTimes);
})

const cycleThroughFlyoverTimes = function (flyover) {
  console.log(flyover);
  console.log(`The next ISS passes for ${flyover[1].id}`)
  for (let each of flyover[0]) {
    let datetime = new Date(0); 
    datetime.setUTCSeconds(each.risetime);
    console.log(`Next pass at ${datetime.toLocaleString('en-US', {timezone: flyover[1].id})} ${flyover[1].abbr} for ${each.duration} seconds!`)
  }
}