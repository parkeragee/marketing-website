window.optly = window.optly || {};
window.optly.mrkt = window.optly.mrkt || {};
window.optly.mrkt.modal = {};
var baseUrl = document.URL,
  History = window.History || {},
  Modernizr = window.Modernizr || {},
  $elms = {
    signup: $('[data-optly-modal="signup"]'),
    signin: $('[data-optly-modal="signin"]')
  },
  initialTime = Date.now(),
  lastPop,
  testEl = $('#vh-test'),
  vhSupported,
  isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor),
  isIosSafari = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent) || /(iPhone|iPod|iPad).*AppleWebKit/i.test(navigator.userAgent),
  isIosChrome = !!navigator.userAgent.match('CriOS'),
  isHistorySupported = Modernizr.history && !!window.sessionStorage && ( !(isIosSafari || isSafari) ) || isIosChrome;

// FUNCTIONS

function setHistoryId(stateData) {
  if (stateData._id) {
    stateData._id += 1;
  } else if (sessionStorage._id) {
    stateData._id = Number(sessionStorage._id) + 1;
  } else {
    stateData._id = 1;
  }
}

function openModalHandler() {
  var modalType = $(this).data('modal-click');
  console.log(baseUrl);
  // Check for History/SessionStorage support
  if (isHistorySupported) {
    var stateData = History.getState().data;
    stateData.modalType = modalType;
    setHistoryId(stateData);
    History.pushState(stateData, 'modal open', null);
  } //else {
    //window.location.hash = modalType;
  //}
  window.optly.mrkt.modal.open(modalType);
}

function closeModalHandler(e) {
  var $modalCont = $(this);
  var $clickedElm = $(e.target);
  if ($modalCont.find(e.target).length === 0 || $clickedElm.data('modal-btn') === 'close') {
    // move history back because this event is outside of the history navigation state
    //console.log('state data in close: ', History.getState().data);
    if (isHistorySupported) {
      History.back();
    } else {
      //window.location.hash = '';
      window.optly.mrkt.modal.close($modalCont.data('optly-modal'));
    }
  }
}

// Only use this function if History/Session Storage is supported
function storeModalState(modalType, modalOpen) {
  // set the modal type and last type for an open event
  if (modalOpen) {
    sessionStorage.modalType = modalType;
    sessionStorage.lastType = '';
  }
  // set the modal type and last type for an close event
  else {
    sessionStorage.modalType = '';
    sessionStorage.lastType = modalType;
  }

  // increment the session modal state ID if it has currently been set
  if (sessionStorage._id) {
    sessionStorage._id = Number(sessionStorage._id) + 1;
  }
  // create the session modal state ID if it doesn't exist
  else {
    sessionStorage._id = 1;
  }
}

window.optly.mrkt.modal.open = function(modalType) {
  var $elm = $elms[modalType];

  if (isHistorySupported) {
    // Update the modal state in the session storage
    storeModalState(modalType, true);
  }

  if ( !$('html, body').hasClass('no-scroll') ) {
    $('html, body').addClass('no-scroll');
  } 
  
  // Fade out the modal and attach the close modal handler
  $elm.fadeToggle(function() {
    $elm.bind('click', closeModalHandler);
  });
};

window.optly.mrkt.modal.close = function(modalType) {
  var $elm = $elms[modalType];

  if (isHistorySupported) {
    // Update the modal state in the session storage
    storeModalState(modalType, false);
  }
  
  if ( $('html, body').hasClass('no-scroll') ) {
    $('html, body').removeClass('no-scroll');
  }

  window.scrollTo(0,0);
  $elm.children()[0].scrollTop = 0;
  
  // Fade out the modal and remove the close modal handler
  $elm.fadeToggle(function() {
    $elm.unbind('click', closeModalHandler);
  });
};

// Only use if History/Session Storage in Enabled
function initiateModal() {
  var modalType;
  //Trigger Dialog if # is present in URL
  if (sessionStorage.modalType === 'signup' || sessionStorage.modalType === 'signin') {
    modalType = sessionStorage.modalType;
  } 
  else if (History.getHash() === 'signup' || History.getHash() === 'signin') {
    modalType = History.getHash();
  }

  if (modalType !== undefined) {
    window.optly.mrkt.modal.open(modalType);
  }
}

function handlePopstate(e) {
  // Safari fires an initial popstate, we want to ignore this
  if ( (e.timeStamp - initialTime) > 20 ) {
    if (sessionStorage.modalType === '' || sessionStorage.modalType === undefined) {
      if (!!sessionStorage.lastType) {
        window.optly.mrkt.modal.open(sessionStorage.lastType);
      }
    } else {
      window.optly.mrkt.modal.close(sessionStorage.modalType);
    }
  }
  lastPop = e.timeStamp;
}

function setMobileProperties() {
  if (!vhSupported) {
    if (window.innerWidth <= 768) {
      $.each($elms, function(key, $elm) {
        console.log('resize');
        $( $elm.children()[0] ).css({
          height: window.innerHeight + 'px'
        });
      });
    } 
    else {
      $.each($elms, function(key, $elm) {
        console.log('resize');
        $( $elm.children()[0] ).css({
          height: 'auto'
        });
      });
    }
  }
}

//INITIALIZATION

if (isHistorySupported) {
  // Check if modal state exists from previous page view 
  initiateModal();
  // Bind to popstate
  window.setTimeout(function(){
    this.addEventListener('popstate', handlePopstate);
  }, 0);
}

// Bind modal open to nav click events
$('ul.utility-nav').delegate('[data-modal-click]', 'click', openModalHandler);

// Test for vh CSS property to make modal full height at mobile screen size
testEl.css({
  height: '100vh'
});

vhSupported = testEl.height() === window.innerHeight;

testEl.css({
  height: '0px'
});
// Set the modal height
$(window).bind('load resize', setMobileProperties);