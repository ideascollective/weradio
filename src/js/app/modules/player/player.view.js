define(
  [
    'jquery',
    'backbone',
    'marionette',
    'popcorn'
  ],
  function($, Backbone, Marionette, Popcorn) {
    'use strict';

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
        'change .js-player-volume': 'handleVolumeClick',
        'input .js-player-volume': 'handleVolumeClick',
        'click .js-player-toggleVideo': 'handleToggleVideo'
      },

      initialize: function(options) {
        this.model = new Backbone.Model({
          playerId: _.uniqueId('player-')
        });
        this.songs = options.songs;

        this.listenTo(this.songs, 'add', this.handeAddSongEvent);

        // Listen to player events to update UI
        this.listenTo(this, 'player:playing', this.handlePlayingState);
        this.listenTo(this, 'player:pause', this.handlePauseState);
        this.listenTo(this, 'player:volumechange', this.handleVolumeChange);
      },

      onShow: function() {
        var list = this.songs
                    .filter(function(song) { return !!song.get('url'); })
                    .map(function(song) { return song.toJSON(); });
        this.playerSongCollection = new PlayerSongCollection(list);

        this.playNextSong();
      },

      handeAddSongEvent: function(newModel) {
        this.playerSongCollection.add(newModel.toJSON());
      },

      _playAnotherSong: function(backward) {
        var direction = (!backward) ? 'next' : 'prev';
        var song = this.playerSongCollection[direction]();
        if (this.player) {
          this.stopListening(this.player);
          this.player.destroy();
        }
        if (song) {
          this.player = Popcorn.smart(
            '.player-wrapper',
            song.get('url')
          );
          this._bindPopcornPlayerEvents();
          if (this.playerSongCollection.playing) {
            this.player.play();
          }
        } else {
          this.player.pause();
        }
      },

      _bindPopcornPlayerEvents: function() {
        // Add isPlaying state to the player
        this.listenTo(this.player, 'playing', function(evt) {
          this.isPlaying = true;
        });
        this.listenTo(this.player, 'pause', function(evt) {
          this.isPlaying = false;
        });
        this.listenTo(this.player, 'ended', _.bind(function(evt) {
          this.playNextSong();
        }, this));
        // Trigger all player events but timeupdate as player:eventName
        _.each(Popcorn.Events.Events.split(/\s+/g), function (eventName, index, list) {
          if (eventName !== 'timeupdate') {
            this.listenTo(this.player, eventName, _.bind(function(evt) {
              console.log(evt);
              this.trigger('player:' + evt.type, evt);
            }, this));
          }
        }, this);
      },

      playNextSong: function() {
        this._playAnotherSong.call(this);
      },

      playPrevSong: function() {
        this._playAnotherSong.call(this, true);
      },

      handlePlayPauseClick: function(evt) {
        var action = (this.player.isPlaying) ? 'pause' : 'play';
        this.player[action]();
      },

      handlePlayingState: function() {
        var buttonIcon = this.$el.find('.js-player-playpauseVideo > i');
        buttonIcon.removeClass('fa-play').addClass('fa-pause');
        this.playerSongCollection.playing = true;
      },

      handlePauseState: function() {
        var buttonIcon = this.$el.find('.js-player-playpauseVideo > i');
        buttonIcon.removeClass('fa-pause').addClass('fa-play');
      },

      handleVolumeClick: function(evt) {
        var value = +$(evt.target).val();
        if (value != this.player.volume()) {
          this.player.volume(value / 100);
        }
      },

      handleMuteClick: function(evt) {
        var action = (this.player.muted()) ? 'unmute' : 'mute';
        this.player[action]();
      },

      handleVolumeChange: function() {
        var isMuted = this.player.muted();

        this.$el.find('.js-player-mute > i')
          .toggleClass('fa-volume-off', isMuted)
          .toggleClass('fa-volume-up', !isMuted);

        this.$el.find('.js-player-volume')
          .val(this.player.volume() * 100);
      },

      handleToggleVideo: function() {
        $(this.player.getIframe()).toggle();
      }

    });

    return PlayerView;
  }
);

