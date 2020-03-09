'use strict';

var App = angular.module('SwaahanApp', [ 'ngMaterial', 'ngAnimate','ui.router',
		'ngAria', 'ngMessages', 'ui.bootstrap', 'ngSanitize', 'dateParser','ngMap','satellizer','720kb.datepicker']);

App.run(['$rootScope', '$state', '$stateParams', '$timeout', '$filter', '$mdSidenav', 
         'utils', 'store', '$mdDialog', appRunFunction]);

App.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', appConfigFunction]);

function appRunFunction($rootScope, $state, $stateParams, $timeout, $filter, $mdSidenav,utils,store, $mdDialog,) {

	utils.getErrors().then(function(resp){
		 $rootScope.errors =  resp.data;
	}) ;
	
	 $rootScope.$on('$stateChangeStart',
		        function(event, toState, toParams, fromState, fromParams,e,error){
		 utils.isInternetConnected().then(function(resp){
	   		 console.log("internet is connected!!!");
	   		 
	   	 },function(error){
	   		console.log("internet is not connected!!!");
	   		 $mdDialog.show(
	   		      $mdDialog.alert()
	   		        .parent(angular.element(document.body))
	   		        .clickOutsideToClose(true)
	   		        .title('Internet Connection Error !!!')
	   		        .textContent('Please Check Your Internet Connection.')
	   		        .ariaLabel('Internet Connection Error')
	   		        .ok('OK')
	   		        .targetEvent(null)
	   		 );
	   		 
	   	 });
	 });
	
    
   /* 
    $rootScope.logout = logout;
	function logout(){
	    if (!$auth.isAuthenticated()) {
	        return;
	    }
	    $auth.logout(false)
	      .then(function() {
	    	  $rootScope.closeSidenav();
//	    	  alert("You have been logged out");
	    	  $state.go('login');
	      });
	    };
    
    if (angular.isObject(store.get('cartForCallCenter'))) {
        ngCart.$restore(store.get('cartForCallCenter'));
    } else {
        ngCart.init();
    }
    
    if (angular.isObject(store.get('timings'))) {
    	commonBookingFactory.$restore();
    } else {
    	commonBookingFactory.init();
    }
    
    $rootScope.openSideNav = function(panel){
  	  	$rootScope.currentOpenedPanel = panel;
  	  
	  	$mdSidenav(panel).open();
    }
    
    $rootScope.closeSidenav = function(){
	  	var sideNav = $rootScope.currentOpenedPanel;
	  	
	  	if(sideNav !== undefined && sideNav !== null && sideNav !== '')
	  		$mdSidenav(sideNav).close();
    }
	
	if(utils.isNullAndEmpty($rootScope.selectedCity))
		$rootScope.selectedCity = "Bangalore";*/
	
}

function appConfigFunction($stateProvider, $locationProvider, $urlRouterProvider) {
	$locationProvider.html5Mode(true);

	$stateProvider.state('home', {
        url: '/',
        views: {
            '@' : {
                templateUrl: 'htmls/layouts/baselayout.html',
                controller: "HomePageController"
            },
            'header@home' : { templateUrl: 'htmls/header.html'},
            'menu@home' : { templateUrl: 'htmls/menu.html'},
            'body@home' : { templateUrl: 'htmls/bodyhtmls/landingPage.html'},
            'footer@home' : { templateUrl: 'htmls/footer.html'}
        }
    });
	
	$urlRouterProvider.otherwise('/');
}
