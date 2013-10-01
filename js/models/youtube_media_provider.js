define([
	'underscore',
	'backbone',
	'./youtube_item_info',
	'./youtube_playlist_info_provider',
	'./youtube/ProfileService',
	'collections/youtube/UserPlaylists'
], function(_, Backbone, YoutubeItemInfo, 
	YoutubePlaylistInfoProvider,
	ProfileService,
	UserPlaylists
	) {

	var Developer_API_key = "AI39si4_o0x9AELkUm2d2M30xfHzbgEjFtZgzV8C7Ydu2f6eRZ6XaYaRxD07qwEVBQkMiOK0pwOFbQ4M7sWl6jcJ7r102BsRJg";
    var YoutubeMediaProvider = Backbone.Model.extend({
		// youtube services
		playlists: new UserPlaylists(),
		profile: new ProfileService(),
		
		defaults: {
			query: '',
			startIndex: 1,
			maxResults: 50,

			// supported feed types: videos, playlists, playlist
			feedType: 'videos',
			//- youtube item information provider
			info: new YoutubeItemInfo(),
			playlist: new YoutubePlaylistInfoProvider()
		},

		initialize: function() {
			this.on('change:feedType', this.onFeedTypeChange, this);
			this.on('change:query change:startIndex', this.search, this);
			this.on('change:data', this.publishResponse, this);
		},

		onFeedTypeChange: function(){
			this.set({ startIndex: 1 }, { silent: true });
			this.fetch();
		},

		search: function() {
			this.fetch();
		},

		fetchNext: function() {
			var startIndex = this.get('startIndex'),
				totalItems = this.get('data').totalItems,
				nextIndex = startIndex + this.get('data').itemsPerPage,
				remainder = totalItems - nextIndex;
			if (remainder > 0) {
				this.set('startIndex', nextIndex, { silent: true });
			}
			console.log(this.fetch());
		},

		// this causes the view of playlists to render
		// previous results of videos
		// parse: function(response) {
		// 	if (this.get('data')) {
		// 		// get the previous items and add the
		// 		// new ones to them
		// 		response.data.items = this.get('data').items.concat(response.data.items);
		// 	}
		// 	return response;
		// },

		query: function(data) {
			data.startIndex = data.startIndex || 1;
			this.set(data);
		},
		
		urlRoot: function() {
			return 'https://gdata.youtube.com/feeds/api/' + this.getFeedType() +
				'?q=' + this.get('query') +
				'&alt=jsonc&v=2&start-index=' + this.get('startIndex') +
				'&max-results=' + this.get('maxResults') + "&key=" + Developer_API_key;
		},

		publishResponse: function() {
			// console.log('youtube fetch ended:', this.get('data'));
			this.setDisplayHelpers();
			this.trigger('new-media-response', this.get('data'));
		},

		setDisplayHelpers: function() {
			var itemsPerPage = this.get('data').itemsPerPage,
				start = this.get('data').startIndex - 1,
				end = start + itemsPerPage,
				totalItems = this.get('data').totalItems;
			start = start > 0 ? start : 1;
			end = end > totalItems ? totalItems : end;
			this.set('totalItems', _(totalItems).formatNumberWithComma());
			this.set({
				start: start,
				end: end
			});
		},

		getFeedType: function() {
			var feedType = this.get('feedType');
			if (feedType === 'playlists') {
				feedType += '/snippets';
			}
			// single playlist: PLD5BA8A4695FAA144?alt=jsonc&v=2
			if (feedType === 'playlist') {
				feedType += '/' + this.get('query');
			}
			return feedType;
		},

		validate: function(attrs) {
			if (attrs.startIndex < 0) {
				return 'start index should be greater than 1.';
			}
		},

		fetchMediaById: function(mediaId) {
			this.get('info').set('id', mediaId);
		},

		fetchPlaylistInfo: function(playlistId) {
			this.get('playlist').set('id', playlistId);
		},

		nextIndex: function () {
			var startIndex = this.get('startIndex'),
				totalItems = this.get('data').totalItems,
				nextIndex = startIndex + this.get('data').itemsPerPage,
				remainder = totalItems - nextIndex;
			if (remainder > 0) {
				this.set('startIndex', nextIndex);
			}
		},

		prevIndex: function() {
			var prevIndex = this.get('startIndex') - this.get('data').itemsPerPage;
			if (prevIndex > -1) {
				this.set('startIndex', prevIndex);
			}
		}
	});
   
    return YoutubeMediaProvider;
});