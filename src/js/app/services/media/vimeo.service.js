define(
  [
    'jquery'
  ],
  function($) {
    'use strict';

    return {

      /**
       * Fetches video data from youtube
       * @param  {Object} data Object with two properties <pre>url</pre> and
       *                       <pre>id</pre>
       * @return {Object}      Promise
       */
      getVideoData: function(data) {
        return $.getJSON('http://vimeo.com/api/v2/video/' + data.id + '.json')
          .pipe(function(result) {

            data.videoId = data.id;
            data.title = result[0].title;
            data.thumbnail = result[0].thumbnail_small;

            return data;
          });
      }

    };
  }
);