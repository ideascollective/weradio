define(
  [
    'marionette',
    './player.view'
  ],
  function(Marionette, PlayerView) {
    'use strict';

    var PlaylistController = Marionette.Controller.extend({

      show: function(options) {
        this.playerView = new PlayerView({
          songs: options.songs
        });
        this.region = options.region;
        this.region.show(this.playerView);
      }

    });

    return PlaylistController;
  }
);
