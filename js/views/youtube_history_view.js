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

		events: {
			'click .show-more': 'loadMore'
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
				return {
					id: video.yt$videoid.$t,
					title: video.media$title ? video.media$title.$t : '',
					description: video.media$description ? video.media$description.$t : '',
					duration: video.yt$duration ? video.yt$duration.seconds : '',
					likeCount: entry.yt$rating ? entry.yt$rating.numLikes : 0,
					thumbnail: {
						hqDefault: video.media$thumbnail[0].url
					},
					isPlaying: false
				};
			});
			// add dummy item for loading more
			entries.push({
				id: '',
				title: "Show more from history",
				description: "This will load more videos you watched in the past",
				duration: '',
				likeCount: 0,
				thumbnail: {
					hqDefault: ''
				},
				isPlaying: false
			});
			this.collection.reset(entries);
		},

		loadMore: function(ev){
			console.log('clicked');return
			ev.preventDefault();
			this.model.user().historyService.updateNextIndex().fetch();
		}

	});

    return YoutubeHistoryView;
});