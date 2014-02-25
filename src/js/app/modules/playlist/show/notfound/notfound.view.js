define(
  [
    'marionette'
  ],
  function(Marionette) {
    'use strict';

    var PlaylistNotFoundView = Marionette.ItemView.extend({

      template: 'notfound.hbs',

      triggers: {
        'click .js-create-playlist': 'playlist:create-list',
        'click .js-home': 'home'
      }

    });

    return PlaylistNotFoundView;
  }
);