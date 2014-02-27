define(
  [
    'backbone',
    'marionette',
    './controls.view',
    './player.view'
  ],
  function(Backbone, Marionette, ControlsView, PlayerView) {
    'use strict';

    var PlaylistController = Marionette.Controller.extend({

      show: function(options) {
        // Create a global EventAggregator for the player
        App.player = App.player || {};
        App.player.events = new Backbone.Wreqr.EventAggregator();
        App.player.info = new Backbone.Wreqr.RequestResponse();
        App.player.commands = new Backbone.Wreqr.Commands();

        this.playerView = new PlayerView({
          songs: options.songs
        });

        this.controlsView = new ControlsView({
          songs: options.songs
        });

        this.region = options.region;
        this.region.show(this.controlsView);

        this.controlsView.playerContainerRegion.show(this.playerView);
      }

    });

    return PlaylistController;
  }
);
