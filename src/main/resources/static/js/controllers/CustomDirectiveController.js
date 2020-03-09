'use strict'

/**
 * 
 */

var AppContoller = angular.module('CallCenterApp.CustomDirectiveController', []);

AppContoller.controller('CustomDirectiveController', CustomDirectiveController);

function CustomDirectiveController($scope, $rootScope, $state, $stateParams, utils,$mdDialog) {
	
	
	$scope.getDay = getDay;
	$scope.getAvailableDays = getAvailableDays;
	$scope.getAllDays = getAllDays;
	$scope.getWeekDay = getWeekDay;
	$scope.getEachDayTiming = getEachDayTiming;
	$scope.showServingDetails = showServingDetails;
	$scope.getAvailableTimings = getAvailableTimings;
	$scope.customPopup = customPopup;
	
	$scope.getOpeningToday = getOpeningToday;
	$scope.isOpeningToday = false;
	$scope.todaysDay = utils.getTodaysDay();
	function getOpeningToday(availability){
		  var days = $scope.getAllDays(availability);
		  var returnstring = "Not Available Today";
		  angular.forEach(days,function(day){
			  if(day===$scope.todaysDay){
				 returnstring = "Today's Time";
				$scope.isOpeningToday = true;
			  }
		  });
		  return returnstring;
	 }
	
	$scope.getOfferCount = function(buffets){
		 var count = 0;
		  if(utils.isNotNullAndEmpty(buffets)){
				angular.forEach(buffets.offer,function(eachOffer,index,array){
					if($rootScope.isOffersExpired(eachOffer.endEventDate)){
						count++;
					}
				});
		 }
		  return count;
	  }
	function showServingDetails(length,showserving){
		if(length>0 && showserving==="yes"){
			return true;
		}else{
			return false;
		}
	}
	$scope.getMinPax = function(tickets){
		var minPax = 0;
		angular.forEach(tickets,function(ticket){
			if(utils.isNotNullAndEmpty(ticket.minPax)){
				if(parseInt(ticket.minPax) > minPax)
					minPax = parseInt(ticket.minPax);
			}
		}			
		);
		return minPax;
	}
	function customPopup(elements,key) {
		 utils.setElements(elements);  
		if(key === 'buffet'){ 
			$mdDialog.show({
		      templateUrl: 'callcenter/customdirectives/buffetList.html',
		      parent: angular.element(document.body),
		      clickOutsideToClose:true,
		      animate: 'full-screen-dialog',
		      fullscreen: false,
		      locals: {
		    	  elements: elements
		      },
		    controller: 'DialogController'
		    })
		}else if(key === 'event'){
		    $mdDialog.show({
		      templateUrl: 'callcenter/customdirectives/eventList.html',
		      parent: angular.element(document.body),
		      clickOutsideToClose:true,
		      animate: 'full-screen-dialog',
		      locals: {
		    	  elements: elements
		      },
		    controller: 'DialogController'
		    })
		}if(key === 'offer'){
		    $mdDialog.show({
		      templateUrl: 'callcenter/customdirectives/offerList.html',
		      parent: angular.element(document.body),
		      clickOutsideToClose:true,
		      animate: 'full-screen-dialog',
		      locals: {
		    	  elements: elements
		      },
		    controller: 'DialogController'
		    })
		}
		if(key === 'multipleOffer'){
		    $mdDialog.show({
			      templateUrl: 'callcenter/customdirectives/multipleOffer.html',
			      parent: angular.element(document.body),
			      clickOutsideToClose:true,
			      animate: 'full-screen-dialog',
			      locals: {
			    	  elements: elements
			      },
			    controller: 'DialogController'
			    });
		}
	}

	
	function getAvailableTimings(availability) {
		return utils.getFormatedTimings(availability);
	}
	
	function getAvailableDays(availability) {
		return utils.getAvailableDays(availability);
	}
	
	function getEachDayTiming(availability,day){
		return utils.getEachDayTiming(availability,day);
	}
	
	function getAllDays(availability){
		 return utils.getAllDays(availability);
	 }
	
	function getWeekDay(day){
		return utils.getDayValueFromInteger(day);
	}
	
	function getDay(days, value){
		return utils.checkValueInArray(days, 8) || utils.checkValueInArray(days, value);
	}
	

	
	
}
		