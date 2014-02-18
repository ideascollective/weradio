define(
  [
    'marionette'
  ],
  function(Marionette) {
    'use strict';

    var AddSongView = Marionette.Layout.extend({

      template: 'addsong.hbs',
      className: 'modal-box',

      events: {
        'click .js-add-song-playlist': 'addSongHandler',
        'click .js-cancel': 'onCancelClick',
        'submit form': 'addSongHandler'
      },

      addSongHandler: function(e) {
        e.preventDefault();

        var data = {
          url: this.$el.find('input[name="playlist-name"]').val()
        };

        this.trigger('playlist:addsong', data);
      },

      onCancelClick: function(e) {
        e.preventDefault();
        this.trigger('playlist:cancelsong');
      }
    });

    return AddSongView;
  }
);
