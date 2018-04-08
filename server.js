let express = require('express');
let bodyParser = require('body-parser');
let request = require('request');
let async = require('async');
let userDetails = new Array();
let PORT = 3000;
// Initialize Express
let app = express();
// Configure middleware
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public')); 



app.get('/', function (req, res) {
function httpGet(url, callback) {
  const options = {
    url :  url,
    method: 'GET',
    headers: {
        'TRN-Api-Key': '502b8d7c-b8bf-4e7d-9a18-c91f9fcb3f77'
        }
  };
  request(options,
    function(err, res, body) {
      callback(err, JSON.parse(body));
    }
  );
}

const urls= [
  "https://api.fortnitetracker.com/v1/profile/psn/khosravi11",
  "https://api.fortnitetracker.com/v1/profile/psn/thefirm",
  "https://api.fortnitetracker.com/v1/profile/psn/njgreco21",
  "https://api.fortnitetracker.com/v1/profile/psn/zoopus"
];

async.map(urls, httpGet, function (err, result){
  if (err) return console.log(err);
  userDetails = result
  res.render('pages/index.ejs', 
    {
      stats: userDetails
    });
});
  
});


app.listen(process.env.PORT || 3000, function () {
  console.log('App running on port ' + PORT + '!');
});
