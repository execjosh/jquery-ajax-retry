/**!
 * jQuery Ajax Retry
 *
 * project-site: http://plugins.jquery.com/project/jquery-ajax-retry
 * repository: http://github.com/execjosh/jquery-ajax-retry
 *
 * @author execjosh
 *
 * Copyright (c) 2010 execjosh, http://execjosh.blogspot.com
 * Licenced under the terms of the MIT License
 * (http://github.com/execjosh/jquery-ajax-retry/blob/master/LICENSE)
 */
(function($) {
	var NOP_FUNC = function(){},
		MIN_ATTEMPTS = 1,
		MAX_ATTEMPTS = 1024,
		MAX_CUTOFF = 1024,
		MIN_CUTOFF = 1,
		MAX_SLOT_TIME = 10000,
		MIN_SLOT_TIME = 10,
		DEF_ATTEMPTS = 16,
		DEF_CUTOFF = 5,
		DEF_DELAY_FUNC = function(i){
			return Math.floor(Math.random() * ((2 << i) - 1));
		},
		DEF_SLOT_TIME = 1000,
		DEF_OPTS = {
			attempts: DEF_ATTEMPTS,
			cutoff: DEF_CUTOFF,
			delay_func: DEF_DELAY_FUNC,
			slot_time: DEF_SLOT_TIME,
			tick: NOP_FUNC
		},
		ajaxWithRetry = function(req){
			var failures = 0,
				opts = $.extend(true, {}, DEF_OPTS, req.retry || {}),
				orig_err_func = req.error || NOP_FUNC;

			function retry_delay(time) {
				if (0 > time) {
					$.ajax(req);
				}
				else {
					// Send tick event to listener
					window.setTimeout(function(){opts.tick(time)}, 0);
					// Wait for slot_time
					window.setTimeout(function(){retry_delay(time - 1)}, opts.slot_time);
				}
			}

			// Clamp options
			opts.attempts = Math.max(MIN_ATTEMPTS, Math.min(opts.attempts, MAX_ATTEMPTS)),
			opts.cutoff = Math.max(MIN_CUTOFF, Math.min(opts.cutoff, MAX_CUTOFF)),
			opts.slot_time = Math.max(MIN_SLOT_TIME, Math.min(opts.slot_time, MAX_SLOT_TIME)),
			opts.tick = opts.tick || NOP_FUNC;
			opts.delay_func = opts.delay_func || DEF_DELAY_FUNC;

			// Override error function
			req.error = function(xhr_obj, textStatus, errorThrown){
				failures++;
				if (failures >= opts.attempts) {
					// Give up and call the original error function
					window.setTimeout(function(){orig_err_func(xhr_obj, textStatus, errorThrown)}, 0);
				}
				else {
					var i = ((failures >= opts.cutoff) ? opts.cutoff : failures) - 1;
					window.setTimeout(function(){retry_delay(opts.delay_func(i))}, 0);
				}
			};

			return $.ajax(req);
		};

	ajaxWithRetry.retrySetup = function(opts){
		DEF_OPTS = $.extend(true, DEF_OPTS, opts || {});
		return DEF_OPTS;
	};

	$['ajaxWithRetry'] = ajaxWithRetry;
})(jQuery);

// vim: ts=4:sw=4:sts=4:noet:

