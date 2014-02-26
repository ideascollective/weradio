define(
  [
    'jquery',
    'underscore',
    'polyglot',
    'modernizr'
  ],
  function($, _, Polyglot, Modernizr) {
    'use strict';

    var i18nService = {

      polyglot: null,

      load: function(lang) {
        var promiseOnResourceLoaded = $.Deferred();

        this.polyglot = new Polyglot({
          locale: lang
        });

        $.getJSON('resources/' + lang + '.json')
          .done(_.bind(function(resource) {
            this.polyglot.extend(resource);
            promiseOnResourceLoaded.resolve();
          }, this))
          .fail(function() {
            promiseOnResourceLoaded.reject();
          });

        return promiseOnResourceLoaded;
      },

      t: function(key, interpolationOptions) {
        return this.polyglot.t(key, interpolationOptions);
      },

      dispose: function() {
        this.polyglot.clear();
      }

    };

    return i18nService;
  }
);