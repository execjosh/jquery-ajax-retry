// vim: ts=4:sw=4:sts=4:noet:
(function($) {
	// Backoff tick callback
	function on_tick(backoff_info) {
		var count = backoff_info.ticks,
			minutes = Math.floor(count / 60),
			seconds = count % 60,
			display = seconds + '秒';

		if (0 < minutes) {
			display = [minutes, '分', display].join('');
		}

		$('#page').html([
			'<div>',
				backoff_info.attempts, '回中',
				backoff_info.failures, '回失敗していますが、',
				display, '後にリトライします',
				'（slot_time:', backoff_info.slot_time, '）',
			'</div>'
		].join(''));
	}

	// Error handler
	function on_error(xhr, status, error) {
		$('#page').html(['<div>OnError<br />', xhr.status, ', ', status, ', ', error, '</div>'].join(''));
		enableGui(true);
	}

	// Success handler
	function on_success(data, status, xhr) {
		$('#page').html(['<div>OnSuccess<br />', xhr.status, ', ', status, ' -- ', data, '</div>'].join(''));
		enableGui(true);
	}

	// Complete handler
	function on_complete(xhr, status) {
		console.log(['OnComplete -- ', xhr.status, ', "', status, '"'].join(''));
	}

	var elmIds = [
			'#ajax',
			'#ajax-vals',
			'#ajaxRetrySetup',
			'#attempts',
			'#cutoff',
			'#slot_time'
		].join(', ');

	function enableGui(enable){
		if (!enable) {
			$(elmIds).attr('disabled','disabled');
		}
		else {
			$(elmIds).removeAttr('disabled');
		}
	}

	// Set-up
	$(document).ready(function(){
		var def_opts = {
				attempts: 8,
				cutoff: 5,
				slot_time: 100,
			},
			ajaxSettings = {
				url: 'this/file/does/not/exist',
				error: on_error,
				success: on_success,
				complete: on_complete,
				async: true,
				cache: false
			};

		$('#attempts').val(def_opts.attempts);
		$('#cutoff').val(def_opts.cutoff);
		$('#slot_time').val(def_opts.slot_time);

		function getRetryOpts() {
			return {
				attempts: $('#attempts').val(),	// Attempts after which to give up
				cutoff: $('#cutoff').val(),	// Attempts after which to stop exponentiation
				slot_time: $('#slot_time').val()	// Slot time (duration between ticks)
			};
		}

		function initiateAjax(opts) {
			$.ajax($.extend(true, {}, ajaxSettings, {retry: opts}));
		}

		$('#ajax').click(function(){
			enableGui(false);
			initiateAjax($.extend(true, {}, $.ajaxRetrySettings, {tick: on_tick}));
		});

		$('#ajax-vals').click(function(){
			enableGui(false);
			initiateAjax($.extend(true, getRetryOpts(), {tick: on_tick}));
		});

		$('#ajaxRetrySetup').click(function(){
			$.ajaxRetrySetup(getRetryOpts());
		});
	});
})(jQuery);
