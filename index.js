var express = require('express');
var request = require('request');
var fs = require('fs');

var clientId = process.env.CLIENT_ID;
var clientSecret = process.env.CLIENT_SECRET;
const PORT=process.env.PORT;

var app = express();

app.listen(PORT, function () {
    console.log("App listening on port " + PORT);
});

app.get('/', function(req, res) {
    res.send('Server is up!');
});

app.get('/oauth', function(req, res) {
    if (!req.query.code) {
        res.status(500);
        res.send({"Error": "Looks like we're not getting code."});
        console.log("Looks like we're not getting code.");
    } else {
        request({
            url: 'https://slack.com/api/oauth.access',
            qs: {code: req.query.code, client_id: clientId, client_secret: clientSecret},
            method: 'GET',

        }, function (error, response, body) {
            if (error) {
                console.log(error);
            } else {
                res.json(body);
            }
        })
    }
});

app.post('/compliment', function(req, res) {
    var filename = __dirname + '/compliments.txt';
    fs.readFile(filename, 'utf8', function(err, data) {
        if (err) throw err;
        var nLines = lineCount(data);
        var line = Math.floor(Math.random()*nLines);
        
	    if (nLines) {
            var lineString = data.toString().split('\n');
            res.send(lineString[line]);
	    } else {
            res.status(500);
        }
	});
});

function lineCount(text) {
    var nLines = 0;
    for( var i = 0, n = text.length;  i < n;  ++i ) {
        if( text[i] === '\n' ) {
            ++nLines;
        }
    }
    return nLines;
}
