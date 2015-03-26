;(function(){

  var w, d;

  w = window;

  d = document;

  w.optly = w.optly || {};

  w.optly.mrkt = w.optly.mrkt || {};

  w.optly.mrkt.Oform = {};

  w.optly.mrkt.Oform.before = function(){

    d.getElementsByTagName('body')[0].classList.add('oform-processing');

    return true;

  };

  w.optly.mrkt.Oform.defaultMiddleware = function(XHR, data){

    XHR.withCredentials = true;

    return data;

  };

  w.optly.mrkt.Oform.validationError = function(element){

    w.optly.mrkt.formHadError = true;

    var elementValue = $(element).val();

    var elementHasValue = elementValue ? 'has value' : 'no value';

    w.analytics.track($(element).closest('form').attr('id') + ' ' + element.getAttribute('name') + ' error submit', {

      category: 'form error',

      label: elementHasValue,

      value: elementValue.length

    }, {

      integrations: {

        Marketo: false

      }

    });

  };

  w.optly.mrkt.Oform.done = function(){

    d.getElementsByTagName('body')[0].classList.remove('processing');

  };

  w.optly.mrkt.Oform.trackLead = function(args) {

    /*

      REPORTS NEW LEADS TO VARIOUS TRACKING PLATFORMS

        Accepts one argument (object) that should contains two properties:

          - response (object - optional): The parsed response from the parseResponse function
          - requestPayload (object): the form fields and their values

    */

    var reportingObject,
        source,
        payload = args.requestPayload,
        response = args.response || {};

    source = w.optly.mrkt.source;

    //start the reporting object with the required parameters
    reportingObject = {
      leadSource: 'Website'
    };

    //add only the values we have to the reporting object
    if(response.email){
      reportingObject.email = response.email;
    } else if(payload.email){
      reportingObject.email = payload.email;
    }
    if(response.first_name){
      reportingObject.firstName = response.first_name;
    } else if(payload.first_name){
      reportingObject.firstName = payload.first_name;
    }
    if(response.last_name){
      reportingObject.lastName = response.last_name;
    } else if(payload.last_name) {
      reportingObject.lastName = payload.last_name;
    }
    if(response.phone_number){
      reportingObject.phone = response.phone_number;
    } else if(payload.phone_number){
      reportingObject.phone = payload.phone_number;
    }
    if(payload.company){
      reportingObject.company = payload.company;
    }
    if(payload.title){
      reportingObject.title = payload.title;
    }
    if(payload.website){
      reportingObject.website = payload.website;
    }
    if(payload.Web_Interest__c){
      reportingObject.Web_Interest__c = 'true';
    }
    if(payload.Mobile_Web_Interest__c){
      reportingObject.Mobile_Web_Interest__c = 'true';
    }
    if(payload.iOS_Interest__c){
      reportingObject.iOS_Interest__c = 'true';
    }
    if(payload.Android_Interest__c){
      reportingObject.Android_Interest__c = 'true';
    }
    if(payload.leadSource){
      reportingObject.leadSource = payload.leadSource;
    }
    if(payload.Initial_Form_Source__c){
      reportingObject.Initial_Form_Source__c = payload.Initial_Form_Source__c;
    }
    if(payload.Inbound_Lead_Form_Type__c){
      reportingObject.Inbound_Lead_Form_Type__c = payload.Inbound_Lead_Form_Type__c;
    }
    if(payload.LeadSource_Category__c){
      reportingObject.LeadSource_Category__c = payload.LeadSource_Category__c;
    }
    if(payload.Lead_Source_Subcategory__c){
      reportingObject.Lead_Source_Subcategory__c = payload.Lead_Source_Subcategory__c;
    }
    if(payload['Most Recent External Events Ops']){
      reportingObject['Most Recent External Events Ops'] = payload['Most Recent External Events Ops'];
    }
    //add source information
    //source is usually url query params from ads
    if(source.utm.campaign){
      reportingObject.utm_Campaign__c = source.utm.campaign;
    }
    if(source.utm.content){
      reportingObject.utm_Content__c = source.utm.content;
    }
    if(source.utm.medium){
      reportingObject.utm_Medium__c = source.utm.medium;
    }
    if(source.utm.source){
      reportingObject.utm_Source__c = source.utm.source;
    }
    if(source.utm.keyword){
      reportingObject.utm_Keyword__c = source.utm.keyword;
    }
    if(source.otm.campaign){
      reportingObject.otm_Campaign__c = source.otm.campaign;
    }
    if(source.otm.content){
      reportingObject.otm_Content__c = source.otm.content;
    }
    if(source.otm.medium){
      reportingObject.otm_Medium__c = source.otm.medium;
    }
    if(source.otm.source){
      reportingObject.otm_Source__c = source.otm.source;
    }
    if(source.otm.keyword){
      reportingObject.otm_Keyword__c = source.otm.keyword;
    }
    if(source.gclid){
      reportingObject.GCLID__c = source.gclid;
    }
    if(payload.Signup_Platform__c){
      reportingObject.Signup_Platform__c = payload.Signup_Platform__c;
    }

    //set the source cookie so that the next page know where the visitor
    //came from
    $.cookie('sourceCookie',
      source.utm.campaign + '|||' +
      source.utm.content + '|||' +
      source.utm.medium + '|||' +
      source.utm.source + '|||' +
      source.utm.keyword + '|||' +
      source.otm.campaign + '|||' +
      source.otm.content + '|||' +
      source.otm.medium + '|||' +
      source.otm.source + '|||' +
      source.otm.keyword + '|||' +
      source.signup_platform + '|||'
    );

    var anonymousVisitorIdentifier = window.optly.mrkt.utils.randomString();

    w.analytics.identify(response.unique_user_id || anonymousVisitorIdentifier, reportingObject, {
      integrations: {
        Marketo: true
      }
    });

    if(w.optly.mrkt.automatedTest){
      $('body').attr('data-reporting-object', JSON.stringify(reportingObject));
    }

    /* legacy reporting - to be deprecated */

    w.analytics.track('/account/create/success', {
      category: 'account',
      label: w.optly.mrkt.utils.trimTrailingSlash(w.location.pathname)
    });

    w.analytics.track('/account/signin', {
      category: 'account',
      label: w.optly.mrkt.utils.trimTrailingSlash(w.location.pathname)
    }, {
      integrations: {
        'Marketo': false
      }
    });

    w.analytics.track('/event/plan/null', {}, {
      integrations: {
        'All': false,
        'Marketo': true
      }
    });

    var reportingPlan;

    if(typeof(response.plan) == 'string'){
      reportingPlan = response.plan;
    } else {
      reportingPlan = 'null';
    }

    w.analytics.track('/event/plan' + reportingPlan, {}, {
      integrations: {
        'All': false,
        'Marketo': true
      }
    });
    w.analytics.page('/plan/' + response.plan);

    /* new reporting */

    w.analytics.track('account created', {
      category: 'account',
      label: window.optly.mrkt.utils.trimTrailingSlash(w.location.pathname)
    }, {
      integrations: {
        'Marketo': false
      }
    });

    w.analytics.track('account signin', {
      category: 'account',
      label: window.optly.mrkt.utils.trimTrailingSlash(w.location.pathname)
    }, {
      integrations: {
        'Marketo': false
      }
    });

  };

  w.optly.mrkt.Oform.initContactForm = function(arg){

    new Oform({
      selector: arg.selector,
      middleware: w.optly.mrkt.Oform.defaultMiddleware
    })
    .on('validationerror', w.optly.mrkt.Oform.validationError)
    .on('load', function(event){
      if(event.XHR.status === 200){
        //identify user
        $('body').addClass('oform-success');
        var response = JSON.parse(event.XHR.responseText),
            email = d.querySelector('[name="email"]').value,
            traffic = d.querySelector('#traffic');
        w.analytics.identify(response.unique_user_id, {
          name: d.querySelector('[name="name"]').value,
          email: email,
          Email: email,
          phone: d.querySelector('[name="phone"]').value || '',
          company: d.querySelector('[name="company"]').value || '',
          website: d.querySelector('[name="website"]').value || '',
          utm_Medium__c: w.optly.mrkt.source.utm.medium,
          otm_Medium__c: w.optly.mrkt.source.otm.medium,
          Demo_Request_Monthly_Traffic__c: traffic.options[traffic.selectedIndex].value || '',
          Inbound_Lead_Form_Type__c: d.querySelector('[name="inboundFormLeadType"]').value,
          token: response.token
        }, {
          integrations: {
            Marketo: true
          }
        });
        //track the event
        w.analytics.track('demo requested', {
          category: 'contact form',
          label: w.optly.mrkt.utils.trimTrailingSlash(w.location.pathname)
        }, {
          integrations: {
            Marketo: true
          }
        });
      }
    });

  };

})();
