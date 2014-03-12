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
        baseUrl: 'weradio-development.s3-website-sa-east-1.amazonaws.com'
      },

      production: {
        firebaseDataURL: 'https://weradio.firebaseio.com/',
        baseUrl: 'weradio-production.s3-website-sa-east-1.amazonaws.com'
      },

      common: {
        youTubeAPIKey: 'AIzaSyDSvG0AkJljgRcTITwaPDIoSYN5gQ_UNjk'
      },

      env: 'local',

      get: function(key) {
        var config = _.extend({}, this[this.env], this.common);
        if (!config[key]) {
          throw new Error('The key ' + key + ' does not exist in the config object ' +
            'for the environment ' + this.env);
        }
        return config[key];
      }
    };
  }
);
