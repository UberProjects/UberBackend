# UberCU Backend

## Application structure 

app:
  - config
      - env (dir)
      - routes (dir)
      - strategies (dir)
      - env-config.js 
      - init.js
      - passport.js
      - route-config.js
  - controllers
      - v1
        - users
  - models
  - utils

server.js

##Config
Sets up the express server and all other application configuration 

###Env
Contains all of the parameters for the various deployment modes

###Routes
Contains a json files that defines the various application routes 
All json files in this directory will be loaded into the express application 
and must follow the existing format. See user.route.config.json for an example

general route definition is:
```json
{
    "route":"", //http route to be called from cordova
    "method":"", //standard http methods i.e get, put, ect
    "action":"", //the method to be called from the controller**
    "auth":"", //true or false value specifies if passport auth is needed
    "controller":""//realtive path to controller
}
```
**Controllers must be defined using a certain pattern for routes 
to work properly**

###Strategies
Used to define passport strategies i.e google login, git login, ect 
see [Passportjs](http://passportjs.org) for more info

###Additional config files 
env-config: combines needed configuration vars based on NODE_ENV
init.js: called on start up to ensure proper NODE_ENV setting (defaults to dev)
passport.js: loads all strategies defined in config/strategies
express-config.js: sets express server settings see [Express](http://expressjs.com) for more info
route-config.js: loads routes defined in routs folder

##Controllers
Contains business logic for application 

In order to be loaded by the application general structure must be

```javascript
function ControllerName(){} 

function foo(){}//Controller function

ControllerName.prototype = {
    foo:foo
}//allows text definition of actions

module.exports = new ControllerName();
```
Also please add routes to the v1 directory to allow for easy 
versioning of our routes (good practice for API development)

##Models
Basic mongodb models created with mongoose
All files in the models directory will be automatically loaded 
 
See [MongoDb](https://docs.mongodb.org/manual/?_ga=1.238033031.625878898.1449207345) and [Mongoose](http://mongoosejs.com/) for more information

Note we are using mongoose version 3.8.8 due to issues connecting with v4

##Utils
Place all utility files in app/utils:

for example utils.js currently has a helper function that globs needed
application files     

## Needed env vars
####NODE_ENV
used to set application mode and load needed configurations 

Modes:
  - Development 
  - Production 
  - Test
  - Secure (Need to modify express-config to work)    

####MONGO_DB_URI
used to connect to a mongodb. Stores users, sessions, ect

(Note if you use a mongoLabs db random disconnects can occure just restart the app)
send an email to matt for access to hosted mongodb instance

