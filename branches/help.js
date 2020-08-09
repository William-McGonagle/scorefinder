var commands = {
  "eval": "Displays a detailed summary about improvements, problems, and positives for the specified NPM project. Note: the second parameter is the project name on NPM.",
  // "score": "Show NPM's current search score for the specified project. Note: the second parameter is the project name on NPM.",
  // "forecastDownloads": "Displays a forecast for how the downloads will pan out. With the -csv tacked onto the end of the command, a `downloads-forecast.csv` file will be generated in the current working directory. Note: the second parameter is the project name on NPM.",
  // "forecastStars": "Displays a forecast for how the stars will pan out on Github. With the -csv tacked onto the end of the command, a `stars-forecast.csv` file will be generated in the current working directory. Note: the second parameter is the project name on NPM."
};

async function run() {

  for (var command in commands) {

    console.log("\n👉 \033[4m" + command + "\033[0m\n" + commands[command]);

  }

}

module.exports = {
  run
};
