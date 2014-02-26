define(
  [
    'jquery',
    'backbone',
    'marionette'
  ],
  function($, Backbone, Marionette) {
    'use strict';

    // TODO: Convert into helper
    var YouTubeWrapper = {
      YT: false,
      loadAPI: function(callback, context) {
        var onYouTubeIframeAPIReady = _.bind(function() {
          this.YT = window.YT;
          if (callback) {
            callback.apply(context, this.YT);
          }
        }, this);

        if ((typeof YT === 'undefined') || (typeof YT.Player === 'undefined')) {
          window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
          var tag = document.createElement('script');
          tag.src = "https://www.youtube.com/iframe_api";
          var firstScriptTag = document.getElementsByTagName('script')[0];
          firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        } else {
          onYouTubeIframeAPIReady();
        }
      },
      createPlayer: function(elem, options) {
        return new this.YT.Player(elem, options);
      },
      getVideoId: function(url) {
        var videoId = ("" + url).match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
        return videoId && videoId[1];
      }
    };

    // TODO: Convert into helper and possibly unify with YouTubeWrapper
    var PlayerSongCollection = Backbone.Collection.extend({

      current: -1,

      start: 0,

      playing: false,

      next: function() {
        this.current += 1;
        // TODO: set current to the right model in the collection
        var song = this.at(this.current);
        return (song) ? song : this.resetCount();
      },

      prev: function() {
        this.current -= 1;
        // TODO: set current to the right model in the collection
        var song = this.at(this.current);
        return (song) ? song : this.resetCount();
      },

      resetCount: function() {
        this.current = -1;
      }
    });


    var PlayerView = Marionette.ItemView.extend({

      template: 'player.hbs',

      events: {
        'click .js-player-playpauseVideo': 'handlePlayPauseClick',
        'click .js-player-mute': 'handleMuteClick',
        'click .js-player-next': 'playNextSong',
        'click .js-player-prev': 'playPrevSong',
        'change .js-player-volume': 'handleVolumeChange',
        'input .js-player-volume': 'handleVolumeChange',
        'click .js-player-toggleVideo': 'handleToggleVideo'
      },

      initialize: function(options) {
        this.model = new Backbone.Model({
          playerId: _.uniqueId('player-')
        });
        this.songs = options.songs;
      },

      onShow: function() {
        _.bindAll(this, 'onLoadedAPI', 'onPlayerReady', 'onPlayerStateChange');

        YouTubeWrapper.loadAPI(this.onLoadedAPI);
      },

      onLoadedAPI: function(YT) {
        this.player = YouTubeWrapper.createPlayer(this.model.get('playerId'), {
          events: {
            'onReady': this.onPlayerReady,
            'onStateChange': this.onPlayerStateChange
          },
          playerVars: {
            controls: '0'
          }
        });
      },

      updateSongs: function(newModel) {
        this.playerSongCollection.add(newModel.toJSON());
      },

      onPlayerReady: function(evt) {
        this.listenTo(this.songs, 'add', this.updateSongs);

        var list =
          this.songs
            .filter(function(song) { return !!song.get('url'); })
            .map(function(song) { return song.toJSON(); });
        this.playerSongCollection = new PlayerSongCollection(list);

        this.playNextSong();
        this.togglePlayButtonState();
      },

      onPlayerStateChange: function(evt) {
        if (evt.data === YouTubeWrapper.YT.PlayerState.ENDED) {
          this.playNextSong();
        }
      },

      _playAnotherSong: function(backward) {
        var direction = (!backward) ? 'next' : 'prev';
        var song = this.playerSongCollection[direction]();
        if (song) {
          this.player.loadVideoById({
            videoId: YouTubeWrapper.getVideoId(song.get('url')),
            startSeconds: 0
          });
          if (this.playerSongCollection.playing) {
            this.player.playVideo();
          }
        } else {
          this.player.stopVideo();
        }
      },

      playNextSong: function() {
        this._playAnotherSong.call(this);
      },

      playPrevSong: function() {
        this._playAnotherSong.call(this, true);
      },

      handleMuteClick: function(evt) {
        var action = (this.player.isMuted()) ? 'unMute' : 'mute';
        this.player[action]();
      },

      handlePlayPauseClick: function(evt) {
        var action = (this.player.getPlayerState() === YouTubeWrapper.YT.PlayerState.PLAYING) ? 'pauseVideo' : 'playVideo';

        this.player[action]();
        this.togglePlayButtonState();

        this.playerSongCollection.playing = true;
      },

      togglePlayButtonState: function() {
        var buttonIcon = this.$el.find('.js-player-playpauseVideo > i'),
            playing = (this.player.getPlayerState() === YouTubeWrapper.YT.PlayerState.PLAYING);
        if (buttonIcon.hasClass('fa-play') && !playing) {
          buttonIcon.removeClass('fa-play').addClass('fa-pause');
        } else {
          buttonIcon.removeClass('fa-pause').addClass('fa-play');
        }
      },

      handleVolumeChange: function(evt) {
        var value = $(evt.target).val();
        this.player.setVolume(value);
      },

      handleToggleVideo: function() {
        $(this.player.getIframe()).toggle();
      }

    });

    return PlayerView;
  }
);

