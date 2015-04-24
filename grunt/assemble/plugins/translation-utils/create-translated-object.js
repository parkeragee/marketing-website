var _ = require('lodash');

module.exports = function(locales, localeCode, pageDataClone) {
  var filteredLocales = Object.keys(pageDataClone).filter(function(pageDataKey) {
    if(locales[pageDataKey] === localeCode) {
      return true;
    }
  });

  return filteredLocales.reduce(function(o, pageDataKey) {
    _.forEach(pageDataClone[pageDataKey], function(val, fp) {
      if(!o.hasOwnProperty(fp)) {
        o[fp] = val;
      }
    });

    return o;
  }, {});

};
