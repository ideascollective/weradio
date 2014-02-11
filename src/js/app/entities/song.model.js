define(
  [
    'backbone'
  ],
  function(Backbone) {
    'use strict';

    var SongModel = Backbone.Model.extend({
      defaults: {
        url: '',
        title: 'Unknown',
        author: 'Unknown'
      }
    });

    return SongModel;
  }
);