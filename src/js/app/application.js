define(
  [
    'underscore',
    'backbone',
    'marionette',
    './router',
    'playlistcollection',
    'templateregistry'
  ],
  function(_, Backbone, Marionette, Router, PlaylistCollection, JST) {
    'use strict';

    var Application = new Marionette.Application();

    Application.on('initialize:before', function(options) {
      Marionette.Renderer.render = function(template, data){
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

    Application.on('initialize:after', function(options) {
      PlaylistCollection.once('sync', _.bind(function() {
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
      }, this));
    });

    return Application;
  }
);