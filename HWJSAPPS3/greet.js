(function () {
	
	var nameKey = 'name',
    	greetText = '<h4>Welcome $name$ </h4><small><span class="label label-primary">$tot$</span> visits total / <span class="label label-info">$ses$</span> this session / <button type="button" id="clrInfo" class="btn btn-info btn-sm">clear</button></small>',
    	$greet = $('#greet'),
        $form = $('#nameForm'),
        $button = $form.find('button'),
        $field = $form.find('input#name');

    $greet.hide();
    $form.hide();
	function init () {
		if (supports_html5_storage()) {
		    if (localStorage.greetName) {
		        showGreeting();
		    } else if (supports_html5_storage()) {
		    	$button.on('click',function () {
		    		if ($field.val()) {
		    			localStorage.greetName = htmlEntities($field.val());
		    			$field.val('');
		    			showSuccess('Hello ' + localStorage.greetName + '!');
		    			$form.hide();
		    			showGreeting();

		    		} else {
		    			showError('Name cannot be enpty');
		    		}
		    	});
		    	$form.show();
		    }
		} else {
			showError('Your Browser doesn\'t support Local Storage. Some funtionality will be ommited.');
		}
	}
	
    function supports_html5_storage () {
        try {
            return 'localStorage' in window && window['localStorage'] !== null;
        } catch (e) {
            return false;
        }
    }
    function incrementSessionCount () {
    	if (sessionStorage.sgvcount) {
			sessionStorage.sgvcount ++;
		} else {
			sessionStorage.sgvcount = 1
		}
    }

    function incrementTotalCount () {
    	if (localStorage.tgvcount) {
			localStorage.tgvcount ++;
		} else { 
			localStorage.tgvcount = 1
		}
		incrementSessionCount();
    }

    function showGreeting () {
    	incrementTotalCount();
        greetText = greetText.replace(/\$name\$/g, localStorage.greetName);
        greetText = greetText.replace(/\$tot\$/g, localStorage.tgvcount);
        greetText = greetText.replace(/\$ses\$/g, sessionStorage.sgvcount);
        $greet.append(greetText);
        $greet.show();
        $('#clrInfo').on('click', function(){
        	localStorage.removeItem('greetName');
        	localStorage.removeItem('tgvcount');
        	sessionStorage.removeItem('sgvcount');
        	$greet.hide();
        	init();
        })
    }

    function showError (message) {
    	$('body').append('<div class="alert alert-danger alert-dismissible fade in" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' + message + '</div>');
    	setTimeout(function () {
			$('body').find('.alert').fadeOut('fast', function() {
				$(this).remove();
			});
    	}, 2000);
    }
    
    function showSuccess (message) {
    	$('body').append('<div class="alert alert-success alert-dismissible fade in" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' + message + '</div>');
    	setTimeout(function () {
			$('body').find('.alert').fadeOut('fast', function() {
				$(this).remove();
			});
    	}, 2000);
    }

    function htmlEntities(str) {
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    init();
}());