define(
  [
    'jquery',
    'underscore',
    'marionette',
    './addsong.view',
    'playlistcollection',
    '../../../services/media/youtube.service',
    '../../../services/media/vimeo.service',
    '../../../services/media/soundcloud.service'
  ],
  function($, _, Marionette, AddSongView, PlaylistCollection, YoutubeService,
    VimeoService, SoundCloudService) {
    'use strict';

    var AddSongController = Marionette.Controller.extend({

      initialize: function(options) {
        this.router = options.router;
      },

      show: function() {
        this.playlist = PlaylistCollection.get(this.options.playlistId);

        this.addSongView = new AddSongView();
        App.modalRegion.show(this.addSongView);

        this.listenTo(this.addSongView, 'playlist:add.youtube', this.playlistAddYoutubeVideo);
        this.listenTo(this.addSongView, 'playlist:add.vimeo', this.playlistAddVimeoVideo);
        this.listenTo(this.addSongView, 'playlist:add.soundcloud', this.playlistAddSoundCloudSong);
        this.listenTo(this.addSongView, 'playlist:cancelsong', this.cancelAddSong);
      },

      playlistAddYoutubeVideo: function(data) {
        App.vent.trigger('analytics', {
          key: 'song.add',
          body: data
        });

        YoutubeService
          .getVideoData(data)
          .then(_.bind(this.addSong, this));
      },

      playlistAddVimeoVideo: function(data) {
        App.vent.trigger('analytics', {
          key: 'song.add',
          body: data
        });

        VimeoService
          .getVideoData(data)
          .then(_.bind(this.addSong, this));
      },

      playlistAddSoundCloudSong: function(data) {
        App.vent.trigger('analytics', {
          key: 'song.add',
          body: data
        });

        SoundCloudService
          .getVideoData(data)
          .then(_.bind(this.addSong, this));
      },

      addSong: function(song) {
        var songInfo = _.pick(song, 'url', 'videoId', 'title', 'thumbnail');
        this.playlist.firebase.child('songs').push(songInfo);
        this.cancelAddSong();
      },

      cancelAddSong: function() {
        App.modalRegion.close();
        this.router.navigate('playlist/' + this.options.playlistId);
      }
    });

    return AddSongController;
  }
);
