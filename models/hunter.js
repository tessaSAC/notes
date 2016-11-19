'use strict';


const db = require('./_db'),
      Sequelize = require('sequelize'),
      Team = require('./team');


const Hunter = db.define('Hunter', {

    name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    powers: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: [],
        get: function() {
            return this.getDataValue('powers').join(', ');
        }
    },
    timesDeployed: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    }

}, {

    getterMethods: { // `this`: the instance
        mainPower: function() {
            if (!this.powers.length) return '';
            return this.powers[0];
        }
    },
    instanceMethods: { // `this`: the model
        callMainPower: function() {
            this.powers = this.powers[0];
        }
    },
    classMethods: { // `this`: the class
        findByMainPower: function(power) {
            return this.findOne({ where: { mainPower: power } });
        }
    },
    hooks: { // `this`: the instance
        // note that the `beforeSave` hook is documented but not yet released
        beforeUpdate: function(hunter) {
            ++hunter.timesDeployed;
        }
    }

});

Hunter.belongsTo(Team, { as: 'agent' });


module.exports = Hunter; // DON'T FORGET TO EXPORT