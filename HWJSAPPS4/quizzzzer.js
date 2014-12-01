(function () {
    var $startBtn = $('#start'),
		$questions = $('#questions'),
		$finBtn = $('#finish'),
		$progressBar,
		$results = $('<div class="well well-lg success" id="results"></div>'),
		$clearLSBtn = $('<button type="button" class="btn btn-info btn-sm pull-right">Изчисти</button>'),
		count,
		time = 300,//seconds
		classCorrect = 'list-group-item-success',
		classIncorrect = 'list-group-item-danger',
		correctAnswersUsr,
		myTimer; //setInterval variable


	function init () {
		count = 0;
		$progressBar = $('<div class="progress" id="timer">' +
  						   '<div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%">' +
  						   '</div>' + 
					     '</div>');
		$finBtn.on('click', quizEnd);
		if (!lsGetVal('qstn0') && !lsGetVal('qstn1') && !lsGetVal('qstn2') && !lsGetVal('qstn3')) {
			lsSetVal('corrnAswrs', JSON.stringify({'q1':2, 'q2':1 , 'q3':3, 'q4':2}));
			$questions.hide();			
			$finBtn.parents('.row').hide();
			if(!$startBtn.is(':visible')){
				$startBtn.show();
			}
			if($results.is(':visible')){
				$results.remove();
			}
			$questions.find('a.active').removeClass('active');
			$questions.find('a.'+classCorrect).removeClass(classCorrect);
			$questions.find('a.'+classIncorrect).removeClass(classIncorrect);
			$startBtn.on('click', start);
			$qArr = $questions.find('.list-group');
			$qArr.each(function (ind) {
				var qnum = ind;
				$(this).find('a').each(function (aind) {
					var aswrInd = aind;
					$(this).on('click', {'qnum':qnum, 'aswrInd':aswrInd}, linksAction);
				});
			});
		} else if (!lsGetVal('qstn0') || !lsGetVal('qstn1') || !lsGetVal('qstn2') || !lsGetVal('qstn3')){
			continueFromLast();
		} else {
			displayResults();
		}
	};

	function linksAction (e) {		
		$(this).toggleClass('active').siblings().removeClass('active');						
		lsSetVal('qstn'+ e.data.qnum, e.data.aswrInd );
		lsSetVal('timer', count);
		e.stopPropagation();
	};

	function start () {		
		$startBtn.parent().append($progressBar);
		$startBtn.hide();
		$questions.slideDown(1000, function () {
			$finBtn.parents('.row').slideDown();
		});
		myTimer = setInterval(function () {timerCount(); }, 1000);
	};

	function continueFromLast () {
		$startBtn.hide();
		var $qArr = $questions.find('.list-group');

		if(!lsGetVal('corrnAswrs')){
			lsSetVal('corrnAswrs', JSON.stringify({'q1':2, 'q2':1 , 'q3':3, 'q4':2}));
		}

		$startBtn.parent().append($progressBar);
		
		$qArr.each(function (ind) {
			var qnum = ind,
				selected;
			if(lsGetVal('qstn'+ind)){
				selected = lsGetVal('qstn'+ind)
			}
			$(this).find('a').each(function (aind) {
				var aswrInd = aind;
				if(aind == selected){
					$(this).addClass('active');
				}
				$(this).on('click', {'qnum':qnum, 'aswrInd':aswrInd}, linksAction);
			});
		});
		count = lsGetVal('timer');
		myTimer = setInterval(function () {timerCount(); }, 1000);
	};

	function displayResults () {
		if(lsGetVal('qstn0')){
			if(correctAnswersUsr != undefined){
				$results.html('Вашият резултат : <span class="label label-success">' + correctAnswersUsr + '</span> ' + ((correctAnswersUsr != 1) ? 'Правилни отговора' : 'Правилен отговор') + ',  <span class="label label-danger">' + (4 - correctAnswersUsr) + '</span> ' + (((4 - correctAnswersUsr) != 1) ? 'Грешни отговора' : 'Грешен отговор') + '!');
				$progressBar.remove();
				$finBtn.parents('.row').hide();
				$startBtn.parent().append($results);
				$startBtn.hide();
				$results.append($clearLSBtn);
				$clearLSBtn.on('click', clearStorage);
			} else {				
				correctAnswersUsr = 0;
				var corrnAswrs = JSON.parse(lsGetVal('corrnAswrs'));
				$.each(corrnAswrs, function (ind, val) {
					var i = (ind.replace('q','') - 1),
						usrAnswr = lsGetVal('qstn'+ i),						
						$question = $questions.find('.list-group:eq(' + i + ')');

					if(val == usrAnswr){
						correctAnswersUsr++;
						$question.find('a:eq(' + (lsGetVal('qstn'+i)) + ')').addClass('active');
					} else {
						$question.find('a:eq(' + (lsGetVal('qstn'+i)) + ')').addClass(classIncorrect + ' active');
					}					

					$question.find('a:eq(' + val  + ')').addClass(classCorrect);
					$results.html('Вашият резултат : <span class="label label-success">' + correctAnswersUsr + '</span> ' + ((correctAnswersUsr != 1) ? 'Правилни отговора' : 'Правилен отговор') + ',  <span class="label label-danger">' + (4 - correctAnswersUsr) + '</span> ' + (((4 - correctAnswersUsr) != 1) ? 'Грешни отговора' : 'Грешен отговор') + '!');
					$progressBar.remove();
					$startBtn.parent().append($results);
					$startBtn.hide();
					$results.append($clearLSBtn);
					$clearLSBtn.on('click', clearStorage);			
				})
			}
		}
	};

	function quizEnd () {
		var corrnAswrs = JSON.parse(lsGetVal('corrnAswrs'));
		var answersProvided = $questions.find('a.active').length;
		correctAnswersUsr = 0;
		if (myTimer) {
			if (answersProvided == 0 || answersProvided > 4 ) {
				msgShow('error', 'Дайте отговори на всички въпроси!');
				return;	
			}
			clearInterval(myTimer);
		}
		if (answersProvided == 0 || answersProvided > 4 ) {
			msgShow('error', 'Не сте дали отговори на всички въпроси!');
		};

		$questions.find('.list-group').each(function (ind) {
			$(this).find('a').each(function () {
				$(this).off('click');
			});

			switch(ind){
				case 0:
					if ($(this).find('a.active').index() != corrnAswrs.q1) {
						$(this).find('a.active').addClass(classIncorrect);
					}else{
						correctAnswersUsr++;
					}
					$(this).find('a:eq(' + (corrnAswrs.q1) + ')').addClass(classCorrect);
				break;
				case 1:
					if ($(this).find('a.active').index() != corrnAswrs.q2) {
						$(this).find('a.active').addClass(classIncorrect);
					}else{
						correctAnswersUsr++;
					}
					$(this).find('a:eq(' + (corrnAswrs.q2) + ')').addClass(classCorrect);
				break;
				case 2:
					if ($(this).find('a.active').index() != corrnAswrs.q3) {
						$(this).find('a.active').addClass(classIncorrect);
					}else{
						correctAnswersUsr++;
					}
					$(this).find('a:eq(' + (corrnAswrs.q3) + ')').addClass(classCorrect);
				break;
				case 3:
					if ($(this).find('a.active').index() != corrnAswrs.q4) {
						$(this).find('a.active').addClass(classIncorrect);
					}else{
						correctAnswersUsr++;
					}
					$(this).find('a:eq(' + (corrnAswrs.q4) + ')').addClass(classCorrect);
				break;
			}
		});

		$finBtn.parents('#finHold').fadeOut(1000);
		displayResults();
		//TODO display correct answers and mark user errors
	};

	function timerCount () {
		console.log(myTimer);
		console.log(count);

		var $progress = $progressBar.find('div.progress-bar[role=progressbar]'),
			progr = count/(time/100);
		$progress.css({ width: progr.toFixed(2)+'%'}).attr('aria-valuenow', progr.toFixed(2));
		switch (count) {
			case time/2:
				$progress.removeClass('progress-bar-success').addClass('progress-bar-warning');
			break;
			case (time - time/5):
				$progress.removeClass('progress-bar-success').addClass('progress-bar-danger');
			break;
			case time:
				clearInterval(myTimer);
				myTimer = false;
				quizEnd();
			break;
		}
		count++;
	};

	function lsSetVal (key, val) {
		localStorage.setItem(key, val);
	};

	function lsGetVal (key) {
		return localStorage.getItem(key);
	};

	function clearStorage () {
		localStorage.removeItem('corrnAswrs');
		localStorage.removeItem('qstn0');
		localStorage.removeItem('qstn1');
		localStorage.removeItem('qstn2');
		localStorage.removeItem('qstn3');
		init();
	};

	function msgShow (type, msg) {
		var type = (type === 'error') ? 'alert-danger' : 'alert-success';
		$('body').append('<div id="msg" class="alert ' + type + '" role="alert">' + msg + '</div>').find('#msg').fadeOut(3000,function () {
			$(this).remove();
		});
	};
	
	init();
}());
