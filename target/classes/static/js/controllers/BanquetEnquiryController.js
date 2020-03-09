'use strict';

/**
 * 
 */
var AppContoller = angular.module('CallCenterApp.BanquetEnquiryController', []);

AppContoller.controller('BanquetEnquiryController',['$scope', '$rootScope','$state', '$stateParams','$element','searchService',
                                               'customToast','bequetFactory','utils','$dateParser','banquetService', BanquetEnquiryController]);

function BanquetEnquiryController($scope, $rootScope,$state,$stateParams,$element, searchService,  
							 customToast,bequetFactory,utils,$dateParser,banquetService) { 
    $scope.partyType=bequetFactory.getPartyType();
    $scope.mealType=bequetFactory.getmealType();
    $scope.Requirements=bequetFactory.getRequirements();
    $scope.getTime=bequetFactory.getTime();
    $scope.plan={partyDate:new Date()};
    $scope.city = $rootScope.selectedCity;
    
    $scope.submitPartyDetail = function() {
  	  var location = $scope.selectAreas.map(function(item) {
		    return item['name'];
		});
  	  $scope.parties = {};
  	  
  	$scope.plan.location = location.toString();
  	  $scope.plan.city = $scope.selectedCity;
  	  var startTime = $dateParser($scope.plan.endTimeTocall,'hh a');
  	  var endTime = $dateParser($scope.plan.endTimeTocall,'hh a');
  	  $scope.plan.startTimeTocall=startTime;
  	  $scope.plan.endTimeTocall=endTime
  	  
  	banquetService.submitPartyDetail($scope.plan).then(
								function(resp) {
									if (resp.data.result === true){ 
									$scope.parties="";
										$scope.plan="";
										$scope.selectAreas="";
										customToast.showToast('Thank you for choosing EveningFlavors Your party request has been submitted. We will get back to you soon');
										$state.go("dashboard");
									}else{
									$scope.isSaving = true;
									$scope.isdisabled = true;
									$scope.sbtbutton = "Edit";
									}}, function(error) {
								});
					
			};
    
    		var self = $scope;
    
        $scope.querySearch = querySearch;
       
        $scope.allareas=[];
        $scope.selectAreas = [];
        $scope.filterSelected = true;
        
        function querySearch (query) {
           var results = query ?
           $scope.allareas.filter(createFilterFor(query)) : [];
           return results;
        }

        function createFilterFor(query) {
           var lowercaseQuery = angular.lowercase(query);
           return function filterFn(area) {
              return (area._lowername.indexOf(lowercaseQuery) != -1);;
           };
        }
        
        function loadareas(areas) {
      	
      	  var names = areas.map(function(item) {
      		    return item['name'];
      		});
      	  
           var selectAreas =names;//['electronic','rtnagar'];// areas.join(" "); 
           return selectAreas.map(function (c, index) {
                 var cParts = c.split(" ");
                 var area = {
                    name: c
                 };
                 area._lowername = area.name.toLowerCase();
                 return area;
           });
        }
     
        $scope.searchTerm;
        $scope.clearSearchTerm = function() {
        $scope.searchTerm = '';
        };
        // The md-select directive eats keydown events for some quick select
        // logic. Since we have a search input here, we don't need that logic.
        $element.find('input').on('keydown', function(ev) {
            ev.stopPropagation();
        });
           
        $scope.changeArea = function(city){
        	$scope.allareas = undefined;
        	searchService
	  		.getAreas(city)
	  		.then(
	  			function(resp) {
	  				$scope.areas = resp.data.responseBody.metaData.aggregations[0].aggregationValues;
	  				 $scope.allareas = loadareas($scope.areas);
	  				
	  			}, function(error) {
	  				// TODO
	  			});
        }
    
	
	$scope.init =  function (){
		utils.getErrors().then(function(errors){
			 $scope.errors =  errors.data;
		 });
		
	};

	
	$scope.init();

}