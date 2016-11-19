'use strict';

const db = require('./_db'),
	  Sequelize = require('sequelize'),
	  Hunter = require('./hunter');


const Team = db.define('Team', {
    name: {
    	type: Sequelize.STRING,
    	defautValue: 'Solomon'
    },
    members: Sequelize.ARRAY()  // How to add members?!
});


module.exports = Team; // make sure you import and export what you intend to!!!
