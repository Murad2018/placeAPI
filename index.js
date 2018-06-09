// Create project first with<<<<<>>>>>>> npm init
// Then 'install modules'>>>>>. npm i <package name>

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect('mongodb://murad2018:murodjon77@ds159254.mlab.com:59254/rest-api');
var Place = require('./place');
var User = require("./user");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var router = express.Router();

router.get('/', function (req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

router.route('/places')
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

router.route('/places/:place_id')
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
            place.image_url = req.body.image_url;

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
router.route('/places/:place_id/reviews')
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

router.route('/places/:place_id/reviews')
    .get(function (req, res) {
        Place.findById(req.params.place_id, function (err, place) {
            if (err) res.send(err);

            res.json(place.reviews).limit(2);
        });
    });

router.route("/register")
    .post(function (req, res) {
        var user = new User();
        user.username = req.body.username;
        user.password = req.body.password;

        user.save(function (err) {
            if (err) res.send(err);
            res.json({ message: 'User created' });
        });
    });

router.route("/login")
    .post(function (req, res) {
        User.findOne({ username: req.body.username, password: req.body.password },
            function (err, user) {
                if (err){ 
                    res.json(err);
                }
                else {
                    if (user) {                        
                        res.json({ message: 'Login successfull!!' });
                    }
                    else {
                        res.json({ message: 'User does not exist' });
                    }

                }



            })
    })



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



