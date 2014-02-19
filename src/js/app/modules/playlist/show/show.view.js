define(
  [
    'marionette'
  ],
  function(Marionette) {
    'use strict';

    var ShowView = Marionette.Layout.extend({
      template: 'show.hbs',

      regions: {
        songListRegion: '.song-list',
        playerRegion: '.main-player',
        discoverRegion: '.discover',
        topbarRegion: '.top-bar'
      },

      events: {
      }

    });

    return ShowView;
  }
);
