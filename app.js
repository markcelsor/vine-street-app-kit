// Load the application once the DOM is ready, using `jQuery.ready`:
$(function(){

  document.addEventListener('touchmove', function(e){ e.preventDefault(); });
  
  // Header View
  HeaderView = Backbone.View.extend({
  	el: $("#header"),
  	template: _.template($('#header-template').html()),
  	title: "Nil",
  	render: function() {
      this.el.html(this.template({title: this.title}));
      if(this.title=="Home") {
      	this.el.hide();
      } else {
      	this.el.show();
      }
    }
  });
  window.Header = new HeaderView;
  
  // Content View
  ContentView = Backbone.View.extend({
  	el: $("#content"),
  	title: "Home",
  	template: _.template($('#home-template').html()),
  	data:{},
  	render: function() {
      this.el.html(this.template(this.data));
      var scroller = new iScroll('content');
      
    }
  });
  window.Content = new ContentView;
  
  
  // Modal View
  
  ModalView = Backbone.View.extend({
  	el: $("#modal"),
  	template: _.template($('#empty-template').html()),
  	data:{},
  	render: function() {
      this.el.html(this.template(this.data));
      $("#modalWrapper").show();
    }
  });
  window.Modal = new ModalView;
  
  // Footer View
  FooterView = Backbone.View.extend({
  	el: $("#footer"),
  	template: _.template($('#footer-template').html()),
  	render: function() {
      this.el.html(this.template({}));
    }
  });
   window.Footer = new FooterView;
  
  // Router
  // ---------------
  WorkspaceRouter = Backbone.Router.extend({
	
	  routes: {
	    
		"home": "home",
	    "items": "items",
	    "items/detail/:itemId": "itemsDetail",
	    
	    //global
	    "video/:path": "video",
	    "closeModal": "closeModal",
	    "historyBack": "historyBack"
	    
	  },

	// footer
	// ************
		
	  home: function() {
	  
	  	// Check data
	  	if(!window.workspace.dataPopulated) {
	  		window.workspace.populateAppContent();
	  	}
	  	
	  	window.Content.data.content = "Home Content";
	
	    $('body').removeClass().addClass('home');
	    window.Header.title = "Home";
	    window.Header.render();
	    window.Content.template = _.template($('#home-template').html())
		window.Content.render();
	  },
	  
	  // ITEMS
	  items: function() {
	  	
	  	// Check data
	  	if(!window.workspace.dataPopulated) {
	  		window.workspace.populateAppContent();
	  		return;
	  	}
	  	
	  
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
			$('#itemsList').append(template(obj.attributes));
			i++;
		});
		
		// iOS Specific
		var scroller1 = new iScroll('content');
		//var scroller2 = new iScroll('itemList');
	  },
	  
	  itemsDetail: function(itemId) {
	  	
	  	if(!window.workspace.dataPopulated) {
	  		window.workspace.populateAppContent();
	  		return;
	  	}
	  	
	  	$('body').removeClass().addClass('itemsDetail itemsDetail-'+itemId);
	  	
	  	window.Header.title = "Items Detail";
	    window.Header.render();
	    	    
	    window.Content.data = window.itemsCollection.models[itemId].attributes;
	    window.Content.template = _.template($('#itemsDetail-template').html())
		window.Content.render();
		
		// iOS Specific
		var scroller1 = new iScroll('content');
		//var scroller2 = new iScroll('itemDescription');
		
		
	  },
	  	  
	  
	  // global
	  // ************
	  
	  video: function(path) {
	    this.testNetworkConnection(path, this.videoLoad);
	  },
	  videoLoad: function(path) {
	  	$('#modal').addClass('videoModal');
	  	window.Modal.data = {'path':path};
	    window.Modal.template = _.template($('#video-template').html())
		window.Modal.render();
	  },
	  
	  historyBack: function() {
	  	history.go(-2);
	  	var scroller = new iScroll('content');
	  },
	  
	  closeModal: function(){
	  	$('#modal').removeClass();
	  	$('#modal').html('');
	  	$('#modalWrapper').hide();
	  	var scroller = new iScroll('content');
	  },
	  
	  networkConnectionError: function() {
	  	window.Modal.template = _.template($('#networkConnectionError-template').html())
		window.Modal.render();
	  },
	  
	  testNetworkConnection: function(path, callback) {
	  	path = path.replace(/2f/g,"/");
	  
		$.ajax({
			type: "get",
			cache: false,
			url: '/connection-test.txt',
			dataType: "text",
			error: function(){
				window.workspace.networkConnectionError();
            },
            success: function(data){
            	if(data==""){
            		window.workspace.networkConnectionError();
            	} else {
            	
            		callback(path)
            	}
            	
            }
        });	
	},
	
    populateAppContent: function() {
    	
    	// ITEMS
		$.getJSON("./items.json", function(json) {
		   	currentArray = [];
		   	$.each(json, function(i,item){
		   		currentArray.push({
			   		id:i, 
			   		title:item.title,
			   		content:item.content
		   		});
		   	});
			window.itemsCollection = new Backbone.Collection(currentArray);
			
			/* NOTE: Additional getJSON calls are all nested to make them sequential
			$.getJSON("http://test.com/feedB", function(json) { 
				// MORE CODE
			}); 
			*/
			
			// This block should always be in the deepest nested getJSON 
			window.pagesContentCollection = new Backbone.Collection(currentArray);
			window.workspace.dataPopulated = true;
			window.App.render();
			
		}); // ITEMS
	}
	
	
	});

  window.workspace = new WorkspaceRouter();
  window.workspace.dataPopulated = false;
  
  Backbone.history.start({pushState: false});
  
  // The Application
  // ---------------

  AppView = Backbone.View.extend({
	
    el: $("#app"),

    initialize: function() {
		window.workspace.populateAppContent();
		//this.render();
    },

    render: function() {
      $('#modalWrapper').hide();
      window.Content.render();
      window.Footer.render();
      window.workspace.navigate("home", true);
    }
    
  });

  window.App = new AppView;

});
