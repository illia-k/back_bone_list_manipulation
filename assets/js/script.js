/// <reference path="lib/jquery.min.js" />
/// <reference path="lib/backbone-min.js" />
/// <reference path="lib/underscore-min.js" />

$(document).ready(function () {
	var Item = Backbone.Model.extend({
		defaults: {
			part1: 'hello',
			part2: 'world',
			id: 0			
		}
	});

	var List = Backbone.Collection.extend({
		model: Item
	});

	var ItemView = Backbone.View.extend({

		tagName: 'li', // name of (orphan) root tag in this.el
		events: {
			'click button.del': 'delSelf'
		},
		

		initialize: function () {
			_.bindAll(this, 'render', 'delSelf'); // every function that uses 'this' as the current object should be in here
		},

		render: function () {
			$(this.el).html(
				'<span id="' + this.model.get('id') + '">' 
					+ this.model.get('part1') + ' ' 
					+ this.model.get('part2') + '</span>'
				+ '<button class="del" item="' + this.model.get('id') + '">Del</button>');
			return this; // for chainable calls, like .render().el
		},
		
		delSelf: function(){
			this.remove();
		}
	});

	var ListView = Backbone.View.extend({

		el: $('body'), // el attaches to existing element
		events: {
			'click button#add': 'addItem'			
		},

		initialize: function () {
			_.bindAll(this, 'render', 'addItem', 'appendItem'); // every function that uses 'this' as the current object should be in here

			this.collection = new List();
			this.collection.bind('add', this.appendItem); // collection event binder

			this.counter = 0;
			this.render();
		},

		render: function () {
			var self = this;
			
			$(this.el).append("<ul></ul>");
			_(this.collection.models).each(function (item) { // in case collection is not empty
				self.appendItem(item);
			}, this);
		},
		
		addItem: function () {
			this.counter++;
			var item = new Item();
			item.set({
				part2: item.get('part2') + this.counter, // modify item defaults
				id: this.counter
			});
			this.collection.add(item);
		},
		
		appendItem: function (item) {
			var itemView = new ItemView({
				model: item
			});
			$('ul', this.el).append(itemView.render().el);
		}		

	});


	var listView = new ListView();

});