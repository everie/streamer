const EPLAYER = {
    timer: null
};

$(document).ready(function(event) {
    $('#e-play-pause').PlayPause();

    $.E();
});

$.E = function() {
    var player = document.getElementById('audio');
    var wf = $('.e-container-bottom');
    var width = wf.width();

    /*
    player.addEventListener("timeupdate",function(){
        var pct = player.currentTime * 100 / player.duration;
        var pos = width / 100 * pct;

        $('.e-waveform-indicator').css('left', pos + 'px');
    });

     */
};

$.EP = function(play) {
    var player = document.getElementById('audio');
    var wf = $('.e-container-bottom');
    var indicator = $('.e-waveform-indicator');
    var indicatorTime = $('.e-bottom-left');

    if (play) {
        EPLAYER.timer = setInterval(function() {
            var pct = (player.currentTime / player.duration) * 100;
            indicator.css('left', pct + '%');
            indicatorTime.html($.SecToMMSS(player.currentTime));
        }, 33);
    } else {
        clearInterval(EPLAYER.timer);
    }
};


$.fn.PlayPause = function() {
    var e = $(this);
    var player = document.getElementById('audio');

    e.on('click', function(event) {
        event.preventDefault();
        event.stopPropagation();

        var play = e.attr('data-play');

        if (play == 'true') {
            // STOP
            $.SetPlayPause(player, false);
        } else {
            // START
            $.SetPlayPause(player, true);
        }
    });
};

$.SetPlayPause = function(player, play) {
    var e = $('#e-play-pause');

    if (play) {
        e.attr('data-play', true);
        e.empty().append($.GetPlayPauseIcon(true));
        player.play();
    } else {
        e.attr('data-play', false);
        e.empty().append($.GetPlayPauseIcon(false));
        player.pause();
    }

    $.EP(play);
};

$.GetPlayPauseIcon = function(play) {
    if (play)
        return $('<i class="fas fa-pause"></i>');

    return $('<i class="fas fa-play"></i>');
};

$.SecToMMSS = function(sec) {
    sec = Math.floor(sec);
    sec %= 3600;
    var minutes = Math.floor(sec / 60);
    var seconds = sec % 60;

    return $.Pad(minutes) + ':' + $.Pad(seconds);
};

$.Pad = function(num) {
    if (num < 9)
        return '0' + num;

    return num;
};