define(
  [
    'marionette',
    './landing.view'
  ],
  function(Marionette, LandingView) {
    'use strict';

    var LandingController = Marionette.Controller.extend({

      initialize: function(options){
        this.router = options.router;
      },

      show: function() {
        this.landingView = new LandingView();
        this.listenTo(this.landingView, 'playlist:create', this.showCreatePlaylist);
        this.listenTo(this.landingView, 'playlist:show', this.showPlaylist);
        this.listenTo(this.landingView, 'close', this.close);
        this.renderLanding();
      },

      renderLanding: function(model, options) {
        App.mainRegion.show(this.landingView);
      },

      showCreatePlaylist: function() {
        this.router.navigate('playlist/create', {
          trigger: true
        });
      },

      showPlaylist: function(playlist) {
        this.router.navigate('playlist/' + playlist.id, {
          trigger: true
        });
      }

    });

    return LandingController;
  }
);
