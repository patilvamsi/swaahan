'use strict'

/**
 * 
 */

var AppContoller = angular.module('CallCenterApp.RestaurantDetailController', []);

AppContoller.controller('RestaurantDetailController',['$scope', '$rootScope', '$state', '$stateParams', '$filter', '$mdDialog', 'restaurantDetailService', 'utils',
                  									'restaurantDetailFactory', 'bookingService', 'commonBookingFactory', 'buffetFactory','ngCart',RestaurantDetailController] );

function RestaurantDetailController($scope, $rootScope, $state, $stateParams, $filter, $mdDialog, restaurantDetailService, utils,
									restaurantDetailFactory, bookingService, commonBookingFactory, buffetFactory,ngCart){
	
	$scope.init = init;
	$scope.getBasicRestaurantDetails = getBasicRestaurantDetails;
	$scope.getTimeSlot = getTimeSlot;
	$scope.setTimeSlot = setTimeSlot;
	/*$scope.checkForTime = isTimeSelected;*/
	$scope.checkForTime = checkForTime;
	$scope.getAvailableDays = getAvailableDays;
	$scope.getAvailableDay = getAvailableDay;
	$scope.showEventDialog = showEventDialog;
	$scope.getEachDayTiming = getEachDayTiming;
	$scope.validateBuffetTime = validateBuffetTime;
	$scope.getService = getService;
	$scope.isHighlight = isHighlight;
	$scope.getHighlightDetails = getHighlightDetails;
	$scope.setDateOfBooking = setDateOfBooking;
	$scope.getTheAlacarteVoucher = getTheAlacarteVoucher;
	$scope.isValidVoucherToShowIfAlacarteInCart = isValidVoucherToShowIfAlacarteInCart;
	$scope.isValidEventToShowIfAlacarteInCart = isValidEventToShowIfAlacarteInCart;
	$scope.selectedDate='';
	$scope.date = new Date();
	$scope.resetUserSelection = resetUserSelection;
	$scope.validateDateAndTime=validateDateAndTime;
	$scope.cakepopUp = cakepopUp;
	$scope.timeSlotSelected = false;
	/*$scope.isValidEventToShowIfAlacarteInCart = isValidEventToShowIfAlacarteInCart;
	$scope.isValidVoucherToShowIfAlacarteInCart = isValidVoucherToShowIfAlacarteInCart;*/
	
	  function checkForTime(){
		   if(utils.isNullAndEmpty(commonBookingFactory.getTime()))
			   return false;
		   else
			   return true;
	   }
	
	$scope.minDate = new Date(
			$scope.date.getFullYear(),
			$scope.date.getMonth(),
			$scope.date.getDate()
		).toString();
	function setDateOfBooking(date,event){
		var date=new Date(date);
		commonBookingFactory.setDate(date);
		commonBookingFactory.setTime(event.eventStartTime);
		var result='';
		if(event.startEventDate===event.endEventDate && event.partyType[0]==='Event')
			{result = utils.checkDateInBetween(event.startEventDate,event.endEventDate,new Date(date.getFullYear(),date.getMonth(),date.getDate()));}//exceptional case same startdate and enddate
		else{result=utils.checkDateInBetween(event.startEventDate,event.endEventDate,new Date(date.getFullYear(),date.getMonth(),date.getDate(),5,30,0));}
		if(result){
			var dateDay='';
			if(date.getDay().toString()==='0'){dateDay='7';}//for converting universal week sun=0,evfweek=7
			else{dateDay=date.getDay().toString();}
			if(event.days.indexOf(dateDay) >= 0 || event.days.indexOf("8") >= 0){
				$('#dateselection').focus();
				$('.errorDivDate').html("");
			}else{
				$('#dateselection').focus();
				$('.errorDivDate').html("Event "+ $rootScope.errors.NOT_PRESENT_ON_SELECTED_DATE);
			}
		}else{
			$('#dateselection').focus();
			$('.errorDivDate').html("Event "+ $rootScope.errors.NOT_PRESENT_ON_SELECTED_DATE);
		}
	}
	$scope.timeSlotSelected = false;
	//To reset the date & time & other user selected details
	function resetUserSelection(){
		commonBookingFactory.init();
		ngCart.removeAlacarteVoucherFromCart();
		$scope.selectedTime = undefined;
		$scope.selectedDate = undefined;
		$scope.timeSlotSelected = false;
		$scope.buffetSleak = false;
		/*$scope.selectedDateNew=undefined;*/
		$scope.timedetails = undefined;
		$scope.selectedDate=null;
		$('#selectedDate').val('');
		$('#selectedTime').val('');
		$scope.showAlacarte = true;
		$scope.showOffersHeading=true;
		$scope.selectquantityError = "";
		$rootScope.$broadcast('makeDateEmpty:change', {});
		$rootScope.$broadcast('makeDateAndTimeEmpty:change', {});
		$(".errorDivTime").html("");
		$(".errorDivDate").html("");
		$(".errorDivForNotAddingInCart").html("");
		
	}
	//To validate Date & Time on clicking on buffet or group voucher	
	function validateDateAndTime(clickedButton) {
		
		
			$(".errorDivTime").html("");
			$(".errorDivDate").html("");
			
				if(utils.isNullAndEmpty(commonBookingFactory.getDate())){
					$mdDialog.show(
				   		      $mdDialog.alert()
				   		        .parent(angular.element(document.body))
				   		        .clickOutsideToClose(true)
				   		        .title('Date Selection Error')
				   		        .textContent('Please Select Date.')
				   		        .ariaLabel('Please Select Date.')
				   		        .ok('OK')
				   		        .targetEvent(null)
				   		 );
					$('html, body').animate({
					     scrollTop: $(".gotToDatePicker").offset().top-50
					       }, 800);
					$('.errorDivDate').html($rootScope.errors.SELECT_DATE);
					$(".errorDivTime").html("");
					return false;
				}else if(utils.isNullAndEmpty(commonBookingFactory.getTime())){
					$mdDialog.show(
			   		      $mdDialog.alert()
			   		        .parent(angular.element(document.body))
			   		        .clickOutsideToClose(true)
			   		        .title('Time Selection Error')
			   		        .textContent('Please Select Time.')
			   		        .ariaLabel('Please Select Time.')
			   		        .ok('OK')
			   		        .targetEvent(null)
			   		 );
					$('html, body').animate({
					     scrollTop: $(".gotToDatePicker").offset().top-100
					       }, 800);
					
					
					$('.errorDivTime').html($rootScope.errors.SELECT_TIME);
					$(".errorDivDate").html("");
					return false;
				}else{
					if(clickedButton==='Buffet'){
						if(commonBookingFactory.getGroupVoucherBtnSelected())
							commonBookingFactory.setGroupVoucherBtnSelected(false);
						if(commonBookingFactory.getAlaCarteBtnSelected())
							commonBookingFactory.setAlaCarteBtnSelected(false);
						commonBookingFactory.setBuffetBtnSelected(!commonBookingFactory.getBuffetBtnSelected());
						
						$('html, body').animate({
						     scrollTop: $("#chooseOffer").offset().top-100
						       }, 800);
					}
					else if(clickedButton==='GroupVoucher'){
						if(commonBookingFactory.getBuffetBtnSelected())
							commonBookingFactory.setBuffetBtnSelected(false);
						if(commonBookingFactory.getAlaCarteBtnSelected())
							commonBookingFactory.setAlaCarteBtnSelected(false);
						commonBookingFactory.setGroupVoucherBtnSelected(!commonBookingFactory.getGroupVoucherBtnSelected());
						
						$('html, body').animate({
						     scrollTop: $(".offers-heading").offset().top-100
						       }, 800);
					}	
					
					return false;
				}
			}
	var scrollPosition = 0;
	var  scrollWidth = 0;
	var clientWidth = 0;
	var scrollLeft = 0;
	
	$scope.scrollTillActive = function(){
		scrollWidth = $(".timeslot-columns")[0].scrollWidth;
		clientWidth = $(".timeslot-columns")[0].clientWidth;
		scrollLeft = $(".timeslot-columns")[0].scrollLeft;
		var offsetLeft=$(".timeslot-columns")[0].offsetLeft;
		scrollPosition = ($("#active").offset().left-300)
		$(".timeslot-columns").scrollLeft(scrollPosition,100);		
		
		if(offsetLeft  > 0){	
			$(".timeslot-prev-btn").hide();
		}
		if((scrollWidth - clientWidth) - offsetLeft < 0){
			$(".timeslot-next-btn").hide();
		}		
		
	}
	
	$scope.scrollLeft = function(){
		scrollWidth = $(".timeslot-columns")[0].scrollWidth;
		clientWidth = $(".timeslot-columns")[0].clientWidth;
		scrollLeft = $(".timeslot-columns")[0].scrollLeft;		
			
			if(scrollLeft >0){
				scrollPosition = scrollPosition - 500;
				$(".timeslot-columns").scrollLeft(scrollPosition,500);
			}
			if(scrollLeft -500 < 0){	
				$(".timeslot-prev-btn").hide();
				$(".timeslot-next-btn").show();
			}else
				{
					$(".timeslot-next-btn").show();
				}
			
	}
	$scope.scrollRight = function(){
		scrollWidth = $(".timeslot-columns")[0].scrollWidth;
		clientWidth = $(".timeslot-columns")[0].clientWidth;
		scrollLeft = $(".timeslot-columns")[0].scrollLeft;		
		
		if(scrollLeft < scrollWidth - clientWidth){
			scrollPosition = scrollPosition + 500;
			$(".timeslot-columns").scrollLeft(scrollPosition,500);
		}
		
		if(scrollLeft+ 500 >(scrollWidth - clientWidth)){
			$(".timeslot-next-btn").hide();
			$(".timeslot-prev-btn").show();
		}
		else
			$(".timeslot-prev-btn").show();		
	}
	$scope.buffetSleak=false;
	$scope.offerSleak=false;
	$scope.eventSleak=false;
	$scope.toggleSleak=function(sleakType){
		if(sleakType!=null &&sleakType!=undefined && sleakType==='buffet'){
			$scope.buffetSleak=!$scope.buffetSleak;
			$('html, body').animate({
			     scrollTop: $("#chooseOffer").offset().top-100
			       }, 800);
		}
		if(sleakType!=null &&sleakType!=undefined && sleakType==='event'){
			$scope.eventSleak=!$scope.eventSleak;
			$('html, body').animate({
			     scrollTop: $("#chooseEvents").offset().top-100
			       }, 800);
		}
		if(sleakType!=null &&sleakType!=undefined && sleakType==='offer'){
			$scope.offerSleak=!$scope.offerSleak;
		}
	}
	$scope.getBookingType=function(slots,type){
		var value=false;
		var value1=true;
		angular.forEach(slots,function(slot){
			if(slot.bookingType === type && value1){
				value=true;
				value1=false;			  
			}				
		})
		return value;
	}
	
	
	
	function getHighlightDetails(highlight){
		return utils.getHighlightDetails(highlight.toLowerCase());
	}
	
	function isHighlight(highlight){
		return utils.isHighlightNotService(highlight.toLowerCase());
	}
	
	function getService(checkListArray , elementToCheck){
		try{
			var temp = (JSON.stringify(checkListArray)).toLowerCase();
			checkListArray = JSON.parse(temp); 
			
			if(utils.isNullAndEmpty(checkListArray[elementToCheck.toLowerCase()])) {
				return false;
			}else{
				if(checkListArray[elementToCheck.toLowerCase()].toLowerCase() === 'no')
					return false;
				else
					return true;
			}
		}catch(e){
			return false;
		}
	}
	
	function getBasicRestaurantDetails(restaurantDetail){
		return restaurantDetailFactory.getBasicRestaurantDetails(restaurantDetail);
	}
	
	function getTheAlacarteVoucher(alacarteVoucher, sectionInfos){
		 if(alacarteVoucher){
		if(utils.isNotNullAndEmpty(sectionInfos))
			alacarteVoucher.sectionInfos = sectionInfos;
		else
			alacarteVoucher.sectionInfos = [];
		 }
		return alacarteVoucher;
	}
	
	function showEventDialog(event){
		$scope.eventData = event;
		$mdDialog.show({
			  scope : $scope.$new(),
		      templateUrl: 'callcenter/common/eventDetail.html',
		      parent: angular.element(document.body),
		      clickOutsideToClose:true,
		      animate: 'full-screen-dialog',
		    })	
	}
	
	function cakepopUp(cakes){
		$scope.cakes = cakes[0];
		$mdDialog.show({
			  scope : $scope.$new(),
		      templateUrl: 'callcenter/common/cakedetails.html',
		      parent: angular.element(document.body),
		      clickOutsideToClose:true,
		      animate: 'full-screen-dialog',
		    })	
	}

	function validateBuffetTime(voucher,pagetype){
		//return buffetFactory.validateBuffetTime(voucher,pagetype);
		   commonBookingFactory.setRestaurantId($scope.restId);
		   var isValidBuffet =  buffetFactory.validateBuffetTime(voucher,pagetype);
		    if(isValidBuffet){
		    	if(!(voucher.offlineVoucher === 1+"" || voucher.voucherType.indexOf("generalVoucher")>=0 || voucher.voucherType.indexOf("groupVoucher") >=0 )){
			    	$scope.showBuffetHeading = true;
		    	}
		    	else{
		    		$scope.showOffersHeading=true;
		    	}
		    	if(voucher.voucherType.indexOf('groupVoucher')>=0){
		    		$scope.presentGroupVoucher=true;
		    		$scope.showOffersHeading=true;
		    	}
		    }
		    return isValidBuffet && $scope.isValidVoucherToShowIfAlacarteInCart(voucher,pagetype);
	}

	
	/**
	 * added by VIPUL KUMAR
	 * if user is going to book for restaurant and is having alacarte in his cart
	 * then only offline vouchers will be shown
	 */
  function isValidVoucherToShowIfAlacarteInCart(voucher,pagetype){
   	if(pagetype && pagetype === 'profile' && ngCart.getCartFor() === 'restaurant'
   		&& ngCart.getCartFor() === 'restaurant' && ngCart.getItems()[0]._voucher.restaurantId===voucher.restaurantId){
   		$scope.showOffersHeading=true;
		if(ngCart.getItems()[0]._voucherType === 'alacarte'){
			$scope.showBuffetHeading = false;
			if(voucher.offlineVoucher === 1+"")
				return true;
			else
				return false;
		}else{
			return true;
		}
   	}else{
   		return true;
   	}
  }
  /** 
	 * added by VIPUL KUMAR
	 * if user is going to book for restaurant and is having alacarte in his cart
	 * then only Free Event will be shown
	 */
	function isValidEventToShowIfAlacarteInCart(event,pagetype){
	   	if(pagetype && pagetype === 'profile' && ngCart.getCartFor() === 'restaurant'
	   		&& ngCart.getCartFor() === 'restaurant' && ngCart.getItems()[0]._voucher.restaurantId===event.restaurantId){
			if(ngCart.getItems()[0]._voucherType === 'alacarte'){
				$scope.showBuffetHeading = false;
				if(event.freeEvent === "yes")
					return true;
				else
					return false;
			}else{
				return true;
			}
	   	}else{
	   		return true;
	   	}
	  }
	
	
	function getEachDayTiming(availability,day){
		return utils.getEachDayTiming(availability,day);
	}
	
	function getAvailableDays(availability) {
		return utils.getAvailableDays(availability);
	}
	
	function getAvailableDay(days, value){
		return utils.checkValueInArray(days, 8) || utils.checkValueInArray(days, value);
	}
	
	function getTimeSlot(timeOfBooking,restaurantId){
		$scope.showBuffetHeading = false;
		   $scope.presentGroupVoucher=false;
		   $scope.showOffersHeading=false;
		$scope.restId=restaurantId;
		var timeOfBooking=new Date(timeOfBooking);
		$scope.selectedDate = timeOfBooking;
		$scope.selectedDateNew=timeOfBooking;
		$scope.$parent.selectedDate = timeOfBooking;
		bookingService.getTimeSlots(restaurantId,timeOfBooking).then(
				function(resp) {
					$scope.timedetails = resp.data.responseBody.data.timeSlotList;
					$(".errorDiv").html("");
					$(".errorDivDate").html("");
					$scope.dateSelected = true;
					commonBookingFactory.setTime($scope.selectedTime);					
					commonBookingFactory.setDate($rootScope.selectedDate);
				},
				function(error){
				});
	   $scope.selectedTime = undefined;
	   $scope.timeSlotSelected = true;
	   commonBookingFactory.setTime($scope.selectedTime);		
	   commonBookingFactory.setDate(timeOfBooking);
	   commonBookingFactory.setRestaurantId(restaurantId);
	}
	$scope.getEventTimeslots = function(event,timeOfBooking){
		$(".errorDivDate").val("");
		$(".errorDivTime").val("");
		var timeOfBooking=new Date(timeOfBooking);
		$scope.selectedDate = timeOfBooking;
		commonBookingFactory.setDate(timeOfBooking);
		$scope.$parent.selectedDate = timeOfBooking;
		$scope.selectedTime = undefined;
		$scope.timeSlotSelected = true;
		
		commonBookingFactory.setTime($scope.selectedTime);
		var result = utils.checkDateInBetween(event.startEventDate,event.endEventDate,new Date(timeOfBooking.getFullYear(),timeOfBooking.getMonth(),timeOfBooking.getDate(),5,30,0));
		  var checkDays=utils.checkDays(event,new Date(timeOfBooking.getFullYear(),timeOfBooking.getMonth(),timeOfBooking.getDate()))
		if(result && checkDays){
			if(event.eventSeatingType != 'SingleSeating' ){
			bookingService.getEventTimeSlots(event.id,timeOfBooking).then(
				function(resp) {
					$scope.eventtimeslots = resp.data.responseBody.data.timeSlotList;
					$(".errorDiv").html("");
					$(".errorDivDate").html("");
					$('.errorDivTime').html("");
					$scope.dateSelected = true;
				},
				function(error){
				});
			}
		}else{
			$('#dateselection').focus();
			$('.errorDivDate').html("Event "+ $rootScope.errors.NOT_PRESENT_ON_SELECTED_DATE);
			$('.errorDivTime').html("");
			$scope.eventtimeslots = undefined;
		}
	}
	function setTimeSlot(slot,tableStatus){
		$scope.showBuffetHeading = false;
		$scope.presentGroupVoucher=false;
		$scope.showOffersHeading=false;
		   $(".errorDivTime").html("");
		   $(".errorDivDate").html("");
	   $scope.selectedTime = slot;
	   $scope.timeSlotSelected = true;
	   $scope.buffetSleak = true;
	   commonBookingFactory.setTime(slot);
	   commonBookingFactory.setTableStatus(tableStatus);
	   /*commonBookingFactory.setDate($scope.selectedDateNew);*/
	   $scope.showAlacarteOrNot($scope.restaurantDetail.alacarte,'profile');
	   
	}
	
	$scope.showAlacarteOrNot = function(voucher,pagetype){
		   $scope.showAlacarte = false; 
		   angular.forEach(voucher,function(v){
			   if( buffetFactory.validateBuffetTime(v,pagetype)){
				   $scope.showAlacarte = true;
			   }
	    	});
		}
	
	function isTimeSelected(){
		 if(utils.isNullAndEmpty(commonBookingFactory.getTime()))
			   return false;
		   else
			   return true;
	}
	//Added By Bhaskar need to removw if GV is working fine
	/*angular.forEach($scope.restaurantDetail.offer,function(eachOffer,index1){
		if(eachOffer.voucherType!=undefined&&eachOffer.voucherType.includes("groupVoucher")){
	$scope.presentGroupVoucher=true;
	}else if($scope.presentGroupVoucher!=true){
		$scope.presentGroupVoucher=false;	
	}	
	});*/
	
	function init(){
		
		
		$scope.commonBookingFactory = commonBookingFactory;
		$scope.showBuffetHeading = true;
		 $scope.showAlacarte=true;
		 $scope.restaurantDetail=true;
		 $scope.showOffersHeading=true;
		
		$scope.todaysDay = utils.getTodaysDay();
		
		var restaurantName = $stateParams.name;
		var restaurantId = $stateParams.id;
		$scope.restaurantIdInScope = $stateParams.id;
		
		restaurantDetailService.getRestaurantDetail(restaurantId).then(
			function(response){
				$scope.restaurantDetail = response.data.responseBody.data.restaurantDetails[0];
				$scope.alacarteData = getTheAlacarteVoucher($scope.restaurantDetail.alacarte[0],$scope.restaurantDetail.sectionInfos); 
				
				if(utils.isNotNullAndEmpty($scope.restaurantDetail.buffet)){
					  angular.forEach($scope.restaurantDetail.buffet,function(eachbuffet,index,array){
						
							angular.forEach(eachbuffet.ticket,function(eachticket,index2,array){
								if(eachticket.status === 'inactive' || eachticket.status === 'Inactive'){
									$scope.restaurantDetail.buffet[index].ticket.splice(index2,1);
								}
							})
					  })
							
				  }
				 commonBookingFactory.init();
				 
				$scope.basicRestaurantDetail = getBasicRestaurantDetails($scope.restaurantDetail);
				$scope.$digest();
			},function(error){
			
		});
		
		restaurantDetailService.getRestaurantContactNumbers(restaurantId).then(
			function(response){
				$scope.restaurantContactInfos = response.data.responseBody.data.callcenter;
			},
			function(err){
				
			}
		);
		
	}
	
	init();
	
}

