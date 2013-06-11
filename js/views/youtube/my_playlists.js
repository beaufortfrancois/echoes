define([
	'jquery',
	'underscore',
	'backbone',
	'views/youtube_playlist_item',
	// 'collections/youtube_playlists_results',
	'collections/youtube_playlists_provider',
	'collectionView',
	'transition'
], function($, _, Backbone, YoutubePlaylistItemView, YoutubePlaylistsProvider) {
	
	var MyPlaylists = Backbone.View.extend({
		tagName: 'ul',

		className: 'clearfix unstyled ux-maker playlists-result',
		
		view: {
			type: YoutubePlaylistItemView,
			collection: YoutubePlaylistsProvider
		},

		transition: {
			duration: 200,
			css: 'transition-in'
		},

		initialize: function() {
			this.listenTo(this.model.user(), 'change:author', this.onUserChange);
			this.listenTo(this.collection, 'change:isPlaying', this.updateState);
			this.onUserChange();
		},

		onUserChange: function() {
			var user = this.model.user();
			if (user && user.getUsername()) {
				this.collection.username = user.getUsername();
				this.collection.fetch({ reset: true });
			}
		},

		updateState: function(model, isPlaying) {
			if (isPlaying) {
				var last = this.collection.find(function(item){
					return item.get('isPlaying') === true && item.id !== model.id;
				});
				last && last.set({ isPlaying: false });
			}
		}
	});

    return MyPlaylists;
});