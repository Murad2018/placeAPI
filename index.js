// Create project first with<<<<<>>>>>>> npm init
// Then 'install modules'>>>>>. npm i <package name>

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect('mongodb://murad2018:murodjon77@ds159254.mlab.com:59254/rest-api');
var Place = require('./place')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var router = express.Router();

router.get('/', function (req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

router.route('/place')
    .post(function (req, res) {
        var place = new Place();
        place.name = req.body.name;
        place.description = req.body.description;
        place.country = req.body.country;

        place.save(function (err) {
            if (err) res.send(err);
            res.json({ message: 'Place created' });
        });
    })

    .get(function (req, res) {
        Place.find(function (err, place) {
            if (err) res.send(err);

            res.json(place);
        });
    });

router.route('/place/:place_id')
    .get(function (req, res) {
        Place.findById(req.params.place_id, function (err, place) {
            if (err) res.send(err);
            res.json(place);
        });
    })
    //updating place by id
    .post(function (req, res) {
        Place.findById(req.params.place_id, function (err, place) {
            if (err)
                res.send(err);

            place.name = req.body.name;
            place.description = req.body.description;
            place.country = req.body.country;

            //save the place
            place.save(function (err) {
                if (err) res.send(err);

                res.json({ message: 'Place updated!' });
            });
        });
    })
    .delete(function (req, res) {
        Place.remove({
            _id: req.params.place_id
        }, function (err, place) {
            if (err) res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });

//adding new document to the collection
router.route('/place/:place_id/reviews')
    .post(function (req, res) {
        Place.findById(req.params.place_id, function (err, place) {
            if (err) res.send(err);

            var newReview = {
                name: req.body.name,
                rating: req.body.rating,
                review: req.body.review
            }

            place.reviews.push(newReview);

            place.save(function (err) {
                if (err) res.send(err);
                res.json({ message: 'Added successfully!' });
            });
        })
    })

    router.route('/place/:place_id/reviews')
    .get(function (req, res) {
        Place.findById(req.params.place_id, function (err, place) {
            if (err) res.send(err);

            res.json(place.reviews).limit(2);
        });
    });
     
   

    





// router.route('/place/:place_id/reviews')
// .delete(function(req, res){
//     Place.remove({
//         _id: req.params.review_id
//     }, function(err, place){
//         if (err)  res.send(err);

//         res.json({message:'Successfully deleted'});
//     })
// })



app.use('/api', router);
app.listen(port);
console.log('Magic happens on port ' + port);



