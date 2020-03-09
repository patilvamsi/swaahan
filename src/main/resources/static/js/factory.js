/**
 * 
 */

'use strict';

var AppFactory = angular.module('SwaahanApp');

AppFactory.factory("constants", constants);
AppFactory.factory("utils",['$filter', '$dateParser','$http', 'constants', utils]);
AppFactory.factory("requestFactory",['utils', requestFactory] );
AppFactory.factory("store",['$window', store]);
AppFactory.factory("sessionStore",['$window', sessionStore]);
AppFactory.factory("restaurantDetailFactory",['store',restaurantDetailFactory] );
AppFactory.factory("resortDetailFactory", [ 'store', resortDetailFactory ]);
AppFactory.factory("commonBookingFactory", [ '$rootScope', 'store', 'utils', commonBookingFactory ]);
AppFactory.factory("buffetFactory", ['$dateParser', 'commonBookingFactory', 'utils', buffetFactory]);
AppFactory.factory('ngCartItem', ['$rootScope', '$log', 'utils','commonBookingFactory', ngCartItem]);
AppFactory.factory('Account', ['$http', 'store', Account]);
AppFactory.factory('customToast', ['$mdToast', 'utils', customToast]);
AppFactory.factory('tableBookingFactory',['store', '$rootScope', tableBookingFactory] );
AppFactory.factory('resortBookingFactory', ['store', '$rootScope', resortBookingFactory]);
AppFactory.factory('agentFactory',['store', agentFactory]);
AppFactory.factory('enquiryFactory',[enquiryFactory]);
AppFactory.factory('bequetFactory',['$http',bequetFactory]);
function bequetFactory($http){
	
	function getPartyType(){
		return ['New Year Party','Out Bounds Party','Recognition Party','Retirement Party','Send Off Party','Team Outing','Welcome Party','Year End Party','Others'];
	}
	function getmealType(){
		return [{id:'1',name:'Lunch'},{id:'2',name:'Dinner'},{id:'3',name:'Others'},{id:'4',name:'None'}];
	}
	function getRequirements(){
		return [{id:'1',name:'Catering'},{id:'1',name:'Party Hall'},{id:'1',name:'Both'},{id:'1',name:'None'}];
	}
	function getTime(){
		return ['01 AM','02 AM','03 AM','04 AM','05 AM','06 AM','07 AM','08 AM','09 AM','10 AM','11 AM','12 AM','01 PM','02 PM','03 PM','04 PM','05 PM','06 PM','07 PM','08 PM','09 PM','10 PM','11 PM','12 PM'];
	}

	return{
		getPartyType : getPartyType,
		getmealType   : getmealType,
		getRequirements : getRequirements,
		getTime : getTime,
	}
}
function requestFactory(utils){
	
	this.generateBasicRequest = function(){
		
		var request = {
				query : "",
				filterRequests : [],
				childFilterRequests : [],
				aggregationRequests : []
		};
		
		return request;
	}
	
	this.addFilterRequest = function(request,attributeName,attributeValue,attributeValues){
		if(utils.isNullAndEmpty(request))
			request = this.generateBasicRequest();
		
		if(utils.isNullAndEmpty(request.filterRequests))
			request.filterRequests = [];
		
		if(utils.isNullAndEmpty(attributeValues))
			attributeValues = [];
		
		if(utils.isNullAndEmpty(attributeValue))
			attributeValue = undefined;
		
		request.filterRequests.push({
			'attributeName' : attributeName,
			'attributeValue' : attributeValue,
			'attributeValues' : attributeValues
		});
		
		return request;
	}
	
	this.addChildFilterRequest = function(request,attributeName,attributeValue,attributeValues){
		if(utils.isNullAndEmpty(request))
			request = this.generateBasicRequest();
		
		if(utils.isNullAndEmpty(request.childFilterRequests))
			request.childFilterRequests = [];
		
		if(utils.isNullAndEmpty(attributeValues))
			attributeValues = [];
		
		if(utils.isNullAndEmpty(attributeValue))
			attributeValue = undefined;
		
		request.childFilterRequests.push({
			'attributeName' : attributeName,
			'attributeValue' : attributeValue,
			'attributeValues' : attributeValues
		});
		
		return request;
	}
	
	this.addAggregationRequest = function(request,attributeName,label,limit){
		if(utils.isNullAndEmpty(request))
			request = this.generateBasicRequest();
		
		if(utils.isNullAndEmpty(request.aggregationRequests))
			request.aggregationRequests = [];
		
		if(utils.isNullAndEmpty(limit))
			limit = 1000;
		
		if(utils.isNullAndEmpty(label))
			label = undefined;
		
		request.aggregationRequests.push({
			'attributeName' : attributeName,
			'label' : label,
			'limit' : limit
		});
		
		return request;
	}
	
	return this;
}

function constants(){
	
    this.servicesArray = ['homedelivery','drinks','aircondition','catering','takeaway','kidsallowed','restaurantid']; 
	
    this.tableStatusMap = {
		'ConfirmedBooking' :'Confirmed Booking',
		'NoBooking' : 'Not Available',
		'N/A' : 'Not Available',
		'FirstComeFirstServe' : 'First Come First Serve',
		'PriorityBooking' : 'Prior Booking'
	}
    
    this.dayIntegerMappingToString = {
	     1 :  "Mon",
		 2 :  "Tue",
		 3 :  "Wed",
		 4 :  "Thu",
		 5 :  "Fri",
		 6 :  "Sat",
		 7 :  "Sun",
		 8 :  "All Days"
	}
    
    this.servicesAndHighlightsMap = {
    		
		"homedelivery" : "Home Delivery",
		"drinks" : "Liquor Available",
		"aircondition" : "Air Conditioned",
		"catering" : "Catering",
		"takeaway" : "Take Away",
		"kidsallowed" : "Kids Allowed",
		"candlelightdinner" : "Candlelight Dinner",
		"hookah" : "Hookah",
		"rooftop" : "Roof Top",
		"livemusic" : "Live Music",
		"poolsidedining" : "Poolside Dining",
		"gardenrestaurant" : "Garden Restaurant",
		"sportsbar" : "Sports Bar",
		"latenightopen" : "LateNight Open",
		"themerestaurant" : "Theme Restaurant",
		"bigscreen" : "Big Screen",
		"halalfriendly" : "Halal Friendly",
		"jainfood" : "Jain Food",
		"romantic" : "Romantic",
		"infivestar" : "In 5-Star",
		"dancefloor" : "Dance Floor",
		"privatedining" : "Private Dining",
		"seafacing" : "Sea Facing",
		"alfresco" : "Alfresco",
		"microbrewery" : "Micro Brewery",
		"restrobar" : "Restro Bar",
		"pubsandlounges" : "Pubs & Lounges",
		"liftavailable" : "Lift Available",
		"beeravail" : "Beer Available",
		"craftbeer" : "Craft Beer",
		"wifi" : "Wifi Available",
		"petfriendly" : "Pet Friendly",
		"wineavail" : "Wine Available",
		"smoking" : "Smoking",
		"babychairavailable" : "High Chair",
		"wheelchairavailable" : "Disable Friendly",
		"24_7open" : "24/7 Open",
		"breakfast" : "Breakfast",
		"barbeque" : "Barbeque",
		"biryani" : "Biryani",
		"biztalk" : "BIZ Talk",
		"cigarfriendly" : "Cigar Friendly",
		"dancing" : "Dancing",
		"dimsum" : "Dimsum",
		"ghazals" : "Ghazals",
		"italian" : "Italian",
		"kebabs" : "Kebabs",
		"meals_thali" : "Meals/Thali",
		"momos" : "Momos",
		"outsidecatering" : "Outside Catering",
		"pizza" : "Pizza",
		"sushi" : "Sushi",
		"sizzlers" : "Sizzlers",
		"spaghetti" : "Spaghetti",
		"trendy" : "Trendy",
		"tequila" : "Tequila",
		"tea_coffee" : "Tea/Coffee",
		"wholedaydining" : "Whole Day Dining",
		"cocktails" : "Cocktails"
	}
    
    return this;
}

function utils($filter, $dateParser,$http, constants){
	var element = [];
	
	 var index ;
	 
	 this.getIndex = function getIndex() {
	        return index;
	    };

	    this.setIndex = function setIndex(val) {
	    	index = val;
	    };
	    this.getWeekDay = function getWeekDay(day){
			switch(day){
			case 1 : return "Mon";
			case 2 : return "Tue";
			case 3 : return "Wed";
			case 4 : return "Thu";
			case 5 : return "Fri";
			case 6 : return "Sat";
			case 7 : return "Sun";
			case 8 : return "All Days";
			}
		}  
    this.getElements = function getElements() {
        return element;
    };

    this.setElements = function setElements(val) {
  	  element = val;
    };
	
	this.getDayValueFromInteger = function(day){
		return constants.dayIntegerMappingToString[day];
	}
	
	this.getAllDays = function(availability){
		var days = [];
		var allDays = [1,2,3,4,5,6,7];
		if(this.isNotNullAndEmpty(availability) && availability.length > 0 ){
			for (var i = 0; i < availability.length; i++) {
				if(days.indexOf(availability[i].day) < 0)
					days.push(availability[i].day);
			}
		}
		if(days.indexOf(8) > -1){
			return allDays;
		}else{
			return days;
		}
	}
	
	this.isHighlightNotService = function(highlight){
    	try{
    		if(this.isNullAndEmpty(constants.servicesAndHighlightsMap[highlight.toLowerCase()]))
        		return false;
        	else{
        		if(constants.servicesArray.indexOf(highlight.toLowerCase()) === -1)
        			return true;
        		else
        			return false;
        	}
    	}catch(e){
    		return false;
    	}
    }
	
	this.getHighlightDetails = function(highlight){
    	return constants.servicesAndHighlightsMap[highlight];
    }
	
    this.getShowingValueForHighlights = function(value){
    	return constants.servicesAndHighlightsMap[value.toLowerCase];
    }
	
	this.getAvailableDays = function(availability) {
		var availableDays = [];
		if(availability != undefined)
		for (var i = 0; i < availability.length; i++) {
			availableDays.push(availability[i].day);
		}
		return availableDays;
	};
	
    this.checkDateInBetween = function(startDate,endDate,selectedDate){/*
    	if(this.isNotNullAndEmpty(startDate)){
    		var startDateFormatted;
    		if(typeof(startDate) === "number")
    			startDateFormatted = new Date(startDate-19800000);//by default 5:30 hrs added to time ,so sub 5:30hrs
    		else
    			startDateFormatted = $dateParser(startDate,'yyyy-MM-dd');

    		if(this.isNotNullAndEmpty(endDate)){
    			
    			var endDateFormatted;
    			if(typeof(endDate) === "number")
    				endDateFormatted = new Date(endDate+66300000);
    			else
    				endDateFormatted = $dateParser(endDate,'yyyy-MM-dd');
    			if(selectedDate.getTime() >= startDateFormatted.getTime() && selectedDate.getTime() <= endDateFormatted.getTime())
    				return true;
    			else
    				return false;
    		}else{
    			if(selectedDate.getTime() >= startDateFormatted.getTime())
    				return true;
    			else
    				return false;
    		}
    	}else{
    		return true;
    	}
    */

    	if(!this.isNullAndEmpty(startDate)){
    		var startDateFormatted;
    		if(typeof(startDate) === "number")
    			startDateFormatted = new Date(startDate-19800000);//by default 5:30 hrs added to time ,so sub 5:30hrs
    		
    		else
    			startDateFormatted = $dateParser(startDate,'yyyy-MM-dd');

    		if(!this.isNullAndEmpty(endDate)){
    			
    			var endDateFormatted;
    			if(typeof(endDate) === "number")
    				endDateFormatted = new Date(endDate+66300000);
    			else
    			{endDateFormatted = $dateParser(endDate,'yyyy-MM-dd'); endDateFormatted=new Date(endDateFormatted.getTime()+66300000) ;}
    			if(selectedDate.getTime() >= startDateFormatted.getTime() && selectedDate.getTime() <= endDateFormatted.getTime())
    				return true;
    			else
    				return false;
    		}else{
    			if(selectedDate.getTime() >= startDateFormatted.getTime())
    				return true;
    			else
    				return false;
    		}
    	}else{
    		return true;
    	}
    	
    }
   this.checkDays = function(event,selectedDate){
	   var selectedDay = selectedDate.getDay();
	   if(selectedDay === 0){
		   selectedDay = 7;
	   }
    	if(event.days.indexOf(selectedDay+"")>-1)
    		return true;
    	else if (event.days.indexOf("8") >-1)
    		return true;
    	else 
    		return	false;
    }
    
	this.getTodaysDay = function(){
    	var date = new Date();
		var day = date.getDay();
		if(day===0){
			day = 7;
		}
		return day;
    }
	
	this.getEachDayTiming = function(availability,day){
		var dayAvailability = [];
		var error = ['Not Available'];
		try{
			angular.forEach(availability,function(available){
				if(available.day === parseInt(day) || available.day === 8 ){
					dayAvailability.push(available);
				}
			});
			return this.getFormatedTimings(dayAvailability);
		}catch(e){
			return error;
		}
	}
	
	this.getFormatedTimings = function(availability){
    	var time = "";
		 var timings = [] ;
		 for(var i=0;i<availability.length;i++) {
			 time = $filter('timeFormat24To12')(availability[i].startTime)
			 		+ " - " + $filter('timeFormat24To12')(availability[i].endTime);
			 if(timings.indexOf(time) === -1) {
				 timings.push(time);
				}
			}
       return timings;
    }
	
	this.changeDateFormat = function(datetime, currentFormat, newFormat){
		try{
			return $filter('date')($dateParser(availability[i].startTime,currentFormat), newFormat);
		}catch(e){
			return "";
		}
		
	}

	this.checkValueInArray = function(array, value){
		try{
			if (array.indexOf(value) >= 0 )
				return true;
			else
				return false;
		}catch(e){
			return false;
		}
	}
	
	this.convertTimeForJSONStringify = function(datetime){
		datetime.setHours(datetime.getHours()+5);
    	datetime.setMinutes(datetime.getMinutes()+30);
    	return datetime;
    }

    this.isNullAndEmpty = function(element){
    	if(element === undefined  || element === null || element === '' || element === "null") {
			return true;
		}else{
			return false;
		}
    }
    
    this.isNotNullAndEmpty = function(element){
    	return !this.isNullAndEmpty(element);
    }
    
    this.getErrors = function getErrors(){
    	return $http.get('/error.properties');
    }
    this.isInternetConnected = function isInternetConnected(){
    	//return $http.get('/evf-api/restaurant/fakeapi.json');
    	return $http.get('https://jsonplaceholder.typicode.com/posts/1');
    }
    return this;
}

function restaurantDetailFactory(store){
	
	this.$restaurantDetail = {};

	this.getBasicRestaurantDetails = function(restaurantDetail){
		var basicDetails = {};
		basicDetails.restaurantId = restaurantDetail.id;
		basicDetails.restaurantName = restaurantDetail.name;
		basicDetails.restaurantAddress = restaurantDetail.address;
		basicDetails.restaurantCity = restaurantDetail.city;
		basicDetails.tiedUp = restaurantDetail.tiedUp;
		basicDetails.booking = restaurantDetail.booking;
		return basicDetails; 
	}
	
	this.setRestaurantDetail = function(restaurantDetail){
		this.$restaurantDetail = restaurantDetail;
		store.set('restaurantDetail',this.$restaurantDetail);
	}
	
	this.getRestaurantDetail = function(){
		if(this.$restaurantDetail.id === undefined || this.$restaurantDetail.id === {} ||  this.$restaurantDetail.id === null) {
			this.setRestaurantDetail(store.get('restaurantDetail'));
		}
		return this.$restaurantDetail;
	}

	this.getRestaurantName = function() {
		return this.getRestaurantDetail().name;
	}

	this.getRestaurantId = function() {
		return this.getRestaurantDetail().id;
	}
	
	this.getRestaurantCity = function() {
		return this.getRestaurantDetail().city;
	}
	
	this.getRestaurantArea = function() {
		return this.getRestaurantDetail().area;
	}

	this.getRestaurantAddress = function() {
		return this.getRestaurantDetail().address;
	}

	this.getRestaurantBuffet = function() {
		return this.getRestaurantDetail().buffet;
	}

	this.getRestaurantEvent = function() {
		return this.getDetail().event;
	}
	
	this.reset = function(){
		this.$restaurantDetail = {};
	}
	
	return this;
}

function resortDetailFactory(store){
	
	this.getBasicResortDetails = function(resortDetails){
		var basicDetails = {};
		basicDetails.restaurantId = resortDetails.resortId;
		basicDetails.restaurantName = resortDetails.resortName;
		basicDetails.restaurantAddress = resortDetails.resortAddress;
		basicDetails.restaurantCity = resortDetails.resortCity;
		return basicDetails; 
	}
	
	return this;
}

function commonBookingFactory($rootScope, store, utils){
	
	this.getAlaCarteBtnSelected=getAlaCarteBtnSelected;
	this.setAlaCarteBtnSelected=setAlaCarteBtnSelected;
	this.setBuffetBtnSelected=setBuffetBtnSelected;
	this.getBuffetBtnSelected=getBuffetBtnSelected;
	this.setGroupVoucherBtnSelected=setGroupVoucherBtnSelected;
	this.getGroupVoucherBtnSelected=getGroupVoucherBtnSelected;
	this.getAddToCarteBtnSelected=getAddToCarteBtnSelected;
	this.setAddToCarteBtnSelected=setAddToCarteBtnSelected;
	
	function getAlaCarteBtnSelected(){
		return this.alaCarteBtnSelected;
	}
	function setAlaCarteBtnSelected(alaCarteBtnSelected){
			this.alaCarteBtnSelected=alaCarteBtnSelected;
		}
	function getBuffetBtnSelected(){
		return this.buffetBtnSelected;
	}
	function setBuffetBtnSelected(buffetBtnSelected){
		this.buffetBtnSelected=buffetBtnSelected;
	}
	function getGroupVoucherBtnSelected(){
		return this.groupVoucherBtnSelected;
	}
	function setGroupVoucherBtnSelected(groupVoucherBtnSelected){
		this.groupVoucherBtnSelected=groupVoucherBtnSelected;
	}
	function getAddToCarteBtnSelected(addToCarteBtnSelected){
		this.addToCarteBtnSelected=addToCarteBtnSelected;
	}
	function setAddToCarteBtnSelected(addToCarteBtnSelected){
		this.addToCarteBtnSelected=addToCarteBtnSelected;
	}
	
	
	
	this.init = function(){
		this.timings = {
			date : undefined,
			time : undefined,
			restaurantId : undefined,
			tableStatus : undefined,
			section : undefined
        };
		this.bookingTicket = null;
		this.cashbackDetails = [];
		this.setBuffetBtnSelected(false);
		this.setGroupVoucherBtnSelected(false);
		this.setAlaCarteBtnSelected(false);
		$rootScope.$broadcast('commonBookingFactory:change', {});
	}
	
	this.empty = function(){
		this.init();
	}
	
	this.setRestaurantId = function(restaurantId){
    	this.timings.restaurantId = restaurantId;
    	$rootScope.$broadcast('commonBookingFactory:change', {});
    }
	
    this.setDate = function(date){
    	this.timings.date = date;
    	$rootScope.$broadcast('commonBookingFactory:change', {});
    }
    
    this.setTime = function(time){
    	this.timings.time = time;
    	$rootScope.$broadcast('commonBookingFactory:change', {});
    }
    
    this.setTableStatus = function(tableStatus){
    	this.timings.tableStatus = tableStatus;
    	$rootScope.$broadcast('commonBookingFactory:change', {});
    }
    
    this.getTableStatus = function(){
    	return this.timings.tableStatus;
    }
    
    this.getDate = function(){
    	return this.timings.date;
    }
    
    this.getTime = function(){
    	return this.timings.time; 
    }
    
    this.getCashbackDetails = function(){
		return this.cashbackDetails;
	}
	
    this.resetCashbackDetails = function(){
		this.cashbackDetails = [];
	}
    
	this.getAppliedCouponDetails = function(id,bookingType){
		if(utils.isNullAndEmpty(this.cashbackDetails))
			this.resetCashbackDetails();
		for(var i=0;i<this.cashbackDetails.length;i++){
			if(this.cashbackDetails[i].bookingType === String(bookingType).toUpperCase() 
					&& this.cashbackDetails[i].bookingTypeId === parseInt(id)){
				return this.cashbackDetails[i];
			}
		}
		return false;
	}
	
	this.removeCashbackDetail = function(id,bookingType){
		if(utils.isNullAndEmpty(this.cashbackDetails))
			return false;
		
		for(var i=0;i<this.cashbackDetails.length;i++){
			if(this.cashbackDetails[i].bookingType === String(bookingType).toUpperCase() 
					&& this.cashbackDetails[i].bookingTypeId === parseInt(id)){
				this.cashbackDetails.splice(i,1);
				break;
			}
		}
		return false;
	}
	
	this.getTotalDiscount = function(){
		var discountAmount = 0;
		var discountArray = ['RESTDISCOUNT','EVFDISCOUNT'];
		if(utils.isNullAndEmpty(this.cashbackDetails)){
			return 0;
		}else{
			for(var i=0;i<this.cashbackDetails.length;i++){
				var cashbackDetail = this.cashbackDetails[i];
				angular.forEach(cashbackDetail.cashbackGivenDetails,function(cashbackGivenDetail){
					if(discountArray.indexOf(cashbackGivenDetail.couponCashType) > -1)
						discountAmount = discountAmount + cashbackGivenDetail.amountGiven;
				});
			}
		}
		return discountAmount;
	}
	
	this.getDiscountAmount = function(id,bookingType){
		var discountAmount = 0;
		var discountArray = ['RESTDISCOUNT','EVFDISCOUNT'];
		if(utils.isNullAndEmpty(this.cashbackDetails)){
			return 0;
		}else{
			for(var i=0;i<this.cashbackDetails.length;i++){
				var cashbackDetail = this.cashbackDetails[i];
				if(cashbackDetail.bookingType === String(bookingType).toUpperCase() 
						&& cashbackDetail.bookingTypeId === parseInt(id)){
					angular.forEach(cashbackDetail.cashbackGivenDetails,function(cashbackGivenDetail){
						if(discountArray.indexOf(cashbackGivenDetail.couponCashType) > -1)
							discountAmount = discountAmount + cashbackGivenDetail.amountGiven;
					});
					break;
				}
			}
		}
		return discountAmount;
	}
	
	this.addCashback = function(cashbackGiven){
		var isVoucherPresent = false;

		if(utils.isNullAndEmpty(this.cashbackDetails))
			this.resetCashbackDetails();
		
		for(var i=0;i<this.cashbackDetails.length;i++){
			if(this.cashbackDetails[i].bookingType === cashbackGiven.bookingType 
					&& this.cashbackDetails[i].bookingTypeId === cashbackGiven.bookingTypeId){
				isVoucherPresent = true;
				this.cashbackDetails[i] = cashbackGiven;
				console.log("Changed With Already Present");
			}
		}
		if(!isVoucherPresent)
			this.cashbackDetails.push(cashbackGiven);
		
		$rootScope.$broadcast('commonBookingFactory:cashbackDetails', {});
	}
	
	this.setBookingTicket = function(voucherId, ticketId, quantity, voucherType, ticketName, ticketPrice, voucherName) {
		var bookingTicket = {};
		bookingTicket.voucherId = voucherId;
		bookingTicket.ticketId = ticketId;
		bookingTicket.quantity = quantity;
		bookingTicket.voucherType = voucherType;
		bookingTicket.ticketName = ticketName;
		bookingTicket.amount = +parseFloat(quantity * ticketPrice).toFixed(2);
		bookingTicket.voucherName = voucherName; 
		
		return bookingTicket;
	}
	
	this.setSectionForBooking = function(section){
    	this.section = section;
		$rootScope.$broadcast('commonBookingFactory:change', {});
    }
	    
	this.getSectionForBooking = function(section){
    	return this.section;
    }
	
    this.$restore = function(){
    	if(this.timings === undefined ||  this.timings === null || this.timings === {}) {
    		this.timings = store.get('timings');
		}
    	this.$save();
    }
    
    this.$restoreCashbackDetails = function(){
    	if(this.cashbackDetails === undefined ||  this.cashbackDetails === null || this.cashbackDetails === {}) {
    		this.cashbackDetails = store.get('cashbackDetails');
		}
    	this.$save();
    }
    
    this.$saveCashbackDetails = function(){
    	store.set('cashbackDetails', this.cashbackDetails);
    }
    
    this.$save = function () {
        store.set('timings', this.timings);
    }
	
	return this;
}

function buffetFactory($dateParser, commonBookingFactory, utils) {

	this.validateBuffetTime = function(voucher, pagetype) {
		var availibility = voucher.availability;
		var selectedDate = undefined;
		var selectedTime = undefined;

		if (utils.isNotNullAndEmpty(commonBookingFactory.getDate())) {
			selectedDate = new Date(commonBookingFactory.getDate());

			if (utils.isNotNullAndEmpty(commonBookingFactory.getTime()))
				selectedTime = commonBookingFactory.getTime();
		}

		if (utils.isNullAndEmpty(selectedDate)) {
			return true;
		} else {
			if (utils.checkDateInBetween(voucher.startDate, voucher.endDate, selectedDate)) {
				var dayFromDate = selectedDate.getDay();
				if (dayFromDate === 0)
					dayFromDate = 7;

				var daysFromBuffet = utils.getAvailableDays(availibility);
				
				if (utils.checkValueInArray(daysFromBuffet, 8) || utils.checkValueInArray(daysFromBuffet, dayFromDate)) {
					var selectedTime = commonBookingFactory.getTime();
					// check if time slot selected otherwise show buffets of all
					// day
					if ( utils.isNullAndEmpty(selectedTime) ) {
						return true;
					} else {
						var indexDays = [];
						var loopForGettingIndex = true;
						var index = -1;

						while (loopForGettingIndex) {
							index = daysFromBuffet.indexOf(8, index + 1);
							if (index === -1)
								loopForGettingIndex = false;
							else
								indexDays.push(index);
						}

						loopForGettingIndex = true;
						while (loopForGettingIndex) {
							index = daysFromBuffet.indexOf(dayFromDate, index + 1);
							if (index === -1)
								loopForGettingIndex = false;
							else
								indexDays.push(index);
						}

						var isPresent = false;
						var i = 0;
						while (i < indexDays.length && !isPresent) {
							var indexToCheck = indexDays[i];
							var startTime = $dateParser( availibility[indexToCheck].startTime, 'HH:mm:ss');
							var endTime = $dateParser( availibility[indexToCheck].endTime, 'HH:mm:ss');
							var selectTime = $dateParser(selectedTime, 'HH:mm:ss');

							if (startTime > endTime) {
								if (selectTime >= startTime)
									return true;
							} else {
								if (selectTime >= startTime && selectTime <= endTime)
									return true;
							}
							i++;
						}

						if (!isPresent)
							return false;
					}
				} else
					return false;
			} else
				return false;
		}
	}

	return this;
}

function store($window){
	
	this.check = function(key){
		if ($window.localStorage [key]) {
            return true;
        }
        return false;
	}
	
	this.get = function (key) {
        if ($window.localStorage [key]) {
            var element = angular.fromJson($window.localStorage [key]);
            return JSON.parse(element);
        }
        return false;
    }
	
	this.remove = function (key) {
        if ($window.localStorage [key]) {
       	 $window.localStorage.removeItem(key);
           return true;
       }
       return false;
   }
	
	this.set = function (key, val) {

        if (val === undefined) {
            $window.localStorage.removeItem(key);
        } else {
            $window.localStorage [key] = angular.toJson(JSON.stringify(val));
        }
        return $window.localStorage [key];	
    }
	
	return this;
}

function ngCartItem($rootScope, $log, utils,commonBookingFactory){

	var item = function (id, name, voucher, voucherType, voucherParent) {
		this.setId(id);
        this.setName(name);
        this.setVoucher(voucher);
        this.setVoucherParent(voucherParent);
        this.setVoucherType(voucherType);
    };
	
    item.prototype.setId = function(id){
        if (id)  this._id = id;
        else {
            $log.error('An ID must be provided');
        }
    };

    item.prototype.getId = function(){
        return this._id;
    };
    
    item.prototype.setName = function(name){
        if (name)  this._name = name;
        else {
            $log.error('A name must be provided');
        }
    };
    
    item.prototype.getTickets = function(){
        return this._voucher.ticket;
    };
    
    item.prototype.getName = function(){
        return this._name;
    };
    
    item.prototype.setVoucher = function(voucher){
    	this._voucher = voucher;
    };
    
    item.prototype.getVoucher = function(){
        return this._voucher;
    };
    
    item.prototype.setVoucherParent = function(voucherParent){
    	this._voucherParent = voucherParent;
    };
    
    item.prototype.getVoucherParent = function(){
        return this._voucherParent;
    };
    
    item.prototype.setVoucherType = function(voucherType){
        if (voucherType) {
        	this._voucherType = voucherType;
        } else {
            $log.error('A Voucher Type must be provided');
        }
    };
    
    item.prototype.getVoucherType = function(){
        return this._voucherType;
    };
    
    item.prototype.setQuantity = function(quantity, id){
    	var ticket = this.getTicketById(id);

        var quantityInt = parseInt(quantity);
        if (quantityInt % 1 === 0){
        	ticket.quantity += quantityInt;
        	if(ticket.quantity<0) ticket.quantity = 0;
        	
        } else {
        	ticket.quantity = 0;
            $log.info('Quantity must be an integer and was defaulted to 0');
        }
        $rootScope.$broadcast('ngCart:change', {});
    };
    
    item.prototype.getVoucherQuantity = function(){
    	var quantity = 0;
    	angular.forEach(this.getTickets(), function (ticket) {
    		quantity += ticket.quantity;
        });
        return parseInt(quantity);
    }
    
    item.prototype.getDiscountOnVoucher = function(){
    	 return commonBookingFactory.getDiscountAmount(this.getId(),'voucher');
    }
    
    item.prototype.getVoucherTotalAfterDiscount = function(){
    	var amount = 0;
        angular.forEach(this.getTickets(), function (ticket) {
        	var price = parseInt(ticket.evfPrice);
        	amount += ticket.quantity * price;
        });
        var discount = this.getDiscountOnVoucher();
        return +parseFloat(amount - discount).toFixed(2);
    }
    
    item.prototype.getVoucherTotal = function(){
    	var amount = 0;
        angular.forEach(this.getTickets(), function (ticket) {
        	var price = parseInt(ticket.evfPrice);
        	amount += ticket.quantity * price;
        });
        return +parseFloat(amount).toFixed(2);
    };

    item.prototype.toObject = function() {
        return {
            id: this.getId(),
            name: this.getName(),
        }
    };

    return item;
}

function Account($http, store){
	
	this.setUser = function(user){
		return store.set('user', user);
	}
	
	this.getUser = function(){
		return store.get('user');
	}
	
	this.getProfile = function(){
		return $http.get('/profile');
	}
	
	this.updateProfile = function(profileData) {
		return $http.put('/profile', profileData);
    }
	
	return this;
}

function sessionStore($window){
	
	this.get = function (key) {
        if ($window.sessionStorage [key]) {
            var element = angular.fromJson($window.sessionStorage [key]);
            return JSON.parse(element);
        }
        return false;
    }
	
	this.set = function (key, val) {

        if (val === undefined) {
            $window.sessionStorage .removeItem(key);
        } else {
            $window.sessionStorage [key] = angular.toJson(JSON.stringify(val));
        }
        return $window.sessionStorage [key];
    }
	
	return this;
}

function customToast($mdToast, utils){
	
	this.last = {
      bottom: false,
      top: true,
      left: false,
      right: true
    }
	
	this.toastPosition = angular.extend({},this.last);
	
	this.showToast = function(message, toastTime){
		// toastTime in sec
		if(utils.isNullAndEmpty(toastTime)) {
			toastTime = 3;
		}
		var topn = angular.copy(this.toastPosition);
	    var pinTo = Object.keys(this.toastPosition)
	      .filter(function(pos) { return topn[pos]; })
	      .join(' ');
	    
	    $mdToast.show(
	      $mdToast.simple()
	        .textContent(message)
	        .position(pinTo)
	        .hideDelay(toastTime * 1000)
	    );
	  }
	
	return this;
}

function tableBookingFactory(store, $rootScope){
	
	this.init = function(){
        this.$bookinginfo = {
    		 bookingId: '',
    		 restaurantId: '',
    		 bookingType: 1,
    		 loginId: '',
    		 timeOfBooking: '',
    		 bookingServerTime: '',
    		 countPeople: '',
    		 status: '',
    		 bookingRefNo: '',
    		 userName: '',
    		 userEmailId: '',
    		 userContactNo: '',
    		 userSpecialRequest: '',
    		 exclusiveId: null,
    		 tableBookingWinner: 'No',
    		 adminInstructions: null,
    		 bookingMedia: 'Offline Booking',
    		 transactionAmount: 0,
    		 contactedPerson: null,
    		 contactedPersonNo: null,
    		 paymentGatewayStatus: null,
    		 isMailSent: null,
    		 restaurateursBookingStatus: null,
    		 dinnerPeople: null,
    		 dinnerAmount: null,
    		 ticketRefNo: null,
    		 changeStatusAdminId: null,
    		 closedBy: null,
    		 restaurantCity: '',
    		 recordingId: null,
    		 restaurantContactedPerson: null,
    		 dealReferenceNo: null,
    		 eventBookingType: 'TableBooking',
    		 checkInStatus: null,
    		 preBooking : null,
    		 tableBookingInfo : null,
    		 cashbackGivens : null,
    		 bookingTickets : null,
    		 eventId : null,
    		 eventName : null,
    		 tableStatus : null,
    		 callUuid : null
    		
        	};
        	
       this.tableBookingInfo = {
        	amount : '',
			totalAmount : '',
			cashbackUsed : '',
			transaction_status : '',
			gateway : 'Cashfree',
			cashbackUseds : null
           };
       $rootScope.$broadcast('tableBookingFactory:change', {});
    };
    
    this.empty = function(){
		this.init();
		store.set('bookinginfo', undefined);
	}
    
    this.reset = function(){
    	this.init();
    }
    this.setAgentDetails = function(callUuid, agentName){
    	this.$bookinginfo.callUuid = callUuid;
    	this.$bookinginfo.closedBy = agentName;
    	$rootScope.$broadcast('tableBookingFactory:change', {});
    }
    
    this.setEventDetails = function(eventId,eventName){
    	this.$bookinginfo.eventId = eventId;
    	this.$bookinginfo.eventName = eventName;
	}
    
    this.setCashbackAvails = function(cashbackUses){
    	var cashbackUseds = [];
    	angular.forEach(cashbackUses,function(value,key){
    		var cashbackUse = {};
    		cashbackUse.typeOfCashback = key;
    		cashbackUse.amount = value;
    		cashbackUseds.push(cashbackUse);
    	});
    	this.tableBookingInfo.cashbackUseds = cashbackUseds;
    	$rootScope.$broadcast('tableBookingFactory:change', {});
    }
    
    this.setBookingTickets = function(bookingTickets){
    	this.$bookinginfo.bookingTickets = bookingTickets;
    	this.$bookinginfo.eventBookingType = 'BookingTickets';
    	$rootScope.$broadcast('tableBookingFactory:change', {});
    }
    
    this.setCashbackGivens = function(cashbackGivensFromFactory){
    	this.$bookinginfo.cashbackGivens = cashbackGivensFromFactory;
    	$rootScope.$broadcast('tableBookingFactory:change', {});
    }
    
    this.getBookingInfo = function(){
    	return this.$bookinginfo;
    }
    
    this.setPaymentDetails = function(amount, payDecision, totalAmount , discountAmount){
    	if(payDecision.toLowerCase() === 'yes'){
    		this.$bookinginfo.preBooking = 'Yes';
    		this.tableBookingInfo.amount = amount;
        	this.tableBookingInfo.totalAmount = totalAmount;
        	this.tableBookingInfo.cashbackUsed = 0;
        	this.tableBookingInfo.discountAmount = discountAmount;
        	this.tableBookingInfo.transaction_status = 'New';
        	this.tableBookingInfo.gateway = 'Cashfree';
        	this.$bookinginfo.tableBookingInfo = this.tableBookingInfo;
    	}else{
    		this.$bookinginfo.preBooking = 'No';
    		this.$bookinginfo.tableBookingInfo = null;
    	}
    	$rootScope.$broadcast('tableBookingFactory:change', {});
    }

    this.setRestaurantDetails = function(restaurantId, restaurantCity){
    	this.$bookinginfo.restaurantId = restaurantId;
    	this.$bookinginfo.restaurantCity = restaurantCity;
    	$rootScope.$broadcast('tableBookingFactory:change', {});
    }
    
    this.setBookingDetails = function(timeOfBooking, countPeople, status, transactionAmount, tableStatus,userSpecialRequest) {
		this.$bookinginfo.status = status;
		this.$bookinginfo.countPeople = countPeople;
		this.$bookinginfo.timeOfBooking = timeOfBooking;
		this.$bookinginfo.transactionAmount = transactionAmount;
		this.$bookinginfo.tableStatus = tableStatus;
		this.$bookinginfo.userSpecialRequest = userSpecialRequest;
		$rootScope.$broadcast('tableBookingFactory:change', {});
	}
    
	this.setUserDetails = function(firstname, lastname, emailId, contactNo, loginId) {
    	this.$bookinginfo.loginId = loginId;
    	this.$bookinginfo.userName = firstname + ' ' + lastname;
    	this.$bookinginfo.userEmailId = emailId;
    	this.$bookinginfo.userContactNo = contactNo;
    	$rootScope.$broadcast('tableBookingFactory:change', {});
	}
    
    this.$restore = function(){
    	if(this.$bookinginfo === undefined ||  this.$bookinginfo === null) {
    		this.$bookinginfo = store.get('bookinginfo');
		}
    	this.$save();
    }
    
    this.$save = function () {
        store.set('bookinginfo', this.getBookingInfo());
    }
    
    return this;
}

function resortBookingFactory(store, $rootScope){

	this.init = function(){
		
        this.$resortbookinginfo = {
    		resortId:undefined,
    		firstName:undefined,
    		lastName:undefined,
    		emailId:undefined,
    		loginId:undefined,
    		userContactNo:undefined,
    		transAmount:undefined,
    		bookingInterfaceType:'Cashfree',
    		bookingMedia:'Offline Booking',
    		bookingType:undefined,
    		resortCheckInDate:undefined,
    		resortCheckOutDate:undefined,
    		specialRequest:null,
    		roomId:null,
    		roomType:null,
    		packageType:undefined,
    		dealReferenceNo:null,
    		packagebooking : [],
    		city : undefined,
    		resortName : undefined,
    		noOfDays : 1,
    		cashbackGivens : null,
    		tableBookingInfo : null,
    		confirmedByAgentForResortBooking : null
        };
        
        this.tableBookingInfo = {
	        	amount : '',
				totalAmount : '',
				cashbackUsed : '',
				transaction_status : '',
				gateway : 'Cashfree',
				cashbackUseds : null
	           };
        $rootScope.$broadcast('resortBookingFactory:change', {});
    };
    
    this.setPaymentDetails = function(amount, totalAmount , discountAmount){
		this.tableBookingInfo.amount = amount;
    	this.tableBookingInfo.totalAmount = totalAmount;
    	this.tableBookingInfo.cashbackUsed = 0;
    	this.tableBookingInfo.discountAmount = discountAmount;
    	this.tableBookingInfo.transaction_status = 'New';
    	this.tableBookingInfo.gateway = 'Cashfree';
    	this.$resortbookinginfo.tableBookingInfo = this.tableBookingInfo;
    	$rootScope.$broadcast('resortBookingFactory:change', {});
    }
    
    this.setAgentDetails = function(agentName){
    	this.$resortbookinginfo.confirmedByAgentForResortBooking = agentName;
    }
    
    this.setCashbackAvails = function(cashbackUses){
    	var cashbackUseds = [];
    	angular.forEach(cashbackUses,function(value,key){
    		var cashbackUse = {};
    		cashbackUse.typeOfCashback = key;
    		cashbackUse.amount = value;
    		cashbackUseds.push(cashbackUse);
    	});
    	this.tableBookingInfo.cashbackUseds = cashbackUseds;
    	$rootScope.$broadcast('resortBookingFactory:change', {});
    }
    
    this.setResortDetails = function(resortId, resortName, city){
    	this.$resortbookinginfo.resortId = resortId;
    	this.$resortbookinginfo.resortName = resortName;
    	this.$resortbookinginfo.city = city;
    	$rootScope.$broadcast('resortBookingFactory:change', {});
    }
    
    this.setBookingDetails = function(resortCheckInDate, packageType) {
		
		if(packageType.toLowerCase() === 'resortbooking')
			this.$resortbookinginfo.packageType = "Room Package";
		else
			this.$resortbookinginfo.packageType = "Day Package";
		
		this.$resortbookinginfo.resortCheckInDate = resortCheckInDate;
		$rootScope.$broadcast('resortBookingFactory:change', {});
	}
	
    this.setRoomBookingDetails = function(resortCheckInDate, packageType, noOfDays) {
		this.$resortbookinginfo.resortCheckInDate = resortCheckInDate;
		this.$resortbookinginfo.packageType = packageType;
		this.$resortbookinginfo.noOfDays = noOfDays;
		$rootScope.$broadcast('resortBookingFactory:change', {});
	}
    
    this.setUserDetails = function(firstName, lastName, emailId, userContactNo, loginId) {
    	this.$resortbookinginfo.loginId = loginId;
    	this.$resortbookinginfo.firstName = firstName;
    	this.$resortbookinginfo.lastName = lastName;
    	this.$resortbookinginfo.emailId = emailId;
    	this.$resortbookinginfo.userContactNo = userContactNo;
    	$rootScope.$broadcast('resortBookingFactory:change', {});
	}
    
    this.getResortBookingInfo = function(){
		return this.$resortbookinginfo;
	}
    
    this.empty = function(){
		this.init();
		store.set('resortbookinginfo', undefined);
	}
    
	// (ticket.name, ticket.evfPrice, ticket.quantity, ticket.id, VoucherType, Voucher Id , Voucher Name)
    this.setPackageBookingTickets = function(packageName, packagePrice, quantity, packageId, packageTypeName, voucherId, voucherName) {
		var bookingTicket = {};
		bookingTicket.packageName = packageName;
		bookingTicket.packagePrice = packagePrice * quantity;
		bookingTicket.quantity = quantity;
		bookingTicket.packageId = packageId;
		bookingTicket.packageTypeName = packageTypeName;
		bookingTicket.voucherId = voucherId;
		bookingTicket.voucherName = voucherName;
		
		return bookingTicket;
	}
	
    this.setPackageBooking = function(packagebooking){
    	this.$resortbookinginfo.packagebooking = packagebooking;
    	$rootScope.$broadcast('resortBookingFactory:change', {});
    }
	
    this.setCashbackGivens = function(cashbackGivens){
    	this.$resortbookinginfo.cashbackGivens = cashbackGivens;
    	$rootScope.$broadcast('resortBookingFactory:change', {});
    }
    
    this.$save = function () {
        store.set('resortbookinginfo', this.getResortBookingInfo());
    }
    
    return this;

}

function agentFactory(store){
	
	this.init = function(){
		this.callCenterAgent = {
			id : '',
			name : '',
			userName : '',
			emailId : '',
			mobileNumber : '',
			password : ''
		}
	}
	
	this.setUserName = function(userName){
		this.callCenterAgent.userName = userName;
		return this.getUserName();
	}
	
	this.getUserName = function(){
		return this.callCenterAgent.userName;
	}
	
	this.setPassword = function(password){
		this.callCenterAgent.password = password;
	}
	
	this.setMobileNumber = function(mobileNumber){
		this.callCenterAgent.mobileNumber = mobileNumber;
		return this.getMobileNumber();
	}
	
	this.getMobileNumber = function(){
		return this.mobileNumber;
	}
	
	this.setAgentDetails = function(agent){
		this.callCenterAgent = agent;
		this.$save();
	}
	
	this.getAgentDetails = function(){
		if(this.callCenterAgent==undefined)
			return this.$get();
		else
			return this.callCenterAgent;
	}
	
    this.$save = function () {
        return store.set('callCenterAgent', this.getAgentDetails());
    }
    
    this.$get = function (){
    	return store.get('callCenterAgent');
    }
	
	return this;
}

function enquiryFactory(){
	this.init = function(){
		this.sendQuery = {
			queryId:undefined,
			queryDesc:'',
			type:'',
			loginName:'',
			custName:'',
			contactNo:'',
			custMailId:'',
			restaurantid:'',
			callSid:'',
			createdDate:'',
			city:'',
			
		}
	}
	
	this.setEnquiryFormDetails = function(queryDesc, queryType, agentName, customerName, contactNo, customerMailId, restaurantid, callSid, createdDate, city){
		if(this.sendQuery === undefined){
			this.init();
		}
		
		this.sendQuery.queryDesc = queryDesc;
		this.sendQuery.type = queryType;
		this.sendQuery.loginName = agentName;
		this.sendQuery.custName = customerName;
		this.sendQuery.contactNo = contactNo;
		this.sendQuery.custMailId = customerMailId;
		this.sendQuery.restaurantid = restaurantid;
		this.sendQuery.callSid = callSid;
		this.sendQuery.createdDate = createdDate;
		this.sendQuery.city = city;
	}
	
	this.getEnquiryFormDetails = function(){
		return this.sendQuery;
	}
	
	return this;
}