/**
 * App configurations
 */
define(
  [
    'underscore'
  ],
  function(_) {

    return {
      local: {
        firebaseDataURL: 'https://weradio-development.firebaseio.com/',
        baseUrl: 'localhost'
      },

      development: {
        firebaseDataURL: 'https://weradio-development.firebaseio.com/',
        development: 'weradio-development.s3-website-sa-east-1.amazonaws.com'
      },

      production: {
        firebaseDataURL: 'https://weradio.firebaseio.com/',
        development: 'weradio-production.s3-website-sa-east-1.amazonaws.com'
      },

      common: {
        youTubeAPIKey: 'AIzaSyDSvG0AkJljgRcTITwaPDIoSYN5gQ_UNjk'
      },

      env: 'production',

      get: function(key) {
        var config = _.extend({}, this[this.env], this.common);
        if (!config[key]) {
          throw new Error('The key you are looking for does not exist in the config object');
        }
        return config[key];
      }
    };
  }
);
