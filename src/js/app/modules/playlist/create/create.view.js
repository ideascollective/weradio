define(
  [
    'marionette',
    'jquery',
    'tagmanager'
  ],
  function(Marionette, $, TagManager) {
    'use strict';

    var CreatePlaylistView = Marionette.ItemView.extend({
      tagName: 'main',
      template: 'create.hbs',

      events: {
        'click .js-create-playlist': 'onClickCreatePlaylist',
        'click .add-tag': 'onClickAddTag'
      },

      onClickCreatePlaylist: function(e) {
        e.preventDefault();
        e.stopPropagation();

        this.trigger('playlist:create', {
          name: this.$el.find('input[name="playlist-name"]').val(),
          description: this.$el.find('textarea[name="playlist-description"]').val(),
          tags: this.$el.find('.tags-input').tagsManager('tags'),
          songs: null
        });
      },

      onClickAddTag: function(e) {
        var input = this.$el.find('.tags-input'),
            tag = input.val();

        e.preventDefault();
        input.tagsManager('pushTag', tag);
      },

      onShow: function(e) {
        this.$el.find('.tags-input').tagsManager({
          tagsContainer: '.tags-container'
        });
      }

    });

    return CreatePlaylistView;
  }
);
