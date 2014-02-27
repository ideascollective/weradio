define(
  [
    'jquery',
    'backbone',
    'marionette'
  ],
  function($, Backbone, Marionette) {
    'use strict';

    var PlayerControlsLayout = Marionette.Layout.extend({

      template: 'controls.hbs',

      events: {
        'click .js-player-playpauseVideo': 'handlePlayPauseClick',
        'click .js-player-mute': 'handleMuteClick',
        'click .js-player-next': 'handelNextClick',
        'click .js-player-prev': 'handelPrevClick',
        'change .js-player-volume': 'handleVolumeClick',
        'input .js-player-volume': 'handleVolumeClick',
        'click .js-player-toggleVideo': 'handleToggleVideo'
      },

      regions: {
        'playerContainerRegion': '.player-container'
      },

      initialize: function(options) {
        // Listen to player events to update UI
        this.listenTo(App.player.events, 'player:seeked player:error', this.onPlayerInitialize);
        this.listenTo(App.player.events, 'player:playing', this.onPlayingState);
        this.listenTo(App.player.events, 'player:pause', this.onPlayingState);
        this.listenTo(App.player.events, 'player:volumechange', this.onVolumeChange);
      },

      onPlayerInitialize: function(evt) {
        this.onPlayingState(evt);
        this.onVolumeChange(evt);
      },

      onPlayingState: function(evt) {
        var buttonIcon = this.$el.find('.js-player-playpauseVideo > i');
        if (evt.isPlaying) {
          buttonIcon.removeClass('fa-play').addClass('fa-pause');
        } else {
          buttonIcon.removeClass('fa-pause').addClass('fa-play');
        }
      },

      onVolumeChange: function(evt) {
        var isMuted = evt.isMuted;

        this.$el.find('.js-player-mute > i')
          .toggleClass('fa-volume-off', isMuted)
          .toggleClass('fa-volume-up', !isMuted);

        this.$el.find('.js-player-volume').val(evt.volumeLevel);
      },

      handlePlayPauseClick: function(evt) {
        App.player.commands.execute('playpause');
      },

      handleVolumeClick: function(evt) {
        var value = +$(evt.target).val();
        if (value !== App.player.info.request('volume')) {
          App.player.commands.execute('volume', value);
        }
      },

      handleMuteClick: function(evt) {
        App.player.commands.execute('toggleMute');
      },

      handelNextClick: function(evt) {
        App.player.commands.execute('next');
      },

      handelPrevClick: function(evt) {
        App.player.commands.execute('prev');
      }

    });

    return PlayerControlsLayout;
  }
);

