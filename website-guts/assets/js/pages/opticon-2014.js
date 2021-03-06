/* Image Gallery Modal */
$('.gallery__image-cont').magnificPopup({
  delegate: '.gallery__image-cont__item',
  type: 'image',
  gallery:{enabled:true}
});

/* Video Player */
var player;
var tag = document.createElement('script');

tag.src = '//www.youtube.com/iframe_api';
var scriptTags = document.getElementsByTagName('script');
var lastScriptTag = scriptTags[scriptTags.length - 1];
lastScriptTag.parentNode.insertBefore(tag, lastScriptTag.nextSibling);

window.onYouTubeIframeAPIReady = function () {
  player = new window.YT.Player('player', {
    height: '390',
    width: '640',
    videoId: '16bCgEd0cw0'
  });
};

$(function() {
   var videoPlayed = false,
    playerSupported = false;

  //video player open and autoplay
  $('[data-show-video]').on('click', function(e) {
    e.preventDefault();
    window.optly.mrkt.modal.open({modalType: 'video-modal'});
    if(typeof player === 'object' && typeof player.getPlayerState === 'function') {
      playerSupported = true;
      //deal with the lack of autoplay upon inital open for mobile
      if(!window.optly.mrkt.isMobile() || videoPlayed) {
        var playerInt = window.setInterval(function() {
          if(player.getPlayerState() !== 1) {
            player.playVideo();
          } else {
            window.clearInterval(playerInt);
          }
        }, 10);
      }
    }
    if(!videoPlayed) {
      videoPlayed = true;
    }
  });

  $('[data-optly-modal="video-modal"]').on('click', function(e) {
    e.preventDefault();
    if(playerSupported) {
      player.stopVideo();
    } else {
      $('.fallback-player').attr('src', '');
    }
  });
});
