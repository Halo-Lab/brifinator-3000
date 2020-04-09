function handleAjaxError(error) {
	var errMsg = "An error occurred while processing your request"
	var errTitle = "Error"

	console.log(error)
	// check if this is a validation error
	if (error.status === 422) {
		var json = error.responseJSON 
		if (json && json.message) errTitle = json.message 

			if (json.errors) {
				errMsg = ''
				Object.keys(json.errors).forEach(function(key) {
					var messages = json.errors[key]
					console.log(key, messages)
					messages.forEach(function(message) {
						errMsg += key.toUpperCase() + ': ' + message + '\n'
					})
				})
			}
		}

		swal({
			title: errTitle,
			text: errMsg,
			icon: 'error',
		})

		return errMsg
	}


	function sConfirm(message, callback, type, title, cancelled) {
		var title = title || 'Are you sure?'
		var type = type || 'warning'
		var message = message || 'Message'
		var callback = callback || function () {}
		var cancelled = cancelled || function () {}

		swal({
			title: title,
			text: message,
			icon: type,
			cancelButtonColor: '#d33',
			disableButtonsOnConfirm: true,
			dangerMode: (type == 'warning' || type == 'danger'),
			buttons: true,
		})
		.then(function(result) {
			if (result) {
				callback()
			} else {
				cancelled()
			}
		})
	}

	if (window.Clipboard && Clipboard.isSupported && Clipboard.isSupported()) {
		var clip = new Clipboard('.clipboard')

		clip.on('success', function( e ) {
        // e.clearSelection();
        var ref = $( e.trigger )

        ref.html('<i class="fa fa-check-circle"></i> '+ref.data('message'))

        setTimeout(function() {
        	ref.html('<i class="fa fa-clipboard"></i> '+ref.data('original'))
        }, 1200);
    });
	}

// jQuery(function($){
//     $('.table').footable({
//         "filtering": {
//             "enabled": true,
//         },
//         "paging": {
//             "enabled": true,
//             "size": 100,
//             "position": "right",
//         },
//         "sorting": {
//             "enabled": true,
//         },
//     });
// });

function initilizeConfirmListeners() {
	$('.confirm').click( function( e ) {
		e.preventDefault()
		
		var ref = $(this)
		var data = ref.data()

		var message = data.message ? data.message : ref.attr('title')

		sConfirm(message, function() {
			window.location = ref.attr('href')
		})
	})

	$('.confirm-form').click( function( e ) {
		e.preventDefault()

		var ref = $(this)
		var data = ref.data()

		var message = data.message ? data.message : ref.attr('title')

		var form = $('#'+ref.data('form'))

		if ( ! form.parsley().validate() ) return

					submitForm(form.serializeArray(), $('#hubspot_guid').val(), $('#portal_id').val());
			sConfirm(message, function() {
				if($('#form_action').val() === "deleteForm"){
					deleteHubspotForm($('#hubspot_guid').val())
				}
				if($('#form_action').val() === "submitForm"){
				}

			form.submit()
		})
	})
}
$(function () {
	$('[data-toggle="tooltip"]').tooltip()

	setTimeout(function() {
		initilizeConfirmListeners()
	}, 1000);
})
function deleteHubspotForm(hubspot_guid){
	$.ajax({
		url: '/hubspot/delete',
		dataType: 'json',
		async : false,
		data: { _token: window.FormBuilder.csrfToken, hubspot_guid: hubspot_guid},
		method: "DELETE",
	})
	.done(function(response) {
		console.log("success");
	})
	.fail(function(response) {
		console.log("error");
	})
	.always(function(response) {
		console.log("complete");
	});
}

function submitForm(form, hubspot_guid, portal_id){
	$.ajax({
		url: '/hubspot/submit',
		dataType: 'json',
		async : false,
		data: { _token: window.FormBuilder.csrfToken, form: form, hubspot_guid:hubspot_guid, portal_id:portal_id },
		method: "POST",
	})
	.done(function(response) {
		console.log("success");
	})
	.fail(function(response) {
		console.log("error");
	})
	.always(function(response) {
		console.log("complete");
	});
}