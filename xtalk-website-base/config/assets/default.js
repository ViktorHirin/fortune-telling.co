'use strict';

/* eslint comma-dangle:[0, "only-multiline"] */

module.exports = {
  client: {
  },
  server: {
    allJS: ['server.js', 'config/**/*.js', 'api/**/*.js'],
    models: 'models/**/*.js',
    routes: ['routers/*.js'],
    sockets: 'sockets/**/*.js',
    handleEvents:['events/*.js']
//    policies: 'modules/*/server/policies/*.js',
//    views: ['modules/*/server/views/*.html']
  }
};
