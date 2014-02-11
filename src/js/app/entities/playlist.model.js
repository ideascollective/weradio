define(
  [
    'backfire',
    '../config'
  ],
  function(Backfire, Config) {
    'use strict';

    var PlaylistModel = Backfire.Model.extend({

      defaults: {
        name: '',
        description: '',
        tags: '',
        songs: null
      },

      initialize: function(options) {
        this.firebase = Config.firebaseDataURL + '/' + options.id;
      }

    });

    return PlaylistModel;
  }
);