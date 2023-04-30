const express = require('express');
var fs = require('fs');
var wf3 = require('./wf3.js');
const {ThrottleGroup} = require('stream-throttle');

// EXPRESS
const app = express();
const port = 3000;

const tg = new ThrottleGroup({rate: 1024*1024});

// EJS
app.set('view engine', 'ejs');
app.use('/static', express.static('static'));

// BINARY SERVER
var BinaryServer = require('binaryjs').BinaryServer;
var bs = new BinaryServer({server: app, path: '/binary', port: 3001});

// ROOT
app.get('/', (req, res) => {
    res.render('index', {test: 'TEST'});
});

/*
app.get('/data/:id', (req, res) => {
    var params = req.params;

    var path = SERVE.file(params.id);

    wf3.peaks(path, function(data) {
        res.send(data);
    });
});
 */

app.get('/track/:id', (req, res) => {
    var params = req.params;

    return res.render('track', {id: params.id});
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

bs.on('connection', client => {
    console.log('Connection init');

    console.log('client load', client.id);
    client.on('stream', (stream, meta) => {
        console.log('Stream init');

        if (meta.event.trim().length > 0) {
           var path = SERVE.file(meta.event);

           var file = fs.createReadStream(path);

           /*
           file
               .pipe(tg.throttle())
               .pipe(file);

            */

           var track = SERVE.json(meta.event);

           wf3.peaks(path, function(data) {
               console.log('client send', client.id);

               try {
                   client.send(file, {
                       peaks: data,
                       cover: track.Cover
                   });
               } catch (err) {
                   console.log('errrorrrr', err);
               }

           });
        }
    });
});


const SERVE = {
    json: function (id) {
        var path = __dirname + '/tempdb/' + id + '.json';

        var text = fs.readFileSync(path);

        return JSON.parse(text);
    },
    file: function (id) {
        var file = this.json(id);

        return __dirname + '/files/' + file.File;
    },
    peaks: function (id) {
        var file = this.json(id);

        return file.peaks;
    }
};