define([
	'jquery',
	'underscore',
	'backbone',
	'views/youtube_item',
	'collections/youtube_search_results',
	'collectionView',
	'transition'
], function($, _, Backbone, YoutubeItemView, YoutubeSearchResultsList) {
	
	var YoutubeHistoryView = Backbone.View.extend({
		tagName: 'ul',

		className: 'clearfix unstyled ux-maker playlists-result',
		
		view: {
			type: YoutubeItemView,
			collection: YoutubeSearchResultsList
		},

		transition: {
			duration: 200,
			css: 'transition-in'
		},

		// TODO: add paging
		initialize: function() {
			this.listenTo(this.model.user().historyService, 'change:feed', this.updateCollection);
			this.model.user().history();
			// this.listenTo(this.collection, 'change:isPlaying', this.updateState);
		},

		updateCollection: function (historyFeed) {
			var entries = _.map(historyFeed.get('feed').entry, function(entry){
				var video = entry.media$group;
				// var hqDefault = _.find()
				return {
					id: video.yt$videoid.$t,
					title: video.media$title.$t,
					description: video.media$description.$t,
					duration: video.yt$duration.seconds,
					likeCount: entry.yt$rating ? entry.yt$rating.numLikes : 0,
					thumbnail: {
						hqDefault: video.media$thumbnail[0].url
					},
					isPlaying: false
				};
			});
			this.collection.reset(entries);
		}

	});

    return YoutubeHistoryView;
});