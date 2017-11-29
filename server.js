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
mongoose.connect('mongodb://heroku_778ccrqs:l5vsmp4uj8nvi1ssp24aqmb7c2@ds121686.mlab.com:21686/heroku_778ccrqs', {
  useMongoClient: true
});

app.get('/', function (req, res) {

  request('https://news.google.com/news/?gl=US&ned=us&hl=en', function (error, response, html) {
   
    let allresults = [];
    let $ = cheerio.load(html);
    let savetodb = true;
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
          .find({})
          .then(function (articles) {
            for (var i = 0; i < articles.length; i++) {
              
              if(url === articles[i].url){
                savetodb = false;
                break;
              } else {savetodb = true; }

            }
          if(savetodb) {
            db.Article
          
          .create(results)
          .then(function (dbArticle) {
          })
          .catch(function (err) {
            console.log(err);
          });     

          }      
          })
          .catch(function (err) {
            console.log(err);
          });

      

      if (i ===10){
        return false;
      }
    });
    db.Article
    .find({})
    .sort({_id: -1})
    .then(function (dbArticles) {
      allresults = dbArticles;
      res.render('pages/index.ejs', {allresults: allresults});

    })
    .catch(function (err) {
      res.json(err);
    });
    if (error) throw error;
  });
});


app.get('/saved', function (req, res) {
  let results = [];
  db.Saved
    .find({})
    .sort({_id: -1})
    .then(function (dbSaved) {
      results = dbSaved;
      res.render('pages/saved.ejs', {results: results});
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
            db.Article
            .remove({_id: req.params.id})
            .then(function (dbArticle) {

            })
            .catch(function (err) {
              res.json(err);
            });
        })
        .catch(function (err) {
          res.json(err);
        });
    })
    .catch(function (err) {
      res.json(err);
    });
});

app.delete('/remove/:id', function (req, res) {



let result = {};
  db.Saved
    .findOne({_id: req.params.id})
    .then(function (dbArticle) {
      result.title = dbArticle.title;
      result.url = dbArticle.url;
      result.time = dbArticle.time;
      db.Article
        .create(result)
        .then(function (dbSaved) {
            db.Article
            .remove({_id: req.params.id})
            .then(function (dbArticle) {

            })
            .catch(function (err) {
              res.json(err);
            });
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
app.listen(process.env.PORT || 3000, function () {
  console.log('App running on port ' + PORT + '!');
});
