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

    var KEY_ENTER = 13;
    var KEY_ESCAPE = 27;

    var LandingView = Marionette.ItemView.extend({
      tagName: 'main',

      template: 'landing.hbs',

      events: {
        'click .js-create-playlist': 'onCreatePlaylistClick',
        'keydown #js-autocomplete': 'onAutocompleteKeyDown',
        'click .js-search-playlist': 'onSearchPlaylistClick'
      },

      onRender: function() {
        var playlistNames = new Bloodhound({
          datumTokenizer: function(d) {
            return Bloodhound.tokenizers.whitespace(d.name);
          },

          queryTokenizer: Bloodhound.tokenizers.whitespace,

          local: PlaylistCollection.toJSON()
        });
        playlistNames.initialize();

        this.autocomplete = this.$el.find('#js-autocomplete');
        this.autocomplete.typeahead(
          {
            minLength: 3,
            highlight: true
          },
          {
            name: 'name',
            displayKey: 'name',
            source: playlistNames.ttAdapter()
          }
        );
      },

      onCreatePlaylistClick: function(e) {
        e.preventDefault();
        this.trigger('playlist:create');
      },

      onAutocompleteKeyDown: function(e) {
        if (e.which === KEY_ENTER) {
          this.handleSearchPlaylist(e);
        }
        if (e.which === KEY_ESCAPE) {
          e.preventDefault();
          this.autocomplete.typeahead('val', '');
        }
      },

      onSearchPlaylistClick: function(e) {
        this.handleSearchPlaylist(e);
      },

      handleSearchPlaylist: function(e) {
        e.preventDefault();

        var playlist = PlaylistCollection.findWhere({
          name: this.autocomplete.typeahead('val')
        });

        if (playlist) {
          this.trigger('playlist:show', {
            id: playlist.id
          });
        }
      },

      onClose: function() {
        this.autocomplete.typeahead('destroy');
      }
    });

    return LandingView;
  }
);
