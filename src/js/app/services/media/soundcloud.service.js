define(
  [
    'jquery'
  ],
  function($) {
    'use strict';

    return {

      /**
       * Fetches video data from soundcloud
       * @param  {Object} data Object with two properties <pre>url</pre> and
       *                       <pre>id</pre>
       * @return {Object}      Promise
       */
      getVideoData: function(data) {
        return $.getJSON('http://soundcloud.com/oembed?format=json&url=' + data.url)
          .pipe(function(result) {

            data.videoId = data.id;
            data.title = result.title;
            data.thumbnail = result.thumbnail_url;

            return data;
          });
      }

    };
  }
);