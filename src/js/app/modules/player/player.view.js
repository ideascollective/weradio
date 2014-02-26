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

      autoplay: true,

      getNextSongIndex: function() {
        this.current += 1;
        return (this.current <= this.songsCollection.length) ? this.current : this.resetSongsIndex();
      },

      getPrevSongIndex: function() {
        this.current -= 1;
        return (this.current >= 0) ? this.current : this.resetSongsIndex();
      },

      resetSongsIndex: function() {
        this.current = -1;
        return this.current;
      },

      initialize: function(options) {
        this.songsCollection = options.songs;
        this.resetSongsIndex();
      },

      onShow: function() {
        this.playNextSong();
      },

      playSongByIndex: function(index) {
        var song = this.songsCollection.at(index);
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
          if (this.autoplay) {
            this.player.play();
          }
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
        this.playSongByIndex(this.getNextSongIndex());
      },

      playPrevSong: function() {
        this.playSongByIndex(this.getPrevSongIndex());
      }

    });

    return PlayerView;
  }
);

