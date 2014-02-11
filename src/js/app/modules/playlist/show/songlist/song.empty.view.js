define(
  [
    'marionette'
  ],
  function(Marionette) {
    'use strict';

    var SongEmptyView = Marionette.ItemView.extend({
      template: 'song.empty.hbs'
    });

    return SongEmptyView;
  }
);
