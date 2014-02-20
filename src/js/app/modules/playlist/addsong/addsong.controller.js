define(
  [
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    '../../../config',
    './addsong.view',
    'playlistcollection'
  ],
  function($, _, Backbone, Marionette, Config, AddSongView, PlaylistCollection) {
    'use strict';

    var AddSongController = Marionette.Controller.extend({

      initialize: function(options) {
        this.router = options.router;
      },

      show: function() {
        this.playlist = PlaylistCollection.get(this.options.playlistId);

        this.addSongView = new AddSongView();
        App.modalRegion.show(this.addSongView);

        this.listenTo(this.addSongView, 'close', this.close);
        this.listenTo(this.addSongView, 'playlist:addsong', this.playlistAddSong);
        this.listenTo(this.addSongView, 'playlist:cancelsong', this.cancelAddSong);
      },

      playlistAddSong: function(data) {
                // TODO: use from YouTube Wrapper
        function getVideoId(url) {
          var videoId = ("" + url).match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
          return videoId && videoId[1];
        }
        var options = {
            'id': getVideoId(data.url),
            'key': Config.get('youTubeAPIKey')
          };
        $.getJSON('https://www.googleapis.com/youtube/v3/videos?part=snippet', options)
          .done(function(result) {
            var videoInfo = (result && result.items[0]) || {};
            data.videoId = videoInfo.id || null;
            data.title = (videoInfo.snippet && videoInfo.snippet.title) || null;
            data.thumbnail = (videoInfo.snippet && videoInfo.snippet.thumbnails &&
                              videoInfo.snippet.thumbnails['default'] &&
                              videoInfo.snippet.thumbnails['default'].url) || null;
          }).always(_.bind(function () {
            var songInfo = _.pick(data, 'url', 'videoId', 'title', 'thumbnail');
            this.playlist.firebase.child('songs').push(songInfo);
            this.cancelAddSong();
          }, this));
      },

      cancelAddSong: function() {
        App.modalRegion.close();
        this.router.navigate('playlist/' + this.options.playlistId);
      }
    });

    return AddSongController;
  }
);
