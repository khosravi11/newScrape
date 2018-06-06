let express = require('express');
let bodyParser = require('body-parser');
let request = require('request');
// Require all models
let db = require('./models');
let PORT = 3000;
// Initialize Express
let app = express();
// Configure middleware
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

app.get('/', function (req, res) {  
      res.render('pages/index.ejs');
});

// Start the server
app.listen(process.env.PORT || 3000, function () {
  console.log('App running on port ' + PORT + '!');
});
