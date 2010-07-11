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
			'#slot_time',
			'#http_code'
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
		var ajaxSettings = {
				url: 'test.php',
				error: on_error,
				success: on_success,
				complete: on_complete,
				async: true,
				cache: false
			};

		function setup_ui() {
			var def_opts = {
					attempts: 8,
					cutoff: 5,
					slot_time: 100,
				},
				// http://en.wikipedia.org/wiki/List_of_HTTP_status_codes
				http_codes = {
					'1xx Informational':[
						'100 Continue',
						'101 Switching Protocols',
						'102 Processing'
					],
					'2xx Success':[
						'200 OK',
						'201 Created',
						'202 Accepted',
						'203 Non-Authoritative Information',
						'204 No Content',
						'205 Reset Content',
						'206 Partial Content',
						'207 Multi-Status'
					],
					'3xx Redirection':[
						'300 Multiple Choices',
						'301 Moved Permanently',
						'302 Found',
						'303 See Other',
						'304 Not Modified',
						'305 Use Proxy',
						'306 Switch Proxy',
						'307 Temporary Redirect'
					],
					'4xx Client Error':[
						'400 Bad Request',
						'401 Unauthorized',
						'402 Payment Required',
						'403 Forbidden',
						'404 Not Found',
						'405 Method Not Allowed',
						'406 Not Acceptable',
						'407 Proxy Authentication Required',
						'408 Request Timeout',
						'409 Conflict',
						'410 Gone',
						'411 Length Required',
						'412 Precondition Failed',
						'413 Request Entity Too Large',
						'414 Request-URI Too Long',
						'415 Unsupported Media Type',
						'416 Requested Range Not Satisfiable',
						'417 Expectation Failed',
						'418 I\'m a teapot',
						'422 Unprocessable Entity',
						'423 Locked',
						'424 Failed Dependency',
						'425 Unordered Collection',
						'426 Upgrade Required',
						'449 Retry With',
						'450 Blocked by Windows Parental Controls'
					],
					'5xx Server Error':[
						'500 Internal Server Error',
						'501 Not Implemented',
						'502 Bad Gateway',
						'503 Service Unavailable',
						'504 Gateway Timeout',
						'505 HTTP Version Not Supported',
						'506 Variant Also Negotiates',
						'507 Insufficient Storage',
						'509 Bandwidth Limit Exceeded',
						'510 Not Extended'
					]
				},
				opt_list = [];

			$('#attempts').val(def_opts.attempts);
			$('#cutoff').val(def_opts.cutoff);
			$('#slot_time').val(def_opts.slot_time);

			$.each(http_codes, function(key, val){
				var grp = [];
				$.each(val, function(){
					grp.push(['<option>', this, '</option>'].join(''));
				});
				opt_list.push([
					'<optgroup label="', key, '">',
						grp.join(''),
					'</optgroup>'
				].join(''));
			});

			$('#http_code').html(opt_list.join(''));
		}

		function getRetryOpts() {
			return {
				attempts: $('#attempts').val(),	// Attempts after which to give up
				cutoff: $('#cutoff').val(),	// Attempts after which to stop exponentiation
				slot_time: $('#slot_time').val()	// Slot time (duration between ticks)
			};
		}

		function initiateAjax(opts) {
			var opts = {
				retry: opts,
				data: {http_code:$('#http_code').val()}
			};
			$.ajax($.extend(true, {}, ajaxSettings, opts));
		}

		setup_ui();

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
