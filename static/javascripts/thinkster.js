(function () {
    'use strict';

    angular
	.module('thinkster', [
	    'thinkster.config',
	    'thinkster.routes',
	    'thinkster.authentication',
	    'thinkster.layout',
	    'thinkster.decays',
	    //'thinkster.utils',
	    //'thinkster.profiles'
	]);

    angular
	.module('thinkster.routes', ['ngRoute']);

    angular
	.module('thinkster.config',[]);

    angular
	.module('thinkster')
	.run(run);

    run.$inject = ['$http'];

    /**
     * @name run
     * @desc Update xsrf $http headers to align with Django's defaults
     */
    function run($http) {
	$http.defaults.xsrfHeaderName = 'X-CSRFToken';
	$http.defaults.xsrfCookieName = 'csrftoken';
    }
    
})();

/**
 * angular
 *  .module('thinkster', []);
 */
