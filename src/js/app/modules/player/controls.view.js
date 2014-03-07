define(
  [
    'underscore',
    'jquery',
    'backbone',
    'marionette'
  ],
  function(_, $, Backbone, Marionette) {
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
        _.bindAll(this, 'onPlayerInitialize', 'onPlayingState', 'onVolumeChange');
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
        this.trigger('player', 'playpause');
      },

      handleVolumeClick: function(evt) {
        var value = +$(evt.target).val();
        this.trigger('player', 'volume', value);
      },

      handleMuteClick: function(evt) {
        this.trigger('player', 'toggleMute');
      },

      handelNextClick: function(evt) {
        this.trigger('player', 'next');
      },

      handelPrevClick: function(evt) {
        this.trigger('player', 'prev');
      }

    });

    return PlayerControlsLayout;
  }
);

