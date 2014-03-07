define(
  [
    'jquery',
    'marionette',
    'tooltipster',
    '../../../../config',
    'templateregistry'
  ],
  function($, Marionette, tooltipster, Config, JST) {
    'use strict';

    var TopBarView = Marionette.ItemView.extend({
      tagName: 'header',

      className: 'pure-g-r',

      template: 'topbar.hbs',

      events: {
        'click .js-create-list' : 'onCreatePlaylistClick',
        'click .js-add-song' : 'onAddSongClick'
      },

      initialize: function(options) {
        this.id = options.id;
      },

      onShow: function() {
        var shareBtn = this.$el.find('.js-share-btn');
        var templateFunc = JST['share.hbs'];

        var context = {};
        context.shareUrl = 'http://' + Config.get('baseUrl') + '/#playlist/' + this.id;
        context.encodedShareUrl = encodeURI(context.shareUrl);

        shareBtn.tooltipster({
          content: $(templateFunc(context)),
          touchDevices: true,
          trigger: 'click',
          fixedWidth: 'auto',
          position: 'bottom',
          interactive: true,
          theme: 'tooltipster-light'
        });
      },

      onCreatePlaylistClick: function(e) {
        e.preventDefault();
        this.trigger('playlist:create-list');
      },

      onAddSongClick: function(e) {
        e.preventDefault();
        this.trigger('playlist:addsong');
      }

    });

    return TopBarView;
  }
);
