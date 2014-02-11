define(
  [
    'marionette',
    './landing.view',
    'skrollr'
  ],
  function(Marionette, LandingView, Skrollr) {
    'use strict';

    var LandingController = Marionette.Controller.extend({

      initialize: function(options){
        this.router = options.router;
      },

      show: function() {
        this.landingView = new LandingView();
        this.listenTo(this.landingView, 'playlist:create', this.showCreatePlaylist);
        this.listenTo(this.landingView, 'close', this.close);
        this.renderLanding();
      },

      renderLanding: function(model, options) {
        App.mainRegion.show(this.landingView);
        var slide = Skrollr.init();
      },

      showCreatePlaylist: function() {
        this.router.navigate('playlist/create', {
          trigger: true
        });
      }

    });

    return LandingController;
  }
);
