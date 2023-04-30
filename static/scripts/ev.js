const CLIENT = new BinaryClient("ws://localhost:3001/binary");
const COVERPATH = '../static/images/';

$.EvINIT = function(callback) {
    CLIENT.on('stream', (stream, meta) => {
        var parts = [];

        console.log('opening up', meta);

        $.EvCOVER(meta.cover, function() {
            $.EvCOLOURS(function(pg) {
                $.EvDRAW(meta.peaks, pg);

                $('#loader').trigger('hide', true);
            });
        });

        stream.on('data', function(data){
            parts.push(data);
        });

        stream.on('end', function(){
            setTimeout(function() {
                var src = (window.URL || window.webkitURL).createObjectURL(new Blob(parts));
                console.log(src);

                var player = $.EvCREATE(src);
                /*
                var obj = $.EvCREATE(src);

                $('#cont').empty().append(obj);
                */
                stream.destroy();
                //src.revokeObjectURL();

                // RUN BEFORE NEW STREAM
                //URL.revokeObjectURL(src);
                $(document).trigger('e-loaded');
            }, 0);
        });
    });

    CLIENT.on('open', function() {
        callback();
    });
};

$.EvEMIT = function(event, data, file) {
    $.EvLOAD(true);

    file       = file || {};
    data       = data || {};
    data.event = event;

    return CLIENT.send(file, data);
};

$.EvCOVER = function(img, callback) {
    var path = COVERPATH + img;

    $('#cover').attr('src', path);

    callback();
};

$.EvCOLOURS = function(callback) {
    console.log('colours???');

    $.EvIMAGEREAD(function(colours) {
        $('#colours').empty();

        console.log(colours);

        var brighter = colours.filter(a => a[0] + a[1] + a[2] > 100 && a[0] + a[1] + a[2] < 600);

        /*
        var rb = $.Rainbow(brighter.map(a => arrToHex(a)));


        $.each(rb, function(i, e) {
            var obj = $.EvDRAWCOLOUR(e);

            $('#colours').append(obj);
        });
        */
        var pg = $.PeakGradient(brighter);

        callback(pg);
    });
};

$.EvLOAD = function(on) {
    var div = $('#loader');

    if (on) {
        div.html('Loading...');
    } else {
        setTimeout(function() {
            div.html('');
        }, 200);
    }
};