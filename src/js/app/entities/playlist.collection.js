define(
  [
    'backfire',
    'app/entities/playlist.model',
    'app/config'
  ],
  function(Backfire, PlaylistModel, Config) {
    'use strict';

    var PlaylistCollection = Backfire.Collection.extend({

      firebase: Config.get('firebaseDataURL'),

      model: PlaylistModel

    });

    return new PlaylistCollection();

  }
);