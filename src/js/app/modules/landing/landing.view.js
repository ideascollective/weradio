define(
  [
    'backbone',
    'marionette'
  ],
  function(Backbone, Marionette) {
    'use strict';

    var LandingView = Marionette.ItemView.extend({
      tagName: 'main',

      template: 'landing.hbs',

      events: {
        'click .js-create-playlist': 'onCreatePlaylistClick'
      },

      onCreatePlaylistClick: function(e) {
        e.preventDefault();
        this.trigger('playlist:create');
      },
    });

    return LandingView;
  }
);
