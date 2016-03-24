/**
 * EventController
 * @namespace thinkster.decays.controllers
 */
(function () {
    'use strict';

    angular
	.module('thinkster.decays.controllers')
	.controller('EventController', EventController);
    
    EventController.$inject = ['$scope', '$location', 'GenerateEvent', 'Authentication'];

    /**
     * @namespace EventController
     */
    function EventController($scope, $location, GenerateEvent, Authentication) {
	var vm = this;

	activate();

	/**
	 * @name activate
	 * @desc Actions to be performed when this controller is instantiated
	 * @memberOf thinkster.layout.controllers.IndexController
	 */
	function activate() {
	    if (!Authentication.isAuthenticated()) {
		$location.url('/login');
	    } else {
		GenerateEvent.get().then(eventSuccessFn, eventErrorFn);
	    }
	    /**
	     * @name eventSuccessFn
	     * @desc Update posts array on view
	     */
	    function eventSuccessFn(data, status, headers, config) {
		vm.event = data.data;
	    }


	    /**
	     * @name postsErrorFn
	     * @desc Show snackbar with error
	     */
	    function eventErrorFn(data, status, headers, config) {
		//		Snackbar.error(data.error);
	    }
	}
    }

})();
