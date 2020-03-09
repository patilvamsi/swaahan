'use strict';

/**
 * 
 */

var AppContoller = angular.module('CallCenterApp.SearchController', []);

AppContoller.controller('SearchController', ['$scope', '$rootScope', '$state', 'searchService', '$mdDialog', '$http', '$q', '$filter', SearchController]);

function SearchController($scope, $rootScope, $state, searchService, $mdDialog, $http, $q, $filter) {
	
	$scope.noInternetError=false;
	// Initialized Variables
	$scope.request = {
	        query: "",
	        filterRequests : []
	};
	
	
	// All The Functions in this File
	$scope.searchQueryForRestaurants = searchQueryForRestaurants;
	$scope.selectedItemChange = selectedItemChange;
	$scope.setRestaurant = setRestaurant;
	$scope.getSearchRecordType = getSearchRecordType;
	$scope.showType = showType;
	
	function searchQueryForRestaurants(query) {
		
		
		$scope.request.filterRequests = [];
        $scope.request.filterRequests.push({ 'attributeName' : 'city', 'attributeValues' : [ $rootScope.selectedCity ]});
        $scope.request.filterRequests.push({ 'attributeName' : 'deleted', 'attributeValues' : [ '2' ]});
        $scope.request.filterRequests.push({ 'attributeName' : 'closed', 'attributeValues' : [ 'no','os' ]});
        var deferred = $q.defer();
        
        searchService.getRestaurantsSuggester($scope.request).then(function(results) {
			var suges = [];
			angular.forEach(results.data,function(suggestion){
				if(suggestion.subString === 'name'){
					console.log("Omitting record "+suggestion);
				}else{
					suges.push(suggestion);
				}
			});
			
			$scope.suggestions = filterSuggestion(suges);
            deferred.resolve(suges);
        },function(error){
        	if($scope.noInternetError===false)
        	{
        		$scope.noInternetError=true;
//        	console.log("internet is not connected!!!");
        	 $mdDialog.show(
   	   		      $mdDialog.alert()
   	   		        .parent(angular.element(document.body))
   	   		        .clickOutsideToClose(true)
   	   		        .title('Internet Connection Error !!!')
   	   		        .textContent('Please Check Your Internet Connection.')
   	   		        .ariaLabel('Internet Connection Error')
   	   		        .ok('OK')
   	   		        .targetEvent(null)
   	   		 );}
        });
        
        return deferred.promise;
	}
	
	function filterSuggestion(suggestionList){
		var filteredData = [];
		angular.forEach(suggestionList,function(suggestion){
			if($scope.getSearchRecordType(suggestion.payload.attributeName)==='Venue'){
				console.log(suggestion);
			}
	});
		return suggestionList;
		}
	
	function setRestaurant(item){
		 $scope.$emit('SelectedRestaurant', { message: item.payload.attributeValues[0] });
	}
	
	function selectedItemChange(item){
		$mdDialog.hide();
		if(item.restaurantType==='Resort')
			$state.transitionTo('resortDetail', {name: $filter('removeSpecialChars')(item.displayString),id:item.payload.attributeValues[0]});
		else
			$state.go('restaurantDetail',{name:$filter('removeSpecialChars')(item.displayString), id:item.payload.attributeValues[0]});
	}
	
	function getSearchRecordType(type){
		
		var returnedType='';
		if(type==='area') returnedType='Area';
		else if(type==='cuisine') returnedType='Cuisine';
		else if(type==='services') returnedType='Service';
		else if(type==='id' || type==='name') returnedType='Restaurant/Bar';
		else if(type==='cafe') returnedType='Cafe';
		else if(type==='city')returnedType='City';
		else returnedType='Venue';
		
		return returnedType;
	}
	
	function showType(type){
		var returnedType=false;
		if(type==='area' || type==='cuisine' || type==='services' || type==='cafe' || type==='city' || type==='id' || type==='name' ){
			returnedType=false;
		}else{
			returnedType=true;
		}
		return returnedType;
	}
}