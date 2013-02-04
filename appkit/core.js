// Load the application once the DOM is ready, using `jQuery.ready`:
var AppKit;
AppKit = {};

$(function(){

  document.addEventListener('touchmove', function(e){ e.preventDefault(); });
    
  // Header View
  AppKit.headerView = Backbone.View.extend({
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
  
  
  // Content View
  AppKit.contentView = Backbone.View.extend({
  	el: $("#content"),
  	title: "Home",
  	template: _.template($('#home-template').html()),
  	data:{},
  	render: function() {
      this.el.html(this.template(this.data));
      var scroller = new iScroll('content');
      
    }
  });

  // Modal View
  AppKit.modalView = Backbone.View.extend({
  	el: $("#modal"),
  	template: _.template($('#empty-template').html()),
  	data:{},
  	render: function() {
      this.el.html(this.template(this.data));
      $("#modalWrapper").show();
    }
  });
  
  
  // Footer View
  AppKit.footerView = Backbone.View.extend({
  	el: $("#footer"),
  	template: _.template($('#footer-template').html()),
  	render: function() {
      this.el.html(this.template({}));
    }
  });
  
  
  AppKit.appView = Backbone.View.extend({
	
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
  
  
  //Global
	  AppKit.video = function(path) {
	    this.testNetworkConnection(path, this.videoLoad);
	  };
	  AppKit.videoLoad = function(path) {
	  	
	  	$('#modal').addClass('videoModal');
	  	window.Modal.data = {'path':path};
	    window.Modal.template = _.template($('#video-template').html())
		window.Modal.render();
	  };
	  
	  AppKit.historyBack = function() {
	  	history.go(-2);
	  	var scroller = new iScroll('content');
	  };
	  
	  AppKit.closeModal = function(){
	  	$('#modal').removeClass();
	  	$('#modal').html('');
	  	$('#modalWrapper').hide();
	  	var scroller = new iScroll('content');
	  	history.go(-2);
	  };
	  
	  AppKit.networkConnectionError = function() {
	  	window.Modal.template = _.template($('#networkConnectionError-template').html())
		window.Modal.render();
	  };
	  
	  AppKit.testNetworkConnection = function(path, callback) {
	  	path = path.replace(/2f/g,"/");
	  
		$.ajax({
			type: "get",
			cache: false,
			url: 'appkit/connection-test.txt',
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

  	};
  

});
