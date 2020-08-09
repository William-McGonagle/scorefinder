const fetch = require("node-fetch");

async function run(packageName) {

  var npmsUrl = `https://api.npms.io/v2/package/${packageName}`;

  try {

    const npmsResponse = await fetch(npmsUrl);
    const npmsJson = await npmsResponse.json();

    if (npmsJson.code != undefined) return console.log("Package Not Found.");

    bigSection("Overall");
    indent("Name: " + packageName, 0);
    indent("Version: " + npmsJson.collected.metadata.version, 0);
    littleSection("NPM Score: " + (Math.round(npmsJson.score.final * 10000) / 100) + "%");
    indent("Quality: " + (Math.round(npmsJson.score.detail.quality * 10000) / 100) + "%", 3);
    indent("Popularity: " + (Math.round(npmsJson.score.detail.popularity * 10000) / 100) + "%", 3);
    indent("Maintenance: " + (Math.round(npmsJson.score.detail.maintenance * 10000) / 100) + "%", 3);

  } catch (error) {

    console.log(error);

  }

}

module.exports = {
  run,
};
