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

      initialize: function(options) {
        this.firebase = new Firebase(Config.firebaseDataURL + '/' + options.id).child('songs');
      }

    });

    return SongCollection;

  }
);