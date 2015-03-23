w.optly.mrkt.anim = w.optly.mrkt.anim || {};

w.optly.mrkt.isMobile = function(){

	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {

		return true;

	} else {

		return false;

	}

};

w.optly.mrkt.automatedTest = function(){

	var uiTest, stagingDomain;

	uiTest = w.optly.mrkt.utils.getURLParameter('uiTest') === 'true';

	stagingDomain = w.location.hostname !== 'www.optimizely.com';

	if(uiTest && stagingDomain){
		return true;
	} else {
		return false;
	}

};

w.optly.mrkt.mobileJS = function(){

	if( w.optly.mrkt.isMobile() ){

		$('body').addClass('mobile');

		$.getScript(w.optly.mrkt.assetsDir + '/js/libraries/fastclick.js', function(){

			w.FastClick.attach(document.body);

		});

  }

  var querystring = w.optly.mrkt.utils.deparam(w.location.href);

  if( (querystring.site_mode && querystring.site_mode === 'mobile') ) {
    $.cookie('optimizelySiteMode', 'mobile', { path: '/' });
  }

  var mobileNavBound = false;
  $(w).on('load resize', function() {
    if(w.innerWidth <= 960) {
        $('body').addClass('mobile-nav-ready');

        if(!mobileNavBound) {
            $('.mobile-nav-toggle').on('click', function(e){

            $('body').toggleClass('nav-open');

                e.preventDefault();

            });

            $('.user-nav-toggle').on('click', function(e){

                $('body').toggleClass('user-nav-open');

                e.preventDefault();

            });



            $('#main-nav > li').on('click', function(){

                $(this).toggleClass('active').find('ul').toggleClass('active');

            });

            mobileNavBound = true;
        }


    } else {
        $('body').removeClass('mobile-nav-ready');
    }

  });


};

w.optly.mrkt.mobileJS();

//apply active class to active links
w.optly.mrkt.activeLinks = {};

w.optly.mrkt.activeLinks.currentPath = w.location.pathname;

w.optly.mrkt.activeLinks.markActiveLinks = function(){

	$('a').each(function(){

		if(

			$(this).attr('href') === w.optly.mrkt.activeLinks.currentPath ||
			$(this).attr('href') + '/' === w.optly.mrkt.activeLinks.currentPath

		){

			$(this).addClass('active');

		}

	});

};

w.optly.mrkt.activeLinks.markActiveLinks();

w.optly.mrkt.inlineFormLabels = function(){

	if(w.optly.mrkt.browser !== 'Explorer'){

		$('form.inline-labels :input').each(function(index, elem) {

			var eId = $(elem).attr('id');

			var label = null;

			if (eId && (label = $(elem).parents('form').find('label[for='+eId+']')).length === 1) {

				$(elem).attr('placeholder', $(label).html());

				$(label).addClass('hide-label');

			}

		});

	}

};

w.optly.mrkt.formDataStringToObject = function getJsonFromUrl(string) {

	var data, result, i;

  data = string.split('&');

  result = {};

  for(i=0; i<data.length; i++) {

    var item = data[i].split('=');

    result[item[0]] = item[1];

  }

  return result;

};

//Test for viewport unit support
Modernizr.addTest('viewportunits', function() {
    var bool;

    Modernizr.testStyles('#modernizr { width: 50vw; }', function(elem) {
        var width = parseInt(w.innerWidth/2,10),
            compStyle = parseInt((w.getComputedStyle ?
                      getComputedStyle(elem, null) :
                      elem.currentStyle).width,10);

        bool= (compStyle === width);
    });

    return bool;
});

/*  Random string function for analytics.identify
  * taken from here:
  * http://stackoverflow.com/questions/1349404/generate-a-string-of-5-random-characters-in-javascript
  */
w.optly.mrkt.utils.randomString = function() {

  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for(var i=0; i < 8; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
};

w.optly_q.push([function(){

	if(typeof w.optly_q.acctData === 'object'){

		w.analytics.ready(function(){

			w.Munchkin.munchkinFunction('associateLead', {

				Email: w.optly_q.acctData.email

			}, w.optly_q.acctData.munchkin_token);

		});

    var anonymousVisitorIdentifier = w.optly.mrkt.utils.randomString();
		w.analytics.identify(anonymousVisitorIdentifier, {
			name: w.optly_q.acctData.name,
			email: w.optly_q.acctData.email,
      Email: w.optly_q.acctData.email
		});

	}

}]);

var BrowserDetect = {
    init: function () {
        this.browser = this.searchString(this.dataBrowser) || 'Other';
        this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || 'Unknown';
    },
    searchString: function (data) {
        for (var i = 0; i < data.length; i++) {
            var dataString = data[i].string;
            this.versionSearchString = data[i].subString;

            if (dataString.indexOf(data[i].subString) !== -1) {
                return data[i].identity;
            }
        }
    },
    searchVersion: function (dataString) {
        var index = dataString.indexOf(this.versionSearchString);
        if (index === -1) {
            return;
        }

        var rv = dataString.indexOf('rv:');
        if (this.versionSearchString === 'Trident' && rv !== -1) {
            return parseFloat(dataString.substring(rv + 3));
        } else {
            return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
        }
    },

    dataBrowser: [
        {string: navigator.userAgent, subString: 'Chrome', identity: 'Chrome'},
        {string: navigator.userAgent, subString: 'MSIE', identity: 'Explorer'},
        {string: navigator.userAgent, subString: 'Trident', identity: 'Explorer'},
        {string: navigator.userAgent, subString: 'Firefox', identity: 'Firefox'},
        {string: navigator.userAgent, subString: 'Safari', identity: 'Safari'},
        {string: navigator.userAgent, subString: 'Opera', identity: 'Opera'}
    ]

};

BrowserDetect.init();

w.optly.mrkt.browser = BrowserDetect.browser;

w.optly.mrkt.browserVersion = BrowserDetect.version;

/*
  Helper function to mark messages that should be localized.
  Later it may be changed to retrieve actual translations from somewhere.
  It allows to substitute messages - for example tr("Hi {0}, this is {1}", "Bob", "Jerry"); will return "Hi Bob, this is Jerry"
 */
/**
 * Returns localized version of a string with parameters substituted.
 * Everything after first argument is considered as substitutions.
 * @param {String} str -  String to localize
 * @param {...*} substitutions - Substitution parameters
 * @returns {String} Localized string
 */
w.optly.tr = function(str) {
  // If w.optlyDict is present - use it for dictionary lookup.
  // Need to have a global variable here because it must be declared *before* app load because app may need to localize
  // message during initialize.
  if(typeof w.optlyDict !== 'undefined' && w.optlyDict[str] !== null) {
    str = w.optlyDict[str];
  }

  var subs = [].slice.call(arguments, 1);
  if(subs.length > 0){
    // Convert message resource to string if we need to make a substitutions
    return str.toString().replace(/\\*{(\d+)}/g, function(match, number) {
      var slashes = match.substring(0, match.indexOf('{'));
      if(slashes.length === 1) {
        // single slash used to escape curly bracket
        return match.substr(1);
      }
      else if(typeof subs[number] === 'undefined') {
        return match;
      }
      return slashes + subs[number];
    });
  }
  return str;
};

w.optly.mrkt.changePlanHelper = {

	changePlan: function(args){

		/*

			Changes the user's plan.

			args.plan (string) = new plan code
			args.load (function) = when the response on the http request is received, receives the XMLHttpRequestProgressEvent as an argument
			args.abort (function) = when the request is aborted, receives the XMLHttpRequestProgressEvent as an argument
			args.error (function) = when there is an error, receives the XMLHttpRequestProgressEvent as an argument
			args.callback (function) = a callback for the load event, gets passed the load event

		*/

		if(typeof args.plan === 'string' && args.plan){

			var setPlan = new XMLHttpRequest();

			setPlan.addEventListener('load', function(event){

				if(typeof args.load === 'function'){

					if(typeof args.callback === 'function'){

						args.load(event, args.callback);

					} else {

						args.load(event);

					}

				}

			}, false);

			setPlan.addEventListener('abort', function(event){

				if(typeof args.abort === 'function'){

					args.abort(event);

				}

			}, false);

			setPlan.addEventListener('error', function(event){

				if(typeof args.error === 'function'){

					args.error(event);

				}

			}, false);

			setPlan.open('post', w.apiDomain + '/pricing/change_plan', true);
			setPlan.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
			setPlan.send('plan_id=' + args.plan);

		}

	},
	load: function(event, callback){

		/*

			Accepts a callback that gets run 1 second after the reporting finishes

		*/

		if(event.target.status === 200){

			d.body.classList.add('change-plan-success');

			w.Munchkin.munchkinFunction('visitWebPage', {
				url: '/event/plan/free_light'
			});
			w.analytics.page('/plan/free_light');
			w.analytics.track('change plan', {
				category: 'account',
				label: w.optly.mrkt.utils.trimTrailingSlash(w.location.pathname)
			}, {
				integrations: {
					Marketo: false
				}
			});
			w.analytics.track('/plan/free_light', {
				category: 'account',
				label: w.optly.mrkt.utils.trimTrailingSlash(w.location.pathname)
			}, {
				integrations: {
					Marketo: false
				}
			});
			var oldPlan = 'nothing';
			if(
					typeof w.optly.mrkt.user.acctData === 'object' &&
					typeof w.optly.mrkt.user.acctData.plan_id === 'string'
			){
				oldPlan = w.optly.mrkt.user.acctData.plan_id;
			}
			w.analytics.track('plan downgraded', {
				category: 'account',
				label: oldPlan + ' to free_light'
			}, {
				integrations: {
					Marketo: false
				}
			});

			if(typeof callback === 'function'){

				setTimeout(function(){

					callback(event);

				}, 1000);

			}

		} else {

			//to do: update the ui for the error
			w.analytics.track('/pricing/change_plan', {
				category: 'api error',
				label: 'pricing change plan status not 200: ' + event.XHR.status
			}, {
				integrations: {
					Marketo: false
				}
			});

		}

	},
	showDowngradeConfirmation: function(event, callback){

		//show the downgrade confirmation modal
		w.optly.mrkt.modal.open({ modalType: 'downgrade-plan-confirm' });
		$('#downgrade-plan-confirm-cont .close-btn').click(function(){
			if(!w.optly.mrkt.automatedTest()){
				location.reload();
			}
		});

		if(typeof callback === 'function'){
			callback(event);
		}

	},
	error: function(){

		w.analytics.track('/pricing/change_plan', {
			category: 'xmlhttprequest problem',
			label: 'xmlhttprequest error'
		}, {
			integrations: {
				Marketo: false
			}
		});

	},
	abort: function(){

		w.analytics.track('/pricing/change_plan', {
			category: 'xmlhttprequest problem',
			label: 'xmlhttprequest abort'
		}, {
			integrations: {
				Marketo: false
			}
		});

	}

};

w.optly.mrkt.utils.smoothScroll = function(event) {

	var targetElmPos = $(this.getAttribute('href')).offset().top;

	event.preventDefault();

	$('html,body').animate({
		scrollTop: targetElmPos
	}, 1000);
};

//pre-populate fields from account info
w.optly_q.push([function(){
	if(typeof w.optly.mrkt.user.acctData === 'object'){
		if(typeof w.optly.mrkt.user.acctData.first_name === 'string'){
			$('[name="first_name"]').val(w.optly.mrkt.user.acctData.first_name);
		}
		if(typeof w.optly.mrkt.user.acctData.last_name === 'string'){
			$('[name="last_name"]').val(w.optly.mrkt.user.acctData.last_name);
		}
		if(
				typeof w.optly.mrkt.user.acctData.first_name === 'string' &&
				typeof w.optly.mrkt.user.acctData.last_name === 'string'
			){
				$('[name="name"]').val(w.optly.mrkt.user.acctData.first_name + ' ' + w.optly.mrkt.user.acctData.last_name);
		}
		if(typeof w.optly.mrkt.user.acctData.email === 'string'){
			$('[name="email"]').val(w.optly.mrkt.user.acctData.email);
			$('[name="email_address"]').val(w.optly.mrkt.user.acctData.email);
		}
	}
}]);

w.optly.mrkt.formHadError = false;

w.optly.mrkt.deleteCookie = function(name, options) {
  $.removeCookie(name, options);
};

//call the utility function to unregister archived experiments from the mixpanel cookie
w.analytics.ready(w.optly.mrkt.utils.trimMixpanelCookie);

//report optimizely load time
if(w.monitorTiming){
	var reportOptimizelyTiming = setInterval(function(){
		if(w.optimizelyLoadTime){
			if(w.ga){
				w.ga('send', {
			    'hitType': 'timing',
			    'timingCategory': 'external script timing',
			    'timingVar': 'cdn.optimizely.com',
			    'timingValue': w.optimizelyLoadTime,
					'timingLabel': 'Optimizely',
			    'page': w.optly.mrkt.utils.trimTrailingSlash(w.location.pathname)
			  });
				clearInterval(reportOptimizelyTiming);
			}
		}
	}, 1000);
}

if( $.cookie('amplitude_idoptimizely.com') ) {
  w.optly.mrkt.deleteCookie('amplitude_idoptimizely.com', { path: '/', expires: -5, domain: '.optimizely.com'} );
}

w.optly.mrkt.setAttributeCookie = function(){

	if(
		typeof w.optly.mrkt.user === 'object' &&
		typeof w.optly.mrkt.user.acctData === 'object' &&
		typeof w.optly.mrkt.user.acctData.plan_id === 'string'
	){

		var planMap = w.optly.planMap,
				plan,
				planCode,
				existingVisitorAttributeCookieValues = $.cookie('visitorAttributes'),
				newVisitorAttributeCookieValues = [];

		plan = w.optly.mrkt.user.acctData.plan_id;

		if(existingVisitorAttributeCookieValues){
			existingVisitorAttributeCookieValues = existingVisitorAttributeCookieValues.split('|');
		}

		if(typeof planMap[plan] === 'string'){

			planCode = planMap.plan;

			if(existingVisitorAttributeCookieValues){

				if(planCode !== existingVisitorAttributeCookieValues[0]){

					newVisitorAttributeCookieValues.push(planMap[plan]);

				}

			} else {

				newVisitorAttributeCookieValues.push(planMap[plan]);

			}

		}

		$.cookie('visitorAttributes', newVisitorAttributeCookieValues.join('|'), {expires: 90, path: '/'});

	} else {

		$.removeCookie('visitorAttributes', {path: '/'});

	}

};

w.optly.mrkt.setAttributeCookie();
