'use strict';

/**
 * Module dependencies
 */

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var debug = require('debug')('Grooper:server');
var http = require('http');

/**
 * Create Express app
 */

var app = express();

/**
 * Get environment variables
 */

var port = process.env.PORT || '3000';
var env = process.env.NODE_ENV || 'development';

/**
 * App setup
 */

// Set envrionment variables
app.set('port', port)
app.set('env', env)

// Use modules
app.use(favicon(__dirname + '/public/images/greenG.png'));
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Use scripts
app.use(express.static(path.join(__dirname, 'public')));
app.use('/src', express.static(__dirname + '/src/'));
app.use('/scripts', express.static(__dirname + '/node_modules/'));

/**
 * Error handlers
 */

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Development error handler
// Print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// Production/Staging error handler
// No stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

/**
 * Run HTTP server on provided port.
 */

console.log('Starting node server');
console.log('PORT=' + app.get('port'));
console.log('NODE_ENV=' + app.get('env'));

var server = http.createServer(app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
