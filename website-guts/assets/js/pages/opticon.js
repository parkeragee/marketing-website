var urlParams = window.optly.mrkt.utils.deparam(window.location.search);
if (urlParams) {
  var replacementHref = window.optly.mrkt.utils.param('https://opticon2015.eventbrite.com/?ref=elink', urlParams);
  $('#register .cta').attr('href', replacementHref);
}
