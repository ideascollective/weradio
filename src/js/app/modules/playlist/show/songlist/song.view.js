define(
  [
    'marionette'
  ],
  function(Marionette) {
    'use strict';

    var SongView = Marionette.ItemView.extend({
      template: 'song.hbs'
    });

    return SongView;
  }
);
