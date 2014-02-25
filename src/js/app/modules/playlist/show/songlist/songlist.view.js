define(
  [
    'underscore',
    'jquery',
    'marionette',
    './song.view',
    './song.empty.view'
  ],
  function(_, $, Marionette, SongView, SongEmptyView) {
    'use strict';

    var SongListView = Marionette.CompositeView.extend({
      template: 'songlist.hbs',

      itemView: SongView,

      itemViewContainer: 'div',

      className: 'full-height',

      emptyView: SongEmptyView,

      events: {
        'click .js-add-song': 'onClickAddSong'
      },

      initialize: function() {
        _.bindAll(this, 'onKeyUp');
        $(document).keyup(this.onKeyUp);
      },

      onKeyUp: function(e) {
        if (e.which === 27) {
          $('.toggle-input').attr('checked', false);
        }
      },

      onClickAddSong: function(e) {
        e.preventDefault();
        this.trigger('playlist:addsong');
      },

      onClose: function() {
        $(document).unbind('keyup', this.onKeyUp);
      }

    });

    return SongListView;
  }
);
