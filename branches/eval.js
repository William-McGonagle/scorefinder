const fetch = require("node-fetch");

// ✅
// ❌

var npmFunctions = [
  async function (data) {

    if (data.collected.metadata.version == undefined) return "🧐 No Version";
    if (data.collected.metadata.version.split(".")[0] == "0") return "❌ Version Below 1.0.0";
    return "✅ Version Above 1.0.0";

  },
  async function (data) {

    if (data.collected.metadata.dependencies == undefined) return "✅ Low Dependency Count";
    if (Object.keys(data.collected.metadata.dependencies).length > 3) return "❌ High Dependency Count (" + Object.keys(data.collected.metadata.dependencies).length + ")";
    return "✅ Low Dependency Count (" + Object.keys(data.collected.metadata.dependencies).length + ")";

  },
];

var readmeFunctions = [
  async function (data) {
    // Get Image Count

    if (data.collected.metadata.readme == undefined) return "🧐 No Readme";

    var regex = /(?:!\[(.*?)\]\((.*?)\))/g;
    var matchCount = ((data.collected.metadata.readme || '').match(regex) || []).length;

    if (matchCount < 3) return "❌ Low Image Count (" + matchCount + ")";
    return "✅ High Image Count (" + matchCount + ")";

  },
  async function (data) {
    // Get Link Count

    if (data.collected.metadata.readme == undefined) return "🧐 No Readme";

    var regex = /(!|)\[.+\]\(.+\)/g;

    var linksAndImages = ((data.collected.metadata.readme || '').match(regex) || []);
    var links = [];

    for (var i = 0; i < linksAndImages.length; i++) {

      if (!linksAndImages[i].startsWith("!")) links.push(linksAndImages[i]);

    }

    var matchCount = links.length;

    if (matchCount < 3) return "❌ Low Link Count (" + matchCount + ")";
    return "✅ High Link Count (" + matchCount + ")";

  },
  async function (data) {
    // Check if Top has Name of Project

    if (data.collected.metadata.readme == undefined) return "🧐 No Readme";

    var lines = data.collected.metadata.readme.split("\\n");

    if (lines[0].toUpperCase().includes(data.collected.metadata.name.toUpperCase()) && lines[0].startsWith("#")) return "✅ Has a Title";

    return "❌ No Title Found";

  },
  // async function (data) {
  //   // Check if Second Line has Description
  //
  //   if (data.collected.metadata.readme == undefined) return "🧐 No Readme";
  //
  //   var lines = data.collected.metadata.readme.split("\\n");
  //   if (lines[1] == undefined) return "❌ Make Second Line a Subheading & Short-description";
  //
  //   if (lines[1].startsWith("##") || lines[1].startsWith("###")) return "✅ Has Short Description";
  //
  //   return "❌ Make Second Line a Subheading & Short-description";
  //
  // },
  async function (data) {
    // Check for `npm install xyz`

    if (data.collected.metadata.readme == undefined) return "🧐 No Readme";

    var readmeText = data.collected.metadata.readme.toUpperCase();

    if (readmeText.includes("NPM INSTALL " + data.collected.metadata.name.toUpperCase())) return "✅ Includes Installation Instructions";
    if (readmeText.includes("NPM I " + data.collected.metadata.name.toUpperCase())) return "✅ Includes Installation Instructions";
    return "❌ Could Not Find `npm install " + data.collected.metadata.name + "`";

  },
  async function (data) {

    if (data.collected.metadata.links == undefined) return "🧐 No Links";
    if (data.collected.metadata.links.homepage == undefined) return "🧐 No Homepage";

    if (data.collected.metadata.links.homepage.startsWith("https://github.com/")) return "❌ Homepage Should Not Be Github Repository";

    return "✅ Custom Homepage Provided";

  },
];

function bigSection(label) {

  console.log();
  console.log("\033[4m" + label + "\033[0m");

}

function littleSection(label) {

  console.log("\033[1m - " + label + "\033[0m");

}

function indent(text, count) {

  var indentText = new Array(count).join(" ");
  console.log(indentText + " - " + text);

}

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

    bigSection("NPM");

    for (var i = 0; i < npmFunctions.length; i++) {

      var output = await npmFunctions[i](npmsJson);

      indent(output, 0);

    }

    bigSection("Github");
    littleSection("README");

    for (var i = 0; i < readmeFunctions.length; i++) {

      var output = await readmeFunctions[i](npmsJson);

      indent(output, 3);

    }

    bigSection("Publicity");
    littleSection("Social Media");
    indent("Tweeting About It", 3);
    indent("Post It on Instagram With Coding Accounts Tagged- They Will Repost it", 3);
    indent("Create A Blog Post", 3);
    indent("Talk About It on Programming Discord Servers", 3);

  } catch (error) {

    console.log(error);

  }

}

module.exports = {
  run
};
