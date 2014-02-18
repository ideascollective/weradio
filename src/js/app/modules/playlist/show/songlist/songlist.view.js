define(
  [
    'marionette',
    './song.view',
    './song.empty.view'
  ],
  function(Marionette, SongView, SongEmptyView) {
    'use strict';

    var SongListView = Marionette.CompositeView.extend({
      template: "songlist.hbs",
      itemView: SongView,
      itemViewContainer: "div",
      className: 'full-height',
      emptyView: SongEmptyView,

      events: {
        'click .js-add-song': 'onClickAddSong'
      },

      onClickAddSong: function(e) {
        e.preventDefault();
        this.trigger('playlist:addsong');
      }

    });

    return SongListView;
  }
);
