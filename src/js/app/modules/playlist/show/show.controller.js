define(
  [
    'marionette',
    './show.view',
    'playlistcollection',
    './topbar/topbar.view',
    '../../player/player.controller',
    './songlist/songlist.view',
    '../../../entities/song.collection'
  ],
  function(Marionette, ShowPlaylistView, PlaylistCollection, TopBarView,
      Player, SongListView, SongCollection) {
    'use strict';

    var PlaylistController = Marionette.Controller.extend({

      initialize: function(options) {
        this.router = options.router;
      },

      show: function(options) {
        this.playlist = PlaylistCollection.get(options.playlistId);
        var songs = new SongCollection({
          id : this.playlist.id
        });

        this.showView = new ShowPlaylistView();
        var topBarView = new TopBarView({
          id : this.playlist.id
        });

        this.listenTo(topBarView, 'playlist:create-list', function() {
          this.router.navigate('playlist/create', {
            trigger: true
          });
        });

        this.player = new Player();

        this.songList = new SongListView({
          collection: songs,
          model: this.playlist
        });

        this.listenTo(this.songList, 'playlist:addsong', function() {
          this.router.navigate('playlist/' + this.playlist.id + '/addsong', {
            trigger: true
          });
        });

        App.mainRegion.show(this.showView);

        this.showView.topbarRegion.show(topBarView);

        this.player.show({
          region: this.showView.playerRegion,
          songs: songs
        });

        this.showView.songListRegion.show(this.songList);

      }
    });

    return PlaylistController;
  }
);
