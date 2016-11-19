const express = require('express'),
	  app = express(),
	  morgan = require('morgan'),
	  bodyParser = require('body-parser'),
	  chalk = require('chalk'),
	  routes = require('./routes'),
	  Hunter = require('../models/hunter'),
	  Team = require('../models/team');


// LOGGING
app.use(morgan('dev'));  // logs incoming requests

// BODY PARSING
app.use(bodyParser.urlencoded({ extended: true }));  // parses encoded URLs, i.e. URLs with query strings
app.use(bodyParser.json());  // parses bodies in JSON format

// STATIC ROUTES
app.use(express.static(__dirname + '/public'));  // EXAMPLE: statically serves public folder






// EXAMPLE OF SETTING UP SERVER TO LISTEN AND SYNC MODELS TABLE
Hunter.sync()  // Create or sync the Hunter table based on the Hunter model's schema
.then(function() {
	return Team.sync();  // Now that the Hunter model is created/synced, create/sync the Team table based on the Team model's schema
})
.then(function() {
	app.listen(3001, function() {  // Now that everything is synced have our server start listening
		console.log('Server is listening on port 3001!');
	});
});





app.use('/', routes); // ANY REQUESTS GO TO ROUTES ROUTER





// custom error handling -- don't understand what this is doing
app.use(function(err, req, res, next) {
    // clean up the trace to just relevant info
    var cleanTrace = err.stack
        .split('\n')
        .filter(line => {
            var notNodeInternal = line.indexOf(__dirname) > -1;
            var notNodeModule = line.indexOf('node_modules') === -1;
            return notNodeInternal && notNodeModule;
        })
        .join('\n');
    // colorize and format the output
    console.log(chalk.magenta('      ' + err.message));
    console.log('    ' + chalk.gray(cleanTrace));
    // send back error status
    res.status(err.status || 500).end();
});



// EXPORTING IS BUILT-IN FOR TEST:
module.exports = app;