/*
 * Clay.IO API Integration
*/
var Clay = Clay || {};

Clay.gameKey = "bbasracquetball";
Clay.readyFunctions = [];
Clay.options = { debug: true };
Clay.ready = function( fn ) {
    Clay.readyFunctions.push(fn);
};

(function() {
    var clay = document.createElement("script");
    
    clay.async = true;
    clay.src = ( "https:" == document.location.protocol ? "https://" : "http://" ) + "clay.io/api/api-stats-achievement-twitter-facebook-stream-ratings-screenshot-ads.js"; 
    
    var tag = document.getElementsByTagName("script")[0];
    tag.parentNode.insertBefore(clay, tag);
})();

var ClayWrap = (function() {
    return {
        showAds: function() {
            new Clay.Advertisement({ size: 'preroll' });
        },
        showRatings: function() {
            new Clay.Ratings();
        },
        logStat: function(name, quantity) {
            Clay.Stats.logStat({ name: name, quantity: quantity || 1 });
        },
        fbPost: function(msg) {
            var screenshot = new Clay.Screenshot({ prompt: false });
            screenshot.save(function(response) {
                Clay.Facebook.post({ message: msg, picture: response.imageSrc });
            });
        },
        award: function(awardId) {
            (new Clay.Achievement({ id: awardId })).award();
        }
    };
})();