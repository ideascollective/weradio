define(
  [
    'jquery',
    'marionette',
    'tooltipster',
    '../../../../config'
  ],
  function($, Marionette, tooltipster, Config) {
    'use strict';

    var TopBarView = Marionette.ItemView.extend({
      tagName: 'header',

      className: 'pure-g-r',

      template: 'topbar.hbs',

      events: {
        'click .js-create-list' : 'onCreatePlaylistClick'
      },

      initialize: function(options) {
        this.id = options.id;
      },

      onShow: function() {
        var shareBtn = this.$el.find('.js-share-btn');
        var url = Config.baseUrl + '#playlist/' + this.id;
        var encodedUrl = encodeURIComponent(url);
        var twitterUrl = 'http://twitter.com/share?text=Join my playlist at WeRadio!&url=http://'+ encodedUrl +'&hashtags=#WeRadio';
        var innerHTML =
          '<a href="' + twitterUrl + '" target="_blank"><i class="fa fa-twitter">&nbsp;Share on Twitter&nbsp;</i></a><input type="text" value="' + url + '"></input>';
        shareBtn.tooltipster({
          content: $(innerHTML),
          touchDevices: true,
          trigger: 'click',
          position: 'left',
          interactive: true,
          theme: 'tooltipster-light'
        });
      },

      onCreatePlaylistClick: function(e) {
        e.preventDefault();
        this.trigger('playlist:create-list');
      }

    });

    return TopBarView;
  }
);
