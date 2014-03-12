define(
  [
    'jquery',
    '../../config'
  ],
  function($, Config) {
    'use strict';

    return {

      /**
       * Fetches video data from youtube
       * @param  {Object} data Object with two properties <pre>url</pre> and
       *                       <pre>id</pre>
       * @return {Object}      Promise
       */
      getVideoData: function(data) {
        var options = {
          'id': data.id,
          'key': Config.get('youTubeAPIKey')
        };
        return $.getJSON('https://www.googleapis.com/youtube/v3/videos?part=snippet', options)
          .then(function(result) {
            var videoInfo = (result && result.items[0]) || {};
            data.videoId = videoInfo.id || null;
            data.title = (videoInfo.snippet && videoInfo.snippet.title) || null;
            data.thumbnail = (videoInfo.snippet && videoInfo.snippet.thumbnails &&
                              videoInfo.snippet.thumbnails['default'] &&
                              videoInfo.snippet.thumbnails['default'].url) || null;

            return data;
          });
      }

    };
  }
);