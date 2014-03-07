define(
  [
    'underscore',
    'backbone',
    'marionette',
    './controls.view',
    './player.view'
  ],
  function(_, Backbone, Marionette, ControlsView, PlayerView) {
    'use strict';

    var PlaylistController = Marionette.Controller.extend({

      show: function(options) {
        this.playerView = new PlayerView({
          songs: options.songs
        });

        this.controlsView = new ControlsView({
          songs: options.songs
        });

        this.initializeListener();

        this.region = options.region;
        this.region.show(this.controlsView);

        this.controlsView.playerContainerRegion.show(this.playerView);
      },

      initializeListener: function() {
        this.listenTo(this.controlsView, 'player', this.controlsViewEventsHandler);

        this.listenTo(this.playerView, 'player', this.playerViewEventsHandler);
        this.listenTo(this.playerView, 'player:seeked player:error', this.controlsView.onPlayerInitialize);
        this.listenTo(this.playerView, 'player:playing', this.controlsView.onPlayingState);
        this.listenTo(this.playerView, 'player:pause', this.controlsView.onPlayingState);
        this.listenTo(this.playerView, 'player:volumechange', this.controlsView.onVolumeChange);

        App.commands.setHandler('player:pause', this.playerView.commandPause, this.playerView);
        App.commands.setHandler('player:play', this.playerView.commandPlay, this.playerView);
        App.commands.setHandler('player:playpause', this.playerView.commandTogglePlay, this.playerView);
        App.commands.setHandler('player:unmute', this.playerView.commandUnMute, this.playerView);
        App.commands.setHandler('player:mute', this.playerView.commandMute, this.playerView);
        App.commands.setHandler('player:toggleMute', this.playerView.commandToggleMute, this.playerView);
        App.commands.setHandler('player:volume', this.playerView.commandVolumeChange, this.playerView);
        App.commands.setHandler('player:next', this.playerView.playNextSong, this.playerView);
        App.commands.setHandler('player:prev', this.playerView.playPrevSong, this.playerView);

        App.reqres.setHandler('player:volume', this.playerView.requestVolume, this.playerView);
        App.reqres.setHandler('player:isPlaying', this.playerView.requestIsPlaying, this.playerView);
        App.reqres.setHandler('player:isMuted', this.playerView.requestIsMuted, this.playerView);
        App.reqres.setHandler('player:playlistIndex', this.playerView.playlist, this.playerView);
        App.reqres.setHandler('player:playlistLength', this.playerView.requestPlaylistLength, this.playerView);
      },

      playerViewEventsHandler: function(eventType, evt) {
        App.vent.trigger('player:' + eventType, evt);
      },

      controlsViewEventsHandler: function(command, value) {
        if ((command === 'volumen') && (value === App.reqres.request('player:volume'))) {
          return;
        }
        App.commands.execute('player:' + command, value);
      }

    });

    return PlaylistController;
  }
);
