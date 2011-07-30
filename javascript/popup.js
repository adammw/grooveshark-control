
var isSomePlaylist = false;
var indexOfActiveSong = 0;

function hidePopup () { $('body').css('display', 'none'); }
function showPopup () { $('body').css('display', 'block'); }

function scrollPlaylistToActiveSong () {
    var index = indexOfActiveSong - 2;
    $('#playlist').scrollTo('#playlistItem_' + index, 800);
}

function init () {
    hidePopup();
    getData(callbackIfGroovesharkIsNotOpen=createGroovesharkTab);
    
    // if playlist is (not) empty we now after response of calling getData
    // and it need some time, we say - 500 ms is good choise
    window.setTimeout(function () {
        if (!isSomePlaylist) {
            goToGroovesharkTab();
        } else {
            showPopup();
            scrollPlaylistToActiveSong();
        }
    }, 500);
}

function userAction (action) {
    callWithGroovesharkTabId(function (tabId) {
        chrome.tabs.executeScript(tabId, {code: actions[action]});
    });
    getData();
}

function moveInPlaylistToIndex (index) {
    callWithGroovesharkTabId(function (tabId) {
        var moves = index - indexOfActiveSong;
        if (moves <= 0) moves--;
        action = actions[moves<0 ? 'previous' : 'next'];

        for (var move = 0; move < Math.abs(moves); move++) {
          chrome.tabs.executeScript(tabId, {code: action});
        }
    });
    getData();
}

chrome.extension.onRequest.addListener(
    function (request, sender, sendResponse) {
        isSomePlaylist = request.isSomePlaylist;
        
        setPlayerOptions(request.playerOptions);
        setNowPlaying(request.nowPlaying);
        setPlaylist(request.playlist);

        $('#playpause').attr('class', request.isPlaying ? 'pause' : 'play');
    }
);

function setPlayerOptions (options) {
    $('#shuffle').attr('class', options.shuffle);
    $('#loop').attr('class', options.loop);
    $('#crossfade').attr('class', options.crossfade);
}

function setNowPlaying (nowPlaying) {
    $('#nowPlaying .song').text(nowPlaying.song.short);
    $('#nowPlaying .song').attr('title', nowPlaying.song.long);
    $('#nowPlaying .artist').text(nowPlaying.artist.short);
    $('#nowPlaying .artist').attr('title', nowPlaying.artist.long);
    $('#nowPlaying .album').text(nowPlaying.album.short);
    $('#nowPlaying .album').attr('title', nowPlaying.album.long);
    $('#nowPlaying .image').attr('src', nowPlaying.image);
    
    $('#nowPlaying .timeElapsed').text(nowPlaying.times.elapsed);
    $('#nowPlaying .timeDuration').text(nowPlaying.times.duration);
    
    if (nowPlaying.inMyMusic) $('#nowPlaying .inmusic').removeClass('disable');
    else $('#nowPlaying .inmusic').addClass('disable');
    
    if (nowPlaying.isFavorite) $('#nowPlaying .favorite').removeClass('disable');
    else $('#nowPlaying .favorite').addClass('disable');
    
    $('#nowPlaying .position').text(nowPlaying.positionInQueue);
    
    $('#progressbar .elapsed').css('width', nowPlaying.times.percent);
    $('#progressbar .scrubber').css('left', nowPlaying.times.percent);
}

function setPlaylist (playlist) {
    $('#playlist').text('');
    $.each(playlist.items, function (index, item) {
        var text = item.artist + ' - ' + item.song;
        htmlOfItem = "<div onclick='moveInPlaylistToIndex(" + index + ")' id='playlistItem_" + index + "' class='item" + (index%2==0 ? ' odd' : '') + (item.isActive ? ' active' : '') + "'>" + text + "</div>";

        $('#playlist').append(htmlOfItem);
    });
    
    if (playlist.active != indexOfActiveSong) {
        indexOfActiveSong = playlist.active;
        scrollPlaylistToActiveSong();
    }
}

