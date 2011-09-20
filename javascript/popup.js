
var indexOfActiveSong = -1;

function hidePopup () { $('body').css('display', 'none'); }
function showPopup () { $('body').css('display', 'block'); }

function init () {
    hidePopup();
    getData(callbackIfGroovesharkIsNotOpen=createGroovesharkTab);
    setUpProgressbar();
    
    if (isNotificationOpen()) hidePin();
    else showPin();
}

function scrollPlaylistToActiveSong () {
    var index = indexOfActiveSong - 2;
    
    if(localStorage['lastPositionInPlaylist'] && localStorage['lastPositionInPlaylist'] > 0) {
        $('#playlist').scrollTo('#playlistItem_' + localStorage['lastPositionInPlaylist'], 0);
    }
    localStorage['lastPositionInPlaylist'] = index;
    $('#playlist').scrollTo('#playlistItem_' + index, 800);
}

chrome.extension.onRequest.addListener(
    function (request, sender, sendResponse) {
        if (!request.isSomePlaylist) {
            goToGroovesharkTab();
            return;
        }
        
        showPopup();
        
        setPlayerOptions(request.playerOptions);
        setNowPlaying(request.nowPlaying);
        setPlaylist(request.playlist);
        setRadio(request.radio);
        
        scrollPlaylistToActiveSong();

        $('#playpause').attr('class', request.isPlaying ? 'pause' : 'play');
    }
);

function showPin () {
    $('#pin').show();
}

function hidePin () {
    $('#pin').hide();
}

