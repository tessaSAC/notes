'use strict';


const db = require('./_db'),
      Sequelize = require('sequelize');
      // Team = require('./team');


const Hunter = db.define('hunter', {

    name: {
        type: Sequelize.STRING,
        // EXAMPLE OF SPECIAL SEQUELIZE-ONLY VALIDATION: DOESN'T ALLOW EMPTY STRING:
        validate: {
            notEmpty: true
        }
    },
    powers: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        // EXAMPLE OF SETTING DEFAULT VALUE
        defaultValue: [],
        // GET: RUNS WHEN WE TRY TO ACCESS THIS PROPERTY
        // DON'T SIMPLY USE `this.powers` BC IT WILL CREATE AN INFINITE LOOP
        get: function() {
            return this.getDataValue('powers').join(', ');  // SEQUELIZE TRICK `this.getDataValue` gets the data w/o infinite loop
        }
    },
    timesDeployed: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    }

}, {


    // METHODS:

    getterMethods: { // `this`: THE INSTANCE
        mainPower: function() {
            return this.powers.length  // IF NO POWERS `return` EMPTY STRING
                ? this.powers[0]
                : '';
        }
    },
    instanceMethods: { // `this`: THE MODEL/CLASS
        isolateMainPower: function() {
            this.powers = this.powers[0];  // MODIFIES THE *INSTANCE* -- DOES *NOT* SAVE TO THE DATABASE!!
        }
    },
    classMethods: { // `this`: THE MODEL/CLASS
        findByMainPower: function(power) {
            return this.findOne({ where: { // WITHOUT `return` GETS PROMISE AND DOESN'T DO ANYTHING WITH IT
                mainPower: power
            } });
        }
    },
    hooks: { // NO `this`
        beforeUpdate: function(hunter) { // HOOKS OPERATE ON INSTANCE BUT IT IS IS PASSED IN TO THE HOOK FUNCTION AS AN ARGUMENT
            ++hunter.timesDeployed;
        }
    }

});



// ASSOCIATION:
// Hunter.belongsTo(Team, { as: 'agent' });  // Each Hunter is stored to Team table as a foreign key -- referenced as 'agent'



module.exports = Hunter; // DON'T FORGET TO EXPORT