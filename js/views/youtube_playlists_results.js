define([
	'jquery',
	'underscore',
	'backbone',
	'views/youtube_playlist_item',
	'collections/youtube_playlists_results'
], function($, _, Backbone, YoutubePlaylistItemView, YoutubePlaylistsResults) {
	
	var SearchResults = Backbone.View.extend({
		tagName: 'ul',

		className: 'clearfix unstyled ux-maker playlists-result',
		
		view: {
			type: YoutubePlaylistItemView,
			collection: YoutubePlaylistsResults
		},

		transition: {
			duration: 200,
			css: 'transition-in'
		},

		initialize: function() {
			this.model.youtube().set({ data: [] });
			this.listenTo(this.model.youtube(), 'change:data', this.updateCollection);
			this.listenTo(this.model.youtube(), 'change:query', this.reset);
			this.listenTo(this.collection, 'change:isPlaying', this.updateState);
			this.listenTo(Backbone, 'app:load-more', this.handleLoadMore);
			this.$el.addClass('transition-out');
			this.model.youtube().set('feedType', 'playlists');
			this.model.youtube().set({ startIndex: 1 }, { silent: true });
			this.model.youtube().fetch();
		},
		
		handleLoadMore: function(ev){
			this.model.youtube().fetchNext();
		},

		reset: function () {
			this.collection.reset();
		},

		updateCollection: function(model, data) {
			if (data) {
				this.$el.hide();
				this.collection.add(data.items);
				this.$el.show().addClass('transition-in').removeClass('transition-out');
				// this.collection.reset(data.items);
			}
		},

		updateState: function(model, isPlaying) {
			if (isPlaying) {
				this.collection.savePlayed(model);
			}
		}
	});

    return SearchResults;
});