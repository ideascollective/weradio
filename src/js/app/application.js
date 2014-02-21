define(
  [
    'backbone',
    'marionette',
    './router',
    'playlistcollection',
    'templateregistry'
  ],
  function(Backbone, Marionette, Router, PlaylistCollection, JST) {
    'use strict';

    var Application = new Marionette.Application();

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
      PlaylistCollection.once('sync', function() {
        new Router();
        Backbone.history.start();

        mixpanel.track('Application successfully synched and started');
      });
    });

    Application.on('initialize:before', function(options) {
      Marionette.Renderer.render = function(template, data){
        if (!JST[template]) {
          throw "Template '" + template + "' not found!";
        }
        return JST[template](data);
      };
    });

    return Application;
  }
);