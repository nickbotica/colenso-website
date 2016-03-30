var express = require('express');
var router = express.Router();

// basex
var basex = require('basex');
var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");
client.execute("OPEN Colenso");

/* GET home page. */
router.get("/",function(req, res){
	res.render('index', { title: 'Colenso'});
});


// string search
router.get('/search', function(req, res) {
	client.execute("XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';" +
	"for $p in *[.//text() contains text '" + req.query.searchString + "'] return db:path($p)",
		function(err, result) {
			if(!err){
				list = result.result.split("\n");
				res.render('search', { title: 'Search results', content: req.query.searchString, list: list, numHits: list.length});
			}});
});

// XQUERY search
router.get("/searchX", function(req,res){
	client.execute("XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';" +
	"for $n in (collection('Colenso/')"+ req.query.searchString +")" + "return db:path($n)",
		function(err, result) {
			if(!err){
				list = result.result.split("\n");
				res.render('search', { title: 'Search results', content: req.query.searchString, list: list, numHits: list.length});
			}});
});


router.get("/load",function(req,res){
	client.execute("XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';" +
		"(doc('Colenso/" + req.query.file + "'))",
		function (error, result) {
			if(!error){
				res.render('load', { title: req.query.file, file: result.result });
			}
		});
});


module.exports = router;
