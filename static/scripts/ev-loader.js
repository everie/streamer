

$(document).ready(function() {
    /*
    cols(function(colours) {
        console.log(colours);

        var brighter = colours.filter(a => a[0] + a[1] + a[2] > 80);

        var rb = $.Rainbow(brighter.map(a => arrToHex(a)));

        //console.log(colours.filter(a => a[0] + a[1] + a[2] > 100));

        $.each(rb, function(i, e) {
            var obj = $.createColour(e);

            $('#colours').append(obj);
        });

        var pg = $.PeakGradient(brighter);

        var gradient = 'linear-gradient(180deg, ' + pg.from + ' 0%, ' + pg.to + ' 75%)';

        console.log(gradient);

        $('#peaks').on('paintable', function() {
            $('.peak').css('background', gradient);
        });

    });

     */
});

$.PeakGradient = function(arr) {

    arr = arr.sort((a, b) => {
       var x = a[0] + a[1] + a[2];
       var y = b[0] + b[1] + b[2];

       return y-x;
    })
        .map(a => arrToHex(a));

    return {
        from: '#fff',
        to: arr[1]
    }
};

function cols(callback) {
    const colorThief = new ColorThief();
    const img = document.getElementById('cover');

    // Make sure image is finished loading
    if (img.complete) {
        callback(colorThief.getPalette(img, 6, 5));
    } else {
        img.addEventListener('load', function() {
            callback(colorThief.getPalette(img, 6, 5));
        });
    }
}

$.Rainbow = function(colours) {
    var rainbow = new Rainbow();

    var steps = colours.length * 3;

    rainbow.setSpectrum(...colours);
    rainbow.setNumberRange(0, steps);

    var arr = [];

    for (var i = 0; i < steps; i++) {
        arr.push('#' + rainbow.colorAt(i));
    }

    return arr;
};

$.EvRequest = function(id) {
    EMIT(id);
};

$.EvPlay = function(id) {

};

$.EvLoad = function(id) {
    console.log('opening', id);

    var client = new BinaryClient("ws://localhost:3001/binary");

    console.log(client);

    client.on('stream', function(stream, meta){
        var parts = [];

        console.log('opening up', meta);

        stream.on('data', function(data){
            parts.push(data);
        });

        stream.on('end', function(){
            var src = (window.URL || window.webkitURL).createObjectURL(new Blob(parts));
            var obj = $.create(src);

            $('#cont').append(obj);

            stream.destroy();


            $.get('/data/' + id)
                .done(function(data) {
                    $.drawPeaks(data);
                    //console.log(data);
                })
                .fail(function(err) {
                    console.log('error', err);
                })
                .always(function() {
                    console.log('done');
                });
        });
    });
};

$.create = function(url) {
    var e = $('<audio>').prop('controls', true);
    var s = $('<source>').attr('src', url).appendTo(e);

    return e;
}

$.createColour = function(hex, highlight) {
    var e = $('<div>')
        .addClass('colour')
        .css('background-color', hex);

    if (highlight)
        e.addClass('highlight');

    return e;
}



function arrToHex(arr) {
    var hex = '#' + componentToHex(arr[0]) +
        componentToHex(arr[1]) +
        componentToHex(arr[2]);

    return hex;
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
}

function EMIT(event, data, file) {
    file       = file || {};
    data       = data || {};
    data.event = event;

    return CLIENT.send(file, data);
}