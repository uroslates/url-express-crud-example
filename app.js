
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , mongoose = require('mongoose')
  , crud = require('url-express-crud')
  , Product = require('./models/product');

// Database connection
mongoose.connect('mongodb://localhost/url_express_crud_example');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);


// Using url-express-crud for  exposing Product's model CRUD operations
var productCrudRoutes = new crud.CRUDRouter({
  app: app
  , Model: Product
  // Custom templates configuration
  , templates: {
    rootDir: 'products/'
    , list: '../generic/list'
  }
  // Override base uri for the model configured
  , routeBaseUri: '/products/'
  // Override context variable name
  , resourceRequestParamName: 'product'
  // Override context variable name
  , resourceRequestParamNamePlural: 'products'
  // Customize list route
  , routes: {
      list: [
        // Request type (verb)
        'get'
        // Configuration array: [<uri>, [middleware, ...], <route handler function>]
        , [
          // URI
          '/products/'
          // Custom middleware
          , function(res, req, next) {
            console.log('\n\n\t* CUSTOM LIST <ROUTE MIDDLEWARE> EXECUTING...');
            next();
          }
          // Custom route handler
          , function(req, res, next) {
            console.log('\n\n\t* CUSTOM LIST <ROUTE> EXECUTING...\n\n');
            res.end('Custom LIST route!');
          }
        ]
      ]
    }
});


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
