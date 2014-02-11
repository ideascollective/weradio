define(
  [
    'marionette'
  ],
  function(Marionette) {
    'use strict';

    var SongView = Marionette.ItemView.extend({
      tagName: 'li',
      template: 'song.hbs'
    });

    return SongView;
  }
);
