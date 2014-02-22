define(
  [
    'backfire',
    './song.model',
    '../config'
  ],
  function(Backfire, SongModel, Config) {
    'use strict';

    var SongCollection = Backfire.Collection.extend({

      model: SongModel,

      initialize: function(models, options) {
        this.firebase = new Firebase(Config.get('firebaseDataURL') +
          '/' + options.id).child('songs');
      }

    });

    return SongCollection;

  }
);