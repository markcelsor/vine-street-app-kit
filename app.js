$(function(){
	
	// Use AppKit
	window.AppKit = AppKit;
	
	// Initialize HTML regions
	window.Header = new AppKit.headerView;
	window.Content = new AppKit.contentView;
	window.Modal = new AppKit.modalView;
	window.Footer = new AppKit.footerView;
	
	// Specify routes and screen functions
	WorkspaceRouter = Backbone.Router.extend({
		
		// Specify routes
		routes: {    
			"home": "home",
			"items": "items",
			"items/detail/:itemId": "itemsDetail",
			"video/:path": "video",
			"closeModal": "closeModal",
			"historyBack": "historyBack"
		},
		
		// Populate app content from external JSON datasource
		populateAppContent: function() {
					
			// ITEMS
			$.getJSON("content/items.json", function(json) {
			   	currentArray = [];
			   	$.each(json, function(i,item){
			   		currentArray.push(item);
			   	});
				window.itemsCollection = new Backbone.Collection(currentArray);
				
				// Render App - Note: this block should always be in the deepest nested getJSON 
				window.pagesContentCollection = new Backbone.Collection(currentArray);
				window.workspace.dataPopulated = true;
				window.App.render();
				
			}); // ITEMS
		},
		
		// Static home screen function	
		home: function() {
		
			// Check data
			if(!window.workspace.dataPopulated) {
				window.workspace.populateAppContent();
			}
			
			// Render templates
			$('body').removeClass().addClass('home');
			window.Content.data.content = "Home Content";
			window.Header.title = "Home";
			window.Header.render();
			window.Content.template = _.template($('#home-template').html())
			window.Content.render();
		},
		
		// Dynamic item list screen function
		items: function() {
			
			// Check data
			if(!window.workspace.dataPopulated) {
				window.workspace.populateAppContent();
				return;
			}
			
			// Render templates
			$('body').removeClass().addClass('items');
			window.Header.title = "Items";
			window.Header.render();
			window.Content.template = _.template($('#items-template').html())
			window.Content.render();
			
			// Populate item list
			$('#itemsList').html("");
			var i = 0;
			window.itemsCollection.each(function(obj){
				var template = _.template($('#itemsListItem-template').html())
				obj.attributes.index = i;
				$('#itemsList').append(template(obj.attributes));
				i++;
			});
			
			// iScroll iOS Specific
			var scroller1 = new iScroll('content');
		},
		
		// Dynamic item detail screen function	
		itemsDetail: function(itemId) {
				
			// Check data
			if(!window.workspace.dataPopulated) {
				window.workspace.populateAppContent();
				return;
			}
			
			// Render templates
			$('body').removeClass().addClass('itemsDetail itemsDetail-'+itemId);
			window.Header.title = "Items Detail";
			window.Header.render();	    
			window.Content.data = window.itemsCollection.models[itemId].attributes;
			window.Content.template = _.template($('#itemsDetail-template').html())
			window.Content.render();
			
			// Populate fields
			var i = 0;
			$.each( window.Content.data, function( key, value ) {
				var template = _.template($('#itemFieldsListItem-template').html())	
				var attributes = { index:i, key:key, value:value }
				$('#itemFieldsList').append(template(attributes));
				i++;
				console.log(i + key + value);
				
			});
			
			// iScroll iOS Specific
			var scroller1 = new iScroll('content');		
		},

		// Standard AppKit functions
		video: AppKit.video,
		videoLoad: AppKit.videoLoad, 
		historyBack: AppKit.historyBack,
		closeModal: AppKit.closeModal,
		networkConnectionError: AppKit.networkConnectionError,
		testNetworkConnection: AppKit.testNetworkConnection
	});
	
	window.workspace = new WorkspaceRouter();
	window.workspace.dataPopulated = false;
	
	// Render App
	window.App = new AppKit.appView;
	
	// Start tracking history
	Backbone.history.start({pushState: false});
});
