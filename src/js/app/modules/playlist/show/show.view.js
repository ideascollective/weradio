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
      },

      animateRegions: function() {
        var animDuration = 500;
        $('.playlist-loading').fadeOut();
        for (var region in this.regions) {
          if (this.hasOwnProperty(region)) {
            $(this.regions[region])
              .fadeIn(animDuration);
            animDuration = animDuration * 1.5;
          }
        }
      }

    });

    return ShowView;
  }
);
