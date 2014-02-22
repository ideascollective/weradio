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
        tags: null,
        songs: null
      },

      initialize: function(options) {
        this.firebase = Config.get('firebaseDataURL') + '/' + options.id;
      }

    });

    return PlaylistModel;
  }
);