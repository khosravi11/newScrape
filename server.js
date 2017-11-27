let express = require('express');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let request = require('request');
let cheerio = require('cheerio');
// Require all models
let db = require('./models');
let PORT = 3000;
// Initialize Express
let app = express();
// Configure middleware
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/news_scraper', {
  useMongoClient: true
});

app.get('/', function (req, res) {
  request('https://news.google.com/news/?gl=US&ned=us&hl=en', function (error, response, html) {
    let $ = cheerio.load(html);
    $('.M1Uqc').each(function (i, element) {
      let title = $(element).children('a.nuEeue').text();
      let url = $(element).children('a.nuEeue').attr('href');
      let time = $(element).children('div.a5SXAc').children('span.oM4Eqe').children('span.d5kXP').text();
      let results = {};

      results.title = title;
      results.url = url;
      if (time) {
        results.time = time;
      } else {
        results.time = 'N/A';
      }
      db.Article
          .create(results)
          .then(function (dbArticle) {
          })
          .catch(function (err) {
            console.log(err);
          });
    });
    res.render('pages/index.ejs');
    if (error) throw error;
  });
});
app.get('/articles', function (req, res) {
  db.Article
    .find({})
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});

app.get('/saved', function (req, res) {
  let results = [];
  db.Saved
    .find({})
    .then(function (dbSaved) {
      results = dbSaved;
      res.render('pages/saved.ejs', {results: results});
      console.log("test", results);
    })
    .catch(function (err) {
      res.json(err);
    });
});

app.post('/articles/:id', function (req, res) {
  let result = {};
  db.Article
    .findOne({_id: req.params.id})
    .then(function (dbArticle) {
      result.title = dbArticle.title;
      result.url = dbArticle.url;
      result.time = dbArticle.time;
      db.Saved
        .create(result)
        .then(function (dbSaved) {
        })
        .catch(function (err) {
          res.json(err);
        });
    })
    .catch(function (err) {
      res.json(err);
    });
});

// Start the server
app.listen(PORT, function () {
  console.log('App running on port ' + PORT + '!');
});
