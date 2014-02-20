define(
  [
    'marionette'
  ],
  function(Marionette) {
    'use strict';

    var AddSongView = Marionette.Layout.extend({

      template: 'addsong.hbs',
      className: 'modal-box',

      ui: {
        'input': 'input[name="playlist-name"]'
      },

      events: {
        'click .js-add-song-playlist': 'addSongHandler',
        'click .js-cancel': 'onCancelClick',
        'submit form': 'addSongHandler'
      },

      addSongHandler: function(e) {
        e.preventDefault();

        var data = {
          url: this.ui.input.val()
        };

        this.trigger('playlist:addsong', data);
      },

      onShow: function() {
        this.ui.input.focus();
      },

      onCancelClick: function(e) {
        e.preventDefault();
        this.trigger('playlist:cancelsong');
      }
    });

    return AddSongView;
  }
);
