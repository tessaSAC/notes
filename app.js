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
app.use('/files', express.static('/public/staticFiles')); // Statically serves staticFiles folder mounted on route 'files'






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





// MOUNTING
app.use('/', routes); // ANY REQUESTS GO TO ROUTES ROUTER; MOUNTED ON '/'



// EXAMPLE OF SAVING PARAMS -- APP.PARAM: http://expressjs.com/en/4x/api.html#app.param
app.param('teamId', function (request, response, next, id) {
	request.body.teamId = parseInt(id, 10);  // ID WILL BE A STRING
	next();
});
app.use('/:teamId/agents', agents); // Passes to `agents` router


// IN `agents.js`, MAYBE IN AN `app.use`:
// if (!request.body.teamId) next(err);  // Defensive programming
// const teamId = request.body.teamId;  // Access ID once at top of page





// EXAMPLE OF *SYNCHRONOUS* ERROR HANDLING:
app.get('/errEnd', function(request, response, next){

	// ONE OPTION: IF SYNCHRONOUSLY THROWN ERROR -- CAUGHT BY EXPRESS AND USES DEFAULT ERROR HANDLING MIDDLEWARE TO THROW ERR WITH STATUS 500:
	throw Error('This route is broken'); // `throw` ANALOGOUS TO `return`; IT *STOPS* THE FUNCTION!
		// DOESN'T WORK IN ASYNC BECAUSE THE CALLBACK IS QUEUED FOR WHEN THE CALL STACK IS EMPTY
		// THE MIDDLEWARE FUNCTION ENDS AND NO RESPONSE IS SENT
		// THE LATER THIS FUNCTION IS CALLED BACK AND THROWS AN ERROR, BUT EXPRESS IS GONE NOW (OUT OF THE CONTEXT)
		// THEREFORE EXPRESS IS NO LONGER WRAPPING THE FUNCTION (WHICH IT DOES WITH TRY...CATCH) AND THERE IS NO MORE ERROR HANDLING
		// SO THE ERROR CAUSES JS TO CRASH AS PER USUAL BECAUSE THE ERROR BUBBLES UP TO THE GLOBAL OBJECT (NODE) WHICH CAUSES PROGRAM TO CRASH
	// *HOWEVER* CAN USE `next` WHICH LETS US MOVE ON TO NEXT POSSIBLE MIDDLEWARE (PREVIOUSLY WE COULD NOT)
	// ALSO LETS US TELL EXPRESS THERE'S BEEN AN ERROR
	// SO NOW THE ERROR WHEN IT COMES OFF THE CALL STACK IT'S STILL IN EXPRESS AND SENT TO THE NEXT ERROR HANDLING MIDDLEWARE



	// A WAY TO SPECIFICALLY SET ERROR CODE RESPECTED BY `.status` PROP AND USES THAT AS THE CODE
	const err = Error("You're not allowed in here!");
	err.status = 403;
	throw err;

	// ALSO:
	// const err = new Error("Verboten"); // JS way
	// err.status = 403;
	// err.message = "No boys allowed"

	// ALT USING EXTRAPOLATED ERROR HANDLING FUNCTION:
	throw HTTPerror(403, "You shall not pass!");  // WITH AYSYNC, EXPRESS HANGS BECAUSE NO RESPONSE IS SENT



	// ASYNC EXAMPLE -------------
	Hunter.findOne()
	.then(hunter => {
		if (!hunter) throw HTTPerror(404, 'Hunter not found!!');
	})
	// NEED TO CATCH BECAUSE OTHERWISE IT WILL EITHER RESULT IN A REJECTED PROMISE OR HANG
	.catch(next)  // VERY IDIOMATIC, CATCHES THE THROWN ERROR AND SENDS IT TO NEXT ERROR HANDLING MIDDLEWARE
	// ALT WOULD BE TO: next(Httperror(403, 'Hunter not found!')); IN `if` STATEMENT
	// BUT THIS DOESN'T PARALLEL THE 'try...catch' STYLE ORGANIZATION OF EXPRESS
	// TL;DR IF YOU `throw` AN ERROR IN AN ASYNC FUNCTION YOU NEED TO `catch` IT SOMEHOW
	// ---------------------------

});

// MODULAR HTTPERROR FUNCTION
function HTTPerror (status, message) {
	const err = Error(message);
	err.status = status;
	return err;
}




// EXAMPLE OF WRITING OWN DEFAULT ERROR HANDLER
// YOU WOULD ONLY ADD THIS IF YOU WANTED TO CHANGE THE DEFAULT ERROR STATUS CODE
// *DON'T* THROW THE ERROR IN HERE BECAUSE THIS IS THE PLACE WHERE ALL THE THROWN ERRORS ARE CAUGHT!!!!!!
// ERROR-HANDLING MIDDLEWARE SHOULD EITHER CALL `next` WITH THE ERROR OR SEND A RESPONSE (USUALLY NOT BOTH)
app.use(function(err, request, response, next) {  // WE KNOW IT'S AN ERROR HANDLER BECAUSE IT TAKES 4 ARGUMENTS
	console.error(err);
	// SETS STATUS TO SPECIFIED STATUS OR DEFAULT 500, SETS MSG TO SPECIFIED OR DEFAULT AND SENDS ERROR RESPONSE
	response.status(err.status || 500).send(err.message || "I have failed -- knock on wood");
});



module.exports = app;