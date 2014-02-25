define(
  [
    'marionette',
    './show.view',
    'playlistcollection',
    './topbar/topbar.view',
    '../../player/player.controller',
    './songlist/songlist.view',
    '../../../entities/song.collection',
    './notfound/notfound.view'
  ],
  function(Marionette, ShowPlaylistView, PlaylistCollection, TopBarView,
      Player, SongListView, SongCollection, PlaylistNotFoundView) {
    'use strict';

    var PlaylistController = Marionette.Controller.extend({

      initialize: function(options) {
        this.router = options.router;
      },

      showAddSong: function() {
        this.router.navigate('playlist/' + this.playlist.id + '/addsong', {
          trigger: true
        });
      },

      showCreateList: function() {
        this.router.navigate('playlist/create', {
          trigger: true
        });
      },

      showHome: function() {
        this.router.navigate('/', {
          trigger: true
        });
      },

      show: function(options) {
        this.playlist = PlaylistCollection.get(options.playlistId);

        if (!this.playlist) {
          this.showPlaylistNotFound(options.playlistId);
        } else {
          this.showPlaylist();
        }
      },

      showPlaylist: function() {
        var songs = new SongCollection(null, {
          id : this.playlist.id
        });

        this.showView = new ShowPlaylistView();
        var topBarView = new TopBarView({
          id : this.playlist.id
        });

        this.listenTo(topBarView, 'playlist:create-list', this.showCreateList);
        this.listenTo(topBarView, 'playlist:addsong', this.showAddSong);

        this.player = new Player();

        this.songList = new SongListView({
          collection: songs,
          model: this.playlist
        });

        this.listenTo(this.songList, 'playlist:addsong', this.showAddSong);

        App.mainRegion.show(this.showView);

        this.showView.topbarRegion.show(topBarView);

        this.player.show({
          region: this.showView.playerRegion,
          songs: songs
        });

        this.showView.songListRegion.show(this.songList);

        App.vent.trigger('analytics', {
          key: 'playlist.show',
          body: {
            playlistId: this.playlist.id
          }
        });
      },

      showPlaylistNotFound: function(playlistId) {
        var playlistNotFoundView = new PlaylistNotFoundView();

        this.listenTo(playlistNotFoundView, 'playlist:create-list', this.showCreateList);
        this.listenTo(playlistNotFoundView, 'home', this.showHome);

        App.mainRegion.show(playlistNotFoundView);

        App.vent.trigger('analytics', {
          key: 'playlist.notfound',
          body: {
            playlistId: playlistId
          }
        });
      }
    });

    return PlaylistController;
  }
);
