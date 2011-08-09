
var actions = {
    'playOrPause': "$('#player_play_pause').click()",
    'previous': "$('#player_previous').click()",
    'next': "$('#player_next').click()",
    'shuffle': "$('#player_shuffle').click()",
    'loop': "$('#player_loop').click()",
    'crossfade': "$('#player_crossfade').click()"
}

function getGroovesharkUrl () {
    return 'http://grooveshark.com/';
}

function isGroovesharkUrl (url) {
    return !(url.indexOf(getGroovesharkUrl()) != 0)
}

function goToGroovesharkTab () {
    callWithGroovesharkTab(function (tab) {
        chrome.windows.update(tab.windowId, {focused: true});
        chrome.tabs.update(tab.id, {selected: true});
    }, createGroovesharkTab);
}

function createGroovesharkTab () {
    chrome.tabs.create({url: getGroovesharkUrl()});
}

function callWithGroovesharkTab (callback, callbackIfGroovesharkIsNotOpen) {
    chrome.windows.getAll({'populate': true}, function (windows) {
        for (var i = 0, win; win = windows[i]; i++) {
            for (var j = 0, tab; tab = win.tabs[j]; j++) {
                if (tab.url && isGroovesharkUrl(tab.url)) {
                    callback(tab);
                    return;
                }
            }
        }
        callbackIfGroovesharkIsNotOpen();
    });
}

function periodicDataGetter (callbackIfGroovesharkIsNotOpen) {
    var delayInMiliseconds = 1000;
    getData(callbackIfGroovesharkIsNotOpen);
    window.setTimeout("periodicDataGetter("+callbackIfGroovesharkIsNotOpen+")", delayInMiliseconds);
}

function getData (callbackIfGroovesharkIsNotOpen) {
    callWithGroovesharkTab(function (tab) {
        chrome.tabs.executeScript(tab.id, {file: "javascript/getData.js"});
    }, callbackIfGroovesharkIsNotOpen);
}

function userAction (action) {
    callWithGroovesharkTab(function (tab) {
        chrome.tabs.executeScript(tab.id, {code: actions[action]});
    });
    getData();
}

function showNotification (stay) {
    if (localStorage['showNotification'] == 'false') return;
    
    if (!isNotificationOpen()) {
        var notification = webkitNotifications.createHTMLNotification('../views/notification.html');
        notification.show();
    }
    
    if (stay) {
        chrome.extension.getViews({type: 'popup'}).forEach(function(win) {
            win.hidePin();
        });
        window.setTimeout(function () {
            chrome.extension.getViews({type: 'notification'}).forEach(function (win) {
                win.turnOffCloseOfWindow();
            });
        }, 100);
    }
}

function isNotificationOpen () {
    return chrome.extension.getViews({type: 'notification'}) != ''
}


