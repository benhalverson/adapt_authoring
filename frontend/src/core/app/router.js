define(function(require) {

  var Backbone = require('backbone');
  var Origin = require('coreJS/app/origin');

  var Router = Backbone.Router.extend({

    routes: {
      ""                                      : "handleIndex",
      ":module(/*route1)(/*route2)(/*route3)" : "handleRoute"
    },

    initialize: function() {
      this.locationKeys = ['module', 'route1', 'route2', 'route3'];
    },

    isUserAuthenticated: function() {
      return Origin.sessionModel.get('isAuthenticated') ? true : false;
    },

    redirectToLogin: function() {
       this.navigate('#/user/login', {trigger: true});
    },

    createView: function(View, viewOptions, settings) {

      var viewOptions = (viewOptions || {});
      var settings = (settings || {});
      var currentView;

      if (this.isUserAuthenticated()) {
        currentView = new View(viewOptions);
      } else {
        if (settings.authenticate === false) {
          currentView = new View(viewOptions);
        } else {
          return this.redirectToLogin();
        }
      }

      $('.app-inner').append(currentView.$el);
      
    },

    handleIndex: function() {
      this.navigate('#/dashboard', {trigger: true});
    },

    handleRoute: function(module, route1, route2, route3) {
      // Remove views
      this.removeViews();

      var routeArguments = arguments;

      // Set location object
      Origin.location = {};
      _.each(this.locationKeys, function(locationKey, index) {
        Origin.location[locationKey] = routeArguments[index];
      });

      // Trigger location change
      Origin.trigger('location:change', Origin.location);

      var locationClass = 'module-' + Origin.location.module;
      if (Origin.location.route1) {
        locationClass += ' location-' + Origin.location.route1
      }
      $('body').removeClass().addClass(locationClass);

      // Trigger router event
      Origin.trigger('router:' + module, route1, route2, route3);
    },

    removeViews: function() {
      Origin.trigger('remove:views');
    }

  });

  return Router;

});
