define(
  [
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'handlebars',
    './router',
    'playlistcollection',
    'templateregistry',
    './services/i18n/i18n.service'
  ],
  function($, _, Backbone, Marionette, Handlebars, Router,
    PlaylistCollection, JST, i18nService) {
    'use strict';

    var Application = new Marionette.Application();

    Application.on('initialize:before', function(options) {
      Marionette.Renderer.render = function(template, data) {
        if (!JST[template]) {
          throw "Template '" + template + "' not found!";
        }
        return JST[template](data);
      };
    });

    Application.on('initialize:before', function(options) {

      this.vent.on('analytics', function(event) {
        var body = event.body || {};
        mixpanel.track(event.key, body);
      });

    });

    Application.on('initialize:before', function(options) {

      this.vent.on('analytics', function(event) {
        var body = event.body || {};
        mixpanel.track(event.key, body);
      });

    });

    Application.on('initialize:before', function(options) {

      Handlebars.registerHelper('t', function(key) {
        return i18nService.t(key);
      });

    });

    Application.on('initialize:after', function(options) {
      var ModalRegion = Backbone.Marionette.Region.extend({
        el: '#modalRegion',
        onShow: function(view) {
          this.$el.removeClass('invisible');
        },
        onClose: function() {
          this.$el.addClass('invisible');
        }
      });

      Application.addRegions({
        mainRegion: '#mainRegion',
        modalRegion: ModalRegion
      });
    });

    function startApp() {
      /*jshint validthis: true */
      try {
        new Router();
        Backbone.history.start();
        this.vent.trigger('analytics', {
          key: 'application.loaded'
        });
      } catch(e) {
        this.vent.trigger('analytics', {
          key: 'application.error',
          body: {
            name: e.name,
            description: e.description
          }
        });
      }
    }

    function syncPlaylist() {
      var promiseOnSyncEvent = $.Deferred();
      PlaylistCollection.once('sync', function() {
        promiseOnSyncEvent.resolve();
      });
      return promiseOnSyncEvent;
    }

    function loadLocaleResources() {
      var lang = navigator.language || navigator.userLanguage;
      return i18nService.load(lang);
    }

    Application.on('initialize:after', function(options) {
      $.when(syncPlaylist(), loadLocaleResources())
        .done(_.bind(startApp, this));
    });

    return Application;
  }
);