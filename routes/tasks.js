var express = require('express');
var fs = require('fs');
var util = require('util');
var router = express.Router();

var log_file = fs.createWriteStream(__dirname + '/debug.log', {flags: 'w'});
var log_stdout = process.stdout;

console.log = function(d){
	log_file.write(util.format(d) + '\n');
	log_stdout.write(util.format(d) + '\n');
};

/*
*	GET tasklist
*/
router.get('/tasklist', function(req, res){
	var db = req.db;
	db.collection('tasklist').find().toArray(function (err, items){
		res.json(items);
	});
});

/*
*	POST to addtask
*/
router.post('/addtask', function(req, res){
	var db = req.db;

	//check if values are empty
	if(req.body.duedate===''||req.body.task===''||req.body.priority===''){
		res.send({msg: 'Some fields were empty'});
	} else{	
		db.collection('tasklist').insert(req.body, function(err, result){
			res.send((err===null) ? { msg: '' } : { msg: err});
		});
	}

});

/*
*	DELETE to deletetask
*/
router.delete('/deletetask/:id', function(req, res){
	var db = req.db;
	var taskToDelete = req.params.id;
	db.collection('tasklist').removeById(taskToDelete, function(err, result){
		res.send((result === 1) ? {msg: ''} : {msg: 'error: ' + err});
	});
});



module.exports = router;
