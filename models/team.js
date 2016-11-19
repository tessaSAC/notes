'use strict';

const db = require('./_db'),
	  Sequelize = require('sequelize');
	  // Hunter = require('./hunter');


// CONVENTIONALLY MODEL VARIABLE NAMES ARE CAPITALIZED
const Team = db.define('team', {  // takes name and schema object -- defines fields in object
    name: {
    	type: Sequelize.STRING,  // A Sequelize function as opposed to a primitive type
    	defaultValue: 'Solomon'
    }
    // , members: Sequelize.ARRAY()  // How to add members?!
});


module.exports = Team; // make sure you import and export what you intend to!!!
// CHECK OUT #TPOTW 1 -- can re-slack out later