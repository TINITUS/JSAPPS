var ajaxRequester = (function () {
	var headers = {
		"X-Parse-Application-Id":"PR7Dc6RdTuYOV3A2XHPAALJAQrAoqdDque1dl8v8",
		"X-Parse-REST-API-Key":"XirR0APvJvjcLPvW23CbjDTtiNzsjes2sOLUuHkZ"
	}
	var makeRequest = function makeRequest(method, url, data, success, error) {
		return $.ajax({
			type: method,
			url: url,
			headers: headers,
			contentType: 'application/json',
			data: JSON.stringify(data),
			success: success,
			error: error
		})
	}		

	function makeGetRequest(url, success, error) {
		return makeRequest('GET', url, null, success, error);
	}

	
	function makePostRequest(url, data, success, error) {
		return makeRequest('POST', url, data, success, error);
	}

	function makePutRequest(url, data, success, error) {
		return makeRequest('PUT', url, data, success, error);
	}

	function makeDeleteRequest(url, success, error) {
		return makeRequest('DELETE', url, {}, success, error);
	}

	return {
		get: makeGetRequest,
		post: makePostRequest,
		put: makePutRequest,
		delete: makeDeleteRequest
	}
}());