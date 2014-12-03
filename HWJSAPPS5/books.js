(function(){
	var RQST_URL = 'https://api.parse.com/1/classes/Books',
        $main = $('div#main');
	
	function loadBooks (data) {	
		$('.initLoader').show();
		$main.html('');
		var last = data.results.length - 1;
		$.each(data.results, function (index, value) {			
			var bookTemplate   = '<div class="media jumbotron" id="' + value.objectId + '">' +
            							'<a class="media pull-left" traget="_blank">' +
								    		'<img alt="' + value.bookTitle + '">' +								    		
								  		'</a>' +
								  		'<div class="media-body">' +
								    		'<h2 class="media-heading">' + value.bookTitle + '</h2>' +
								    		'<h4>' + value.bookAuthor +
								    		'</br><span class="label label-info">ISBN: ' + value.bookISBN + '</span></h4>' +
								    		'<p class="bookDesc">' + 				                	        	
					                    	'</p>' +
								  		'</div>' +
								  		'<div class="pull-right">' + 
					                    		'<button data-book="' + value.objectId + '" data-toggle="modal" data-target="#editAddModal" class="btn btn-warning editBook"><span class="glyphicon glyphicon-edit"></span> Edit</a>' +
					                    		'<button data-book="' + value.objectId + '" data-toggle="modal" data-target="#deleteModal" class="btn btn-danger deleteBook"><span class="glyphicon glyphicon-remove"></span> Delete</a>' +
					                    '</div>' +
									'</div>';
			$main.append($(bookTemplate));
			getBookTumb(value.bookISBN, value.objectId);
			if(index == last){
				$('.initLoader').hide();
			}
		});
	}

	$('#deleteModal').on('show.bs.modal', function (event) {
		var $button = $(event.relatedTarget),
			bookId  = $button.data('book'),
			$modal  = $(this),
			title   = $button.parents('#'+bookId).find('.media-heading').text();

		$modal.find('.modal-title').text('Delete Book ' + title);
		$modal.find('.modal-body .submitBtn').on('click', {
						'id':bookId,
						'modal': $modal
					},
					deleteBook
		);
	});

	$('#editAddModal').on('show.bs.modal', function (event) {
		var $button = $(event.relatedTarget),
			bookId = $button.data('book'),
			$modal = $(this);

		if($button.hasClass('editBook')){
			//Edit Modal
			var promise = ajaxRequester.get(RQST_URL + '/' + bookId);			
				promise.success(function(data){			
			    var author = data.bookAuthor,
			    	title = data.bookTitle, 
			    	isbn = data.bookISBN;

				$modal.find('.modal-title').text('Edit Book ' + title);

		  		$modal.find('.modal-body input#title').val(title);
		  		$modal.find('.modal-body input#author').val(author);
		  		$modal.find('.modal-body input#isbn').val(isbn);
		  		$modal.find('.modal-footer .submitBtn').text('Update').on('click',{
					'id':bookId,
					'modal': $modal
					},
					editBook
				);
			});
			promise.error(function(error){
				errorHandler(error);
			});
		} else if($button.hasClass('addBook')){
			//Add Modal
			$modal.find('.modal-title').text('Add New Book');
			$modal.find('.modal-footer .submitBtn').text('Add').on('click',{				
				'modal': $modal
				},
				addBook
			);
		}		
	});
	
	function deleteBook (e) {
		var $modal = e.data.modal;
		ajaxRequester.delete(RQST_URL+ '/' + e.data.id, init, errorHandler);
		$modal.modal('hide');
	}

	function addBook (e) {
		var $modal = e.data.modal,			
			data = {'bookTitle': htmlEntities(e.data.modal.find('.modal-body input#title').val()), 
					'bookAuthor': htmlEntities(e.data.modal.find('.modal-body input#author').val()),
					'bookISBN': htmlEntities(e.data.modal.find('.modal-body input#isbn').val())};
		$modal.modal('hide');
		
		if(data.bookTitle == '' || data.boolAuthor == ''){
			errorHandler('Author and Title are required');
			return;
		}
		
		ajaxRequester.post(RQST_URL, data, init, errorHandler);
	}

	function editBook(e){
		e.data.modal.modal('hide');
		var data = {'bookTitle': htmlEntities(e.data.modal.find('.modal-body input#title').val()), 
					'bookAuthor': htmlEntities(e.data.modal.find('.modal-body input#author').val()),
					'bookISBN': htmlEntities(e.data.modal.find('.modal-body input#isbn').val())};

		if(data.bookTitle == '' || data.boolAuthor == ''){
			errorHandler('Author and Title are required');
			return;
		}		
		ajaxRequester.put(RQST_URL + '/' + e.data.id, data, init, errorHandler);
	}

	function errorHandler (error) {
		var message;
		if(typeof(error ) == 'string'){
			message = error;
    	} else {
    		console.log(error);
    		message = 'An error occured! Check the console!';
    	}

    	$('body').append('<div class="alert alert-danger alert-dismissible fade in" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><h3>' + message + '</h3></div>');
    		setTimeout(function () {
				$('body').find('.alert').fadeOut('fast', function() {
					$(this).remove();
				});
    		}, 5000);
	}

	function successMsg (message) {
    	$('body').append('<div class="alert alert-success alert-dismissible fade in" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><h3>' + message + '</h3></div>');
    		setTimeout(function () {
				$('body').find('.alert').fadeOut('fast', function() {
					$(this).remove();
				});
    		}, 5000);
	}

	function init () {
		ajaxRequester.get(RQST_URL, loadBooks, errorHandler);
	}

	function getBookTumb (isbn, id) {
		$.ajax({
			type: 'GET',
			url: 'https://www.googleapis.com/books/v1/volumes',
			contentType: 'application/json',
			data:{'q':((isbn && (isbn != '')) ? 'isbn:'+isbn : ' ')},
			success: function(data){
				if(data.items.length > 0){
					var $item = $main.find('#'+id);
					$item.find('a').attr('href', data.items[0].accessInfo.webReaderLink);
					$item.find('img').attr('src',data.items[0].volumeInfo.imageLinks.thumbnail);
					$item.find('.bookDesc').html(data.items[0].volumeInfo.description);
				} else {
					var $item = $main.find('#'+id);
					$item.find('a').attr('href', '#');
					$item.find('img').attr('src','http://placehold.it/128x168');
					$item.find('.bookDesc').html('No description is avalilable for this volume!');
				}
			},
			error: function(err){
				var $item = $main.find('#'+id);
				$item.find('a').attr('href', '#');
				$item.find('img').attr('src','http://placehold.it/128x168');
				$item.find('.bookDesc').html('No description is avalilable for this volume!');
			}
		});
	}

	function htmlEntities(str) {
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }


	init();
}())