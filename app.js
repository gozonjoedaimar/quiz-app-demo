const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const debug = require('debug')('quiz-app-demo:app.js');
const glob = require('glob');
const sqlite3 = require('sqlite3');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const migrate = require('./app/database/migrate');

global.local_require = function(local_path) {
  return require(path.resolve(__dirname, local_path));
};

// DB
global.db = new sqlite3.Database('app/database/database.sqlite', function(error) {
  if (error) {
    return debug(error.message);
  }
  debug('Connected to the database');
});

migrate(db);

process.on('SIGINT', function() {
  db.close(function(error) {
    if (error) {
      debug(error.message);
      return process.exit();
    }
    debug('Database closed');
    process.exit();
  });
});

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// TODO: auth id
app.use(function(req, res, next){
  req.userID = 1;
  next();
})

app.use('/', indexRouter);
app.use('/users', usersRouter);

// Include api route files
let globdata = [];
let result = glob.sync('routes/api/**/*.js', { cwd: path.resolve() });

// Define api routes
(function(result) {
  // parse path
  result = result.map( item => ({...path.parse(item), fullpath: item}) );

  // generate route group
  result = result.map( item => ({ ...item, routegroup: path.dirname(item.fullpath.replace('routes/api','')) }) )

  // generate route name
  result = result.map( item => ({ ...item, routename: path.resolve(item.routegroup, item.name) }) )
  
  globdata = result;
  
  // initiate api routes
  globdata.map( info => {
    app.use(`/api${info.routename}`, require('./'+info.fullpath))
  });
})(result);

// console.log(globdata);

// app.use('/debug', function(req, res) {
//   res.send(globdata);
// });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  if (req._parsedUrl.pathname.includes('/api/')) {
    res.send(err.message);
  }
  else {
    res.render('error');
  }
});

module.exports = app;
