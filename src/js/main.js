require.config({
  paths: {
    'backbone' : '../vendor/backbone/backbone',
    'marionette': '../vendor/marionette/lib/core/amd/backbone.marionette',
    'backbone.wreqr' : '../vendor/backbone.wreqr/lib/amd/backbone.wreqr',
    'backbone.eventbinder' : '../vendor/backbone.eventbinder',
    'backbone.babysitter' : '../vendor/backbone.babysitter/lib/amd/backbone.babysitter',
    'jquery' : '../vendor/jquery/jquery',
    'underscore' : '../vendor/lodash/dist/lodash',
    'modernizr' : '../vendor/modernizr/modernizr',
    'templateregistry' : 'app/templates',
    'handlebars' : '../vendor/handlebars/handlebars',
    'firebase' : '../vendor/firebase/firebase',
    'backfire' : '../vendor/backfire/backbone-firebase',
    'skrollr' : '../vendor/skrollr/src/skrollr',
    'tagmanager' : '../vendor/tagmanager/tagmanager',
    'playlistcollection' : 'app/entities/playlist.collection',
    'tooltipster' : '../vendor/tooltipster/js/jquery.tooltipster'
  },
  shim: {
    'backbone': {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },

    'modernizr': {
      exports: 'Modernizr'
    },

    'handlebars': {
      exports: 'Handlebars'
    },

    'firebase': {
      exports: 'Firebase'
    },

    'backfire': {
      deps: ['backbone', 'firebase'],
      exports: 'Backbone.Firebase'
    },
    'skrollr': {
      deps: ['jquery'],
      exports: 'skrollr'
    },
    'tagmanager': {
      deps: ['jquery'],
      exports: 'tagmanager'
    },
    'tooltipster': ['jquery']
  },
  waitSeconds: 30
});

require(
  [
    'app/application',
    'modernizr'
  ],
  function(Application) {
    'use strict';
    window.App = Application;

    Application.start();
  }
);
