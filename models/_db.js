'use strict';

// MAKE SURE TO RUN POSTGRES!!!

const Sequelize = require('sequelize');

// SEQUELIZE CONSTRUCTOR EXPECTS LOCATION WHERE DB IS RUNNING AND NAME OF DB:
module.exports = new Sequelize('postgres://localhgost:5432/witchHunter', { logging: false });  // 2nd ARG TURNS OFF LOGGING
// DON'T FORGET TO EXPORT AND `createdb witchHunter` IN TERMINAL!!!