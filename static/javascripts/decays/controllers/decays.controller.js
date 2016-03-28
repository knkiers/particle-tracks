/**
 * EventController
 * @namespace thinkster.decays.controllers
 * @references - some useful info on getting angular and svg to play together: 
 *               http://alexandros.resin.io/angular-d3-svg/
 *             - useful info regarding how to make an arc of a circle in svg:
 *               https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/
 *                       Paths?redirectlocale=en-US&redirectslug=SVG%2FTutorial%2FPaths#Arcs
 *
 * ISSUES: - when toggling B field, need to somehow adjust the event, too; in particular, if there is a chained
 *           event, everything will be messed up.  maybe just need to do a simple reversal of some sort...(?)
 */
(function () {
    'use strict';

    angular
	.module('thinkster.decays.controllers')
	.controller('EventController', EventController);
    
    EventController.$inject = ['$cookies','$scope', '$location', 'GenerateEvent', 'Authentication'];

    /**
     * @namespace EventController
     */
    function EventController($cookies, $scope, $location, GenerateEvent, Authentication) {
	var vm = this;

	var xmin = -5; // cm
	var xmax = 5;  // cm
	var ymin = -5; // cm
	var ymax = 5;  // cm
	var xDecay = 0;// cm; the decay occurs at the origin
	var yDecay = 0;// cm; the decay occurs at the origin

	// function that takes these things, as well as the momentum, computes beginning and ending point, radius, etc.
	
	vm.eventGenerated = false;

	activate();

	vm.graph = {'width': 500, 'height': 500};
	vm.circles = [
	    {'x': 15, 'y': 20, 'r':30},
	    {'x': 35, 'y': 60, 'r':20},
	    {'x': 55, 'y': 10, 'r':40},
	];

	vm.d = "M10 315 L 110 215 A 30 50 0 0 1 162.55 162.45 L 172.55 152.45 A 30 50 -45 0 1 215.1 109.9 L 315 10"

	/**
	 * @name generateEvent
	 * @desc fetches data for a new random decay event
	 * @memberOf thinkster.decays.controllers.EventController
	 */
	vm.generateEvent = function() {
	    var b_field = vm.bFieldStrength;
	    var b_direction = vm.bFieldDirection;	    
	    GenerateEvent.get(b_field, b_direction).then(eventSuccessFn, eventErrorFn);
	}

	/**
	 * @name renderEvent
	 * @desc renders an existing event
	 * @memberOf thinkster.decays.controllers.EventController
	 */
	vm.renderEvent = function() {
	    

	}




	

	
	/**
	 * @name activate
	 * @desc Actions to be performed when this controller is instantiated
	 * @memberOf thinkster.decays.controllers.EventController
	 */
	function activate() {
	    if (!Authentication.isAuthenticated()) {
		$location.url('/login');
	    }

	    if (!$cookies.bFieldStrength) {
		vm.bFieldStrength = 5; // default is B = 5 kG
		$cookies.bFieldStrength = vm.bFieldStrength;
	    } else {
		vm.bFieldStrength = $cookies.bFieldStrength;
	    }

	    if (!$cookies.bFieldDirection) {
		vm.bFieldDirection = 'in'; // default is that the B field is pointing into the page
		$cookies.bFieldDirection = vm.bFieldDirection;
	    } else {
		vm.bFieldDirection = $cookies.bFieldDirection;
	    }
	    
	}
	
	/**
	 * @name eventSuccessFn
	 * @desc Update posts array on view
	 */
	function eventSuccessFn(data, status, headers, config) {
	    vm.eventGenerated = true;
	    vm.event = data.data;
	}

	/**
	 * @name eventErrorFn
	 * @desc Show snackbar with error
	 */
	function eventErrorFn(data, status, headers, config) {
	    vm.eventGenerated = false;
	    //		Snackbar.error(data.error);
	}

	/**
	 * @name toggleBFieldDirection
	 * @desc Toggles between inward and outward pointing B fields
	 */
	vm.toggleBFieldDirection = function() {
	    if (!$cookies.bFieldDirection) {
		$cookies.bFieldDirection = 'in';
	    } else {
		if ($cookies.bFieldDirection == 'in') {
		    $cookies.bFieldDirection = 'out';
		} else {
		    $cookies.bFieldDirection = 'in';
		}
		vm.bFieldDirection = $cookies.bFieldDirection;
	    }
	}
    }

})();

/*
	function setAuthenticatedAccount(account) {
	    $cookies.authenticatedAccount = JSON.stringify(account);
	}

	/**
	 * @name unauthenticate
	 * @desc Delete the cookie where the user object is stored
	 * @returns {undefined}
	 * @memberOf thinkster.authentication.services.Authentication
	 
	function unauthenticate() {
	    delete $cookies.authenticatedAccount;
	}

*/
