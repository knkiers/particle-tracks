(function () {
  'use strict';

  angular
    .module('thinkster.routes')
    .config(config);

  config.$inject = ['$routeProvider'];

  /**
   * @name config
   * @desc Define valid application routes
   */
    function config($routeProvider) {
	$routeProvider.when('/register', {
	    controller: 'RegisterController', 
	    controllerAs: 'vm',
	    templateUrl: '/static/templates/authentication/register.html'
	}).when('/login', {
	    controller: 'LoginController',
	    controllerAs: 'vm',
	    templateUrl: '/static/templates/authentication/login.html'
	}).when('/', {
	    controller: 'IndexController',
	    controllerAs: 'vm',
	    templateUrl: '/static/templates/layout/index.html'
	}).when('/event', {
	    controller: 'EventController',
	    controllerAs: 'vm',
	    templateUrl: '/static/templates/events/event.html'
	}).when('/+:username', {
	    controller: 'ProfileController',
	    controllerAs: 'vm',
	    templateUrl: '/static/templates/profiles/profile.html'
	}).when('/+:username/settings', {
	    controller: 'ProfileSettingsController',
	    controllerAs: 'vm',
	    templateUrl: '/static/templates/profiles/settings.html'
	}).otherwise('/');
	/**
	 * KK: not sure if this last bit is needed now
	 */
    }
})();
