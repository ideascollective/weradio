define(
  [
    'underscore',
    'marionette',
    'popcorn'
  ],
  function(_, Marionette, Popcorn) {
    'use strict';

    var PlayerView = Marionette.ItemView.extend({

      template: 'player.hbs',

      className: 'player-wrapper',

      id: _.uniqueId('player-'),

      autoplay: false,

      getNextSongIndex: function() {
        this.currentSong += 1;
        return (this.currentSong <= this.songsCollection.length) ? this.currentSong : this.resetSongsIndex();
      },

      getPrevSongIndex: function() {
        this.currentSong -= 1;
        return (this.currentSong >= 0) ? this.currentSong : this.resetSongsIndex();
      },

      resetSongsIndex: function() {
        this.currentSong = -1;
        return this.currentSong;
      },

      initialize: function(options) {
        this.songsCollection = options.songs;
        this.resetSongsIndex();
        _.bindAll(this, 'onEnded', 'onPlayerError', 'triggerEvent');
      },

      onShow: function() {
        this.playNextSong();
      },

      commandPlay: function() {
        if (this.playerInstance) {
          this.playerInstance.play();
        }
      },

      commandPause: function() {
        if (this.playerInstance) {
          this.playerInstance.pause();
        }
      },

      commandTogglePlay: function(play) {
        play = (typeof play !== 'undefined') ? !!play : this.playerInstance.paused();
        if (this.playerInstance) {
          if (play) {
            this.playerInstance.play();
          } else {
            this.playerInstance.pause();
          }
        }
      },

      commandMute: function() {
        if (this.playerInstance) {
          this.playerInstance.mute();
        }
      },

      commandUnMute: function() {
        if (this.playerInstance) {
          this.playerInstance.unmute();
        }
      },

      commandToggleMute: function(toMute) {
        toMute = (typeof toMute !== 'undefined') ? !!toMute : !this.playerInstance.muted();
        if (this.playerInstance) {
          if (toMute) {
            this.playerInstance.mute();
          } else {
            this.playerInstance.unmute();
          }
        }
      },

      commandVolumeChange: function(volumeLevel) {
        volumeLevel = +volumeLevel / 100;
        if (this.playerInstance && !isNaN(volumeLevel)) {
          this.playerInstance.volume(volumeLevel);
        }
      },

      requestVolume: function() {
        var result;
        if (this.playerInstance) {
          result = Math.round(this.playerInstance.volume() * 100);
        }
        return result;
      },

      requestIsPlaying: function() {
        var result;
        if (this.playerInstance) {
          result = !this.playerInstance.paused();
        }
        return result;
      },

      requestIsMuted: function() {
        var result;
        if (this.playerInstance) {
          result = this.playerInstance.muted();
        }
        return result;
      },

      requestPlaylistIndex: function() {
        var result;
        if (this.playerInstance) {
          result = this.currentSong;
        }
        return result;
      },

      requestPlaylistLength: function() {
        var result;
        if (this.playerInstance && this.songsCollection) {
          result = this.songsCollection.length;
        }
        return result;
      },

      playSongByIndex: function(index) {
        var song = this.songsCollection.at(index);
        if (this.playerInstance) {
          this._destroyPlayerInstance();
          this.autoplay = true;
        }
        if (song) {
          this.playerInstance = Popcorn.smart(
            '.player-wrapper',
            song.get('url')
          );
          this._bindPopcornPlayerEvents();
          this.playerInstance.load();
          if (this.autoplay) {
            this.playerInstance.play();
          }
        }
      },

      _destroyPlayerInstance: function() {
        this.playerInstance.off();
        this.stopListening(this.playerInstance);
        this.playerInstance.destroy();
        Popcorn.destroy(this.playerInstance);
        this.$el.html('');
        delete this.playerInstance;
      },

      _bindPopcornPlayerEvents: function() {
        this.listenTo(this.playerInstance, 'ended', this.onEnded);
        this.listenTo(this.playerInstance, 'error', this.onPlayerError);
        // Trigger player events as player:eventName
        _.chain(Popcorn.Events.Events.split(/\s+/g))
          .without('timeupdate', 'ended', 'error')
          .each(function (eventName, index, list) {
            this.listenTo(this.playerInstance, eventName, this.triggerEvent);
          }, this);
      },

      onEnded: function(evt) {
        // Play next song on ended
        this.triggerEvent(evt);
        this.playNextSong();
      },

      onPlayerError: function(evt) {
        // Play song in direction on error
        this.triggerEvent(evt);
        if (this.playingBackwards) {
          this.playPrevSong();
        } else {
          this.playNextSong();
        }
      },

      triggerEvent: function(evt) {
        // Augment event object
        if (_.isString(evt)) {
          evt = {type: evt};
        }
        evt = evt || {};
        evt.isMuted = this.playerInstance.muted();
        evt.volumeLevel = Math.round(this.playerInstance.volume() * 100);
        evt.isPlaying = !this.playerInstance.paused();
        evt.playlistIndex = this.currentSong;
        evt.playlistLength = this.songsCollection.length;
        this.trigger('player:' + evt.type, evt);
        this.trigger('player', evt.type, evt);
      },

      playNextSong: function() {
        this.playingBackwards = false;
        this.playSongByIndex(this.getNextSongIndex());
      },

      playPrevSong: function() {
        this.playingBackwards = true;
        this.playSongByIndex(this.getPrevSongIndex());
      },

      onClose: function() {
        this._destroyPlayerInstance();
      }

    });

    return PlayerView;
  }
);

