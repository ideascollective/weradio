define(
  [
    'jquery',
    'backbone',
    './modules/playlist/create/create.controller',
    './modules/playlist/show/show.controller',
    './modules/landing/landing.controller',
    './modules/playlist/addsong/addsong.controller'
  ],
  function($, Backbone, CreatePlaylistController, ShowPlaylistController, LandingController, AddSongController) {

    var Router = Backbone.Router.extend({

      routes: {
        'playlist/create': 'createPlaylist',
        'playlist/:id': 'showPlaylist',
        'playlist/:id/addsong': 'playlistAddSong',
        '*path': 'handleDefaultRoute'
      },

      handleDefaultRoute: function(path) {
        var landingController = new LandingController({
          router: this
        });
        landingController.show();
      },

      createPlaylist: function() {
        var createController = new CreatePlaylistController({
          router: this
        });
        createController.show();
      },

      showPlaylist: function(id) {
        var showPlaylistController = new ShowPlaylistController({
          router: this
        });
        showPlaylistController.show({
          playlistId: id
        });
      },

      playlistAddSong: function(id) {
        var addSongController = new AddSongController({
          playlistId: id,
          router: this
        });
        addSongController.show();
      }
    });

    return Router;
});
