define(
  [
    'marionette',
    '../../../services/i18n/i18n.service'
  ],
  function(Marionette, i18nService) {
    'use strict';

    var AddSongView = Marionette.Layout.extend({

      template: 'addsong.hbs',
      className: 'modal-box',

      ui: {
        'input': 'input[name="playlist-name"]',
        'loader': '.loader',
        'addBtn': '.js-add-song-playlist',
      },

      events: {
        'click .js-add-song-playlist': 'addSongHandler',
        'click .js-cancel': 'onCancelClick',
        'submit form': 'addSongHandler'
      },

      /**
       * Based upon
       * http://stackoverflow.com/questions/2964678/jquery-youtube-url-validation-with-regex/10315969#10315969
       */
      getYoutubeVideoId: function(url) {
        var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
        return (url.match(p)) ? RegExp.$1 : null;
      },

      /**
       * Based upon http://stackoverflow.com/questions/13286785/match-vimeo-video-id
       */
      getVimeoVideoId: function(url) {
        var p = /https?:\/\/(?:www\.)?vimeo.com\/(?:channels\/|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/;
        return (url.match(p)) ? RegExp.$3 : null;
      },

      addSongHandler: function(e) {
        e.preventDefault();
        var url = this.ui.input.val();
        var id = this.getYoutubeVideoId(url);

        this.ui.addBtn.addClass('pure-button-disabled');
        this.ui.loader.removeClass('invisible');

        if (id) {
          this.trigger('playlist:add.youtube', {
            url: url,
            id: id
          });
        } else {
          id = this.getVimeoVideoId(url);
          if (id) {
            this.trigger('playlist:add.vimeo', {
              url: url,
              id: id
            });
          } else {
            this.ui.input.val('');
            this.ui.input.attr('placeholder', i18nService.t('urlValid'));
            this.ui.addBtn.removeClass('pure-button-disabled');
            this.ui.loader.addClass('invisible');
          }
        }
      },

      onShow: function() {
        this.ui.input.focus();
      },

      onCancelClick: function(e) {
        e.preventDefault();
        this.trigger('playlist:cancelsong');
      }
    });

    return AddSongView;
  }
);
