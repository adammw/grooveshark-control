
function isSomePlaylist () {
    return !$('#player_play_pause').hasClass('disabled');
}

function isPlaying () {
    return $('#player_play_pause').hasClass('pause');
}

function getPlayerOptions () {
    return {
        shuffle: $('#player_shuffle').hasClass('active'),
        loop: $('#player_loop').hasClass('one') ? 'one' : ($('#player_loop').hasClass('all') ? 'all' : 'none'),
        crossfade: $('#player_crossfade').hasClass('active')
    }
}

function getNowPlaying () {
    var progressBar = $('#player_controls_seeking div.progress');
    var percent = 100 * parseFloat(progressBar.css('width')) / parseFloat(progressBar.parent().css('width')) + '%';

    return {
        song: $('#playerDetails_nowPlaying a.song').text(),
        artist: $('#playerDetails_nowPlaying a.artist').text(),
        album: $('#playerDetails_nowPlaying a.album').text(),
        image: $('#queue_list li.queue-item-active img').attr('src'),

        inMyMusic: $('#playerDetails_nowPlaying a.add').hasClass('selected'),
        isFavorite: $('#playerDetails_nowPlaying a.favorite').hasClass('selected'),

        positionInQueue: $('#queue_list li.queue-item-active span.position').text(),
        times: {
            elapsed: $('#player_times #player_elapsed').text(),
            duration: $('#player_times #player_duration').text(),
            percent: percent
        }
    }
}

function getPlaylist() {
    playlist = []

    $('#queue_list li.queue-item').each( function(index) {
        queueItem = {
            song: $(this).find('a.queueSong_name').text(),
            artist: $(this).find('a.queueSong_artist').text(),
            isActive: $(this).hasClass('queue-item-active')
        }
        playlist.push(queueItem);
    });

    return playlist;
}

data = {
    isSomePlaylist: isSomePlaylist(),
    isPlaying: isPlaying(),
    playerOptions: {},
    nowPlaying: {},
    playlist: []
}

if (data['isSomePlaylist']) {
    data['playerOptions'] = getPlayerOptions();
    data['nowPlaying'] = getNowPlaying();
    data['playlist'] = getPlaylist();
}

chrome.extension.sendRequest(data);

