const express = require('express'),
      router = express.Router(),
      Hunter = require('../models/hunter');

// WHAT IF WE WANT TO GET ALL THE HUNTERS?
router.get('/hunters', function(request, response, next) {
    Hunter.findAll() // FINDS ALL HUNTERS AND RETURNS A *PROMISE* FOR THEM
        .then(function(hunters) { // IN THE CALLBACK `hunters` EXIST AND WE CAN SEND THEM
            response.send(hunters);
        })
        // ALT:
        // .catch(function(error) {
        // 		response.send(404);
        // })
        .catch(next);  // If we pass  Express' default `next` function a truthy object it will send that object to the NEXT error handler
});

// EXAMPLE OF USING PARAMS:
router.get('/hunters/:id', function(request, response, next) {
    // ALT: Hunter.findOne( { where: id: request.params.id })
    Hunter.findById(request.params.id)
    	// RETURNS A PROMISE FOR AN ARTICLE
        .then(function(hunter) {
        	// THREE POSSIBILITIES:
        	// 1. Find the hunter
        	// 2. Server error
        	// 3. Find no hunter = successful query that went nowhere -- therefore it will send 200!!
        	hunter
        		? response.send(hunter)
        		: response.sendStatus (404);
        })
        .catch(next);
});

// don't understand what this is doing
router.post('/hunters', function(request, response, next) {
	// DATA COMES IN ON THE REQUEST BODY
	// e.g.:
	// {
	// 		name: 'Robin',
	// 		powers: ['pyrokinesis', 'force fields'],
	// 		// defaultValue of timesDeployed: 0
	// }
	//
	// REDUNDANT ALT (All this stuff is already on the body!!)
	// Hunter.create({
	// 		name: request.body.name,
	// 		powers: request.body.powers
	// })
    Hunter.create(request.body)
        .then(function(newHunter) {
        	// WHAT IF I WANT TO SEND BACK A BODY WITH PROPS OF MY OWN CHOOSING? (Probably should *NOT* demo this!!)
            // response.json({
            //     message: 'Successfully added hunter to team!',
            //     hunter: newHunter
            // });
            response.send('Successfully added hunter to team!');
            // DIFF BETW SENDING BACK `newHunter` AND `request.body`?
            // `newHunter` IS THE *ACTUAL* INSTANCE FROM THE DATABASE
            // `request.body` IS THE DATA PASSED IN TO CREATE THE INSTANCE (DOESN'T HAVE GET METHODS, ETC.)
        })
        // IF ERROR IT DOESN'T PASS VALIDATION; DEFAULT TO 500
        .catch(next);
});



// PUT = TO *CREATE* OR *MODIFY*
// EXAMPLE: WANT TO UPDATE NAME
// {
// 		name: 'Robin Sena'
// }

router.put('/hunters/:id', function(request, response, next) {
	Hunter.findById(request.params.id)
	.then(function(foundHunter) {
		// ONE WAY TO UPDATE; VERY HARD-CODED:
		// foundHunter.name = request.body.name;  // UPDATES FOUND INSTANCE

		// SECOND WAY; TWO STEPS:
		// foundHunter.set(request.body);  // `set` TAKES AN OBJECT OF KEY-VALUE PAIRS AND UPDATES THE MATCHING PROPERTIES
		// return foundHunter.save();  // SENDS CHANGES TO DB AND RETURNS UPDATED INSTANCE IN A PROMISE

		// THIRD WAY; ONE STEP:
		return foundHunter.update(request.body); // Both `set`s and `save`s
		// SAFER because it's 'atomic'; either it both updates and saves or doesn't do either
	}).then(function(updatedHunter) {
		response.send(updatedHunter);
	})
	.catch(next);


	// SO WE DON'T EVEN NEED TO FIND THE INSTANCE SEPARATELY TO UPDATE; WE CAN UPDATE DIRECTLY FROM THE MODEL:
    Hunter.update(request.body, {  // 1ST ARG: VALUE | 2ND ARG: `OPTIONS` -- TAKES THE `WHERE`
        where: { id: request.params.id },  // UPDATE ALL INSTANCES WHERE THE ID IS A MATCH
        returning: true  // *POSTGRES-ONLY* THING -- UPDATES AND THEN *SENDS BACK THE THING WE CHANGED*
        // RETURNS AN ARRAY WITH THINGS WE CHANGED; IN THIS CASE IT HAS TWO ELEMENTS; # OF AFFECTED ROWS, IF `returning: true` 2ND IS AFFECTED ROWS
    })

    // REMEMBER, A PROMISE ALWAYS RETURNS ONLY ONE VALUE
    .then(function(promisedArray) {
    	const numRows = promisedArray[0],
    		  updatedRows = promisedArray[1];
    // ALTERNATIVELY, CAN USE BLUEBIRD'S `.spread` TO SPREAD ARRAY VALUES ACROSS MULTIPLE PARAMS:
    .spread(function(numRows, updatedRows)) {

        response.send(updatedRows[0]);  // SENDS 1ST ELEMENT WHICH IS THE UPDATED THING
    })
    .catch(next);
});
module.exports = router;
