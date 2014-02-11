define(
  [
    'backbone',
    'marionette',
    './create.view',
    'playlistcollection'
  ],
  function(Backbone, Marionette, CreatePlaylistView, PlaylistCollection) {
    'use strict';

    var CreatePlaylistController = Marionette.Controller.extend({

      initialize: function(options) {
        this.router = options.router;
      },

      show: function() {
        this.create = new CreatePlaylistView();

        this.listenTo(this.create, 'close', this.close);
        this.listenTo(this.create, 'playlist:create', this.createPlaylist);

        this.renderPage();
      },

      renderPage: function(model, options) {
        App.mainRegion.show(this.create);
      },

      createPlaylist: function(model) {
        var newModel = PlaylistCollection.create(model);
        this.router.navigate('playlist/' + newModel.id, {
          trigger: true
        });
      }

    });

    return CreatePlaylistController;
  }
);
