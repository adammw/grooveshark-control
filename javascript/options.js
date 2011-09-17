
// Restore a boolean option
function restoreBooleanOption (storageKey, callback) {
	callback(localStorage[storageKey] != 'false');
}

// Restore a generic option
function restoreGenericOption (storageKey, defaultValue, callback) {
	callback(localStorage[storageKey] || defaultValue);
}

function restoreOptions () {

	// Restore notification
	restoreBooleanOption('showNotification', function(value){
		$('#showNotification').attr('checked', value);
	});

	restoreGenericOption('showNotificationForMiliseconds', 5000, function(value){
    	$('#showNotificationForMiliseconds').val(value < 1000 ? 1000 : value);
	});

	// Restore pin and left tab
	restoreBooleanOption('prepareGrooveshark', function(value){
		$('#prepareGrooveshark').attr('checked', value);
	});

	// Enable/disabled checkboxs
    $('td.enable > :checkbox').change(function(){
    	var checked = $(this).is(':checked');
		$(this).closest('tr')
			.toggleClass('enabled', checked)
			.find(':input, select, textarea').not(':checkbox').attr('disabled', !checked);
	}).change();

}

function saveOptions () {
    localStorage['showNotification'] = $('#showNotification').attr('checked') == 'checked';
    localStorage['prepareGrooveshark'] = $('#prepareGrooveshark').attr('checked') == 'checked';
    localStorage['showNotificationForMiliseconds'] = $('#showNotificationForMiliseconds').val();

    saved();
}

function saved () {
    $('#status')
    	.stop()
    	.css('opacity', 1)
		.fadeIn(400)
		.delay(1500)
		.fadeOut(400);
}
