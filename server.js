var init = require('./app/config/init')(),
    settingsConfig = require('./app/config/env-config'),
    config = require('./app/config/env-config'),
    mongoose = require('mongoose'),
    chalk = require('chalk');

//Connect to db
var db = mongoose.connect(config.db, {}, function (err) {
  if (err) {
    console.error(chalk.red('Could not connect to MongoDb'));
    console.log(chalk.red(err));
  }
});

require('./app/config/express-config.js')(db);
