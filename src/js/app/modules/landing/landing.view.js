define(
  [
    'jquery',
    'backbone',
    'marionette',
    'playlistcollection',
    'bloodhound',
    'typeahead'
  ],
  function($, Backbone, Marionette, PlaylistCollection, Bloodhound, typeahead) {
    'use strict';

    var LandingView = Marionette.ItemView.extend({
      tagName: 'main',

      template: 'landing.hbs',

      events: {
        'click .js-create-playlist': 'onCreatePlaylistClick'
      },

      onRender: function() {
        var playlists = new Bloodhound({
          datumTokenizer: function(d) {
            return Bloodhound.tokenizers.whitespace(d.name);
          },
          queryTokenizer: Bloodhound.tokenizers.whitespace,
          local: PlaylistCollection.toJSON()
        });

        playlists.initialize();

        this.$el.find('.js-autocomplete').typeahead(null, {
          displayKey: 'name',
          source: playlists.ttAdapter()
        });
      },

      onCreatePlaylistClick: function(e) {
        e.preventDefault();
        this.trigger('playlist:create');
      },

      onClose: function() {
        $('.js-autocomplete').typeahead('destroy');
      }
    });

    return LandingView;
  }
);
