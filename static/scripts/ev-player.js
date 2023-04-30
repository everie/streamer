$.EvPLAY = function(id) {
    $.EvEMIT(id);
};

$.EvDRAW = function(arr, pg) {
    var top = $('.e-waveform-top-bars').empty();
    var bottom = $('.e-waveform-bottom-bars').empty();

    console.log(pg);

    /*
    var glow = '-10px -10px 50px ' + pg.arr[0] + ',';
    glow += '10px -10px 50px ' + pg.arr[1] + ',';
    glow += '10px 10px 50px ' + pg.arr[2] + ',';
    glow += '-10px 10px 50px ' + pg.arr[3];
     */
    var glow = '0 0 50px ' + pg.arr[1];

    $('body').css('background-color', pg.top);
    $('.e-cover').css('box-shadow', glow);
    var gradient = 'linear-gradient(180deg, ' + pg.from + ' 0%, ' + pg.to + ' 75%)';
    var gradient2 = 'linear-gradient(0deg, ' + pg.from + ' 0%, ' + pg.to + ' 75%)';

    $.each(arr, function(i, e) {
        //var peak = $('<div>').addClass('peak').css({'height': Math.round(e * 100) + '%', 'background': gradient});

        var peakTop = $('<div>')
            .addClass('e-peak-top')
            .css({'height': Math.round(e * 100) + '%', 'background': gradient});

        var peakBottom = $('<div>')
            .addClass('e-peak-bottom')
            .css({'height': Math.round(e * 100) + '%', 'background': gradient2});

        top.append(peakTop);
        bottom.append(peakBottom);
    });

    //$('body').css('background-color', pg.top);
};

$.EvCREATE = function(url, autoplay = false) {
    //var e = $('<audio>').prop('controls', true);
    //var aud = $('#audio').empty().attr('src', url);

    //var s = $('<source>').attr('src', url).appendTo(aud);
    var player = document.getElementById('audio');

    player.src = url;
    player.load();

    $.SetPlayPause(player, autoplay);
    //return aud;
};

$.EvIMAGEREAD = function(callback) {
    const colorThief = new ColorThief();
    const img = document.getElementById('cover');

    img.onload = () => {
        callback(colorThief.getPalette(img, 10, 5));
    };
};

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

$.PeakGradient = function(arr) {
    var arr2 = arr;

    arr2 = arr2.sort((a, b) => {
        var x = a[0] + a[1] + a[2];
        var y = b[0] + b[1] + b[2];

        return y-x;
    })
        .map(a => arrToHex(a));

    return {
        top: arr2[arr2.length - 1],
        from: '#fff',
        to: arr2[1],
        arr: arr.map(a => arrToHex(a))
    }
};

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