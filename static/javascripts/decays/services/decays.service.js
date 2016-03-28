/**
 * EventGenerator
 * @namespace thinkster.decays.services
 */
(function () {
    'use strict';

    angular
	.module('thinkster.decays.services')
	.factory('GenerateEvent', GenerateEvent);

    GenerateEvent.$inject = ['$http'];

    /**
     * @namespace Posts
     * @returns {Factory}
     */
    function GenerateEvent($http) {
	var Event = {
	    get: get
	};

	return Event;

	////////////////////

	/**
	 * @name get
	 * @desc Get an event
	 * @returns {Promise}
	 * @memberOf thinkster.decays.services.GenerateEvent
	 * @reference http://stackoverflow.com/questions/13760070/
         *                 angularjs-passing-data-to-http-get-request
	 */
	function get(b_field, b_direction) {
	    return $http.get('/api/v1/generateevent/',{
		params: {
		    b_field: b_field,
		    b_direction: b_direction
		}
	    });
	}
    }
})();
