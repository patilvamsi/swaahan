'use strict';


var AppContoller = angular.module('CallCenterApp.DialogController', []);

AppContoller.controller('DialogController',
					[
					'$scope',
					'$mdDialog',
					'utils',
					'$filter',
					function ($scope,$mdDialog,utils,$filter) {
					
					 $scope.elements = utils.getElements();
					 $scope.currentSlideIndex =  utils.getIndex();
					 $scope.cancel = function() {
					      $mdDialog.cancel();
					  };
				    $scope.closeImageGallery = function() {
						 $mdDialog.cancel();
					}
					$scope.getAvailableTimings = function(availability) {
							return utils.getFormatedTimings(availability);
					};
					    $scope.selectedItem={aggName:"",aggValues:[]};
					 $scope.selectItem = function(item){
						 $scope.selectedItem.aggValues.push(item);
					 } 
					 $scope.filter = function(aggName) {
						 $scope.selectedItem.aggName=aggName;
						 
					      $mdDialog.hide($scope.selectedItem);
					 };  
					 
					 $scope.getAllDays = function(availability){
						 return utils.getAllDays(availability)
					 }
					
					$scope.getEachDayTiming = function(availability,day){
						return utils.getEachDayTiming(availability,day);
					}
					
					$scope.getWeekDay = function(day){
						return utils.getWeekDay(day);
					}
					$scope.isOfferValid = function(endDate){
				    	if(utils.isNotNullAndEmpty(endDate)){
				    		var currentDate = $filter('date')(new Date(), "yyyy-MM-dd");
				    		var endDate = $filter('date')(endDate, "yyyy-MM-dd");
				    		if(endDate >= currentDate || endDate === '1970-01-01')
				    			return true;
				    		else return false;
				    		
				    	}else {
				    		return true;
				    	}
				    }
					$scope.getFormatedEndDate = function(date){
						return $filter('date')(date, 'dd-MMM-yyyy');
					}
					
					
}]);