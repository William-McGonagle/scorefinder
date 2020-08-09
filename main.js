const path = require('path');
const fs = require('fs');

// Bad code practice, but I want to make this asyncronous
async function main() {

  var command = process.argv[2];
  var package = process.argv[3];

  if (command == undefined) return console.log("Please Specify a Command.");
  if (!fs.existsSync(`./branches/${command}.js`)) return console.log("Specified Command Does Not Exist.");

  if (package == undefined) return console.log("Package Parameter Must Be Given.");

  await require(`./branches/${command}.js`).run(package);

  process.exit(0);

}

main();
