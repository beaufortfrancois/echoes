define([
	'underscore',
	'backbone'
], function(_, Backbone) {
   
	var YoutubeHistoryService = Backbone.Model.extend({

		url: function(){
			var url = "";
			if (this.token) {
				url = "https://gdata.youtube.com/feeds/api/users/default/watch_history?access_token=" +
				 	this.token + 
				 	"&alt=json&v=2" +
				 	"&max-result=50" +
				 	"&start-index=" + this.startIndex;
			}
			return url;
		},

		token: '',
		startIndex: 1,
		results: 25,
		initialize: function(token) {
			this.token = token;
		},

		updateNextIndex: function () {
			this.startIndex = this.startIndex + (this.results - 1);
			return this;
		},

		parse: function(response) {
			var feed = this.get('feed');
			if (feed) {
				feed.entry = feed.entry.concat(response.feed.entry);
				// created so a change event will be triggered
				feed.updated = new Date();
				this.set('feed', feed);
				return;
			}
			return response;
		}

	});
   
	return YoutubeHistoryService; 
});