define([
	'jquery',
	'underscore',
	'backbone',
	'views/youtube_search_results',
	'views/youtube_playlists_results',
	'views/youtube_history_view',
	'views/youtube/my_playlists'
], function($, _, Backbone, YoutubeSearchResults, YoutubePlaylistsResults, YoutubeHistoryView, MyPlaylists) {
	
	var ContentLayout = Backbone.View.extend({
		el: '#search-results',

		switcher: {
			key: 'route',
			views: {
				videos: YoutubeSearchResults,
				explore: YoutubeSearchResults,
				playlists: YoutubePlaylistsResults,
				"my-playlists": MyPlaylists,
				history: YoutubeHistoryView
			}
		},

		initialize: function() {
			// TODO - should remove on first collection reset
			this.$el.find('.well').remove();
		}
	});

	return ContentLayout;
});