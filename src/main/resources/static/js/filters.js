/**
 * 
 */

var AppFilters = angular.module('SwaahanApp');

AppFilters.filter('removeSpecialChars', function() {
	return function(text) {
		var s = String(text).replace(/[\s]*([(][a-zA-Z0-9\s]*[)])/igm, "");
		s = String(s).replace(/([\s])/igm, '-');
		return String(s).replace(/-+/g, '-').toLowerCase();
	}
});

AppFilters.filter('timeFormat24To12',['$filter', '$dateParser', function($filter, $dateParser) {
	return function(time) {
		try {
			return $filter('date')($dateParser(time, 'HH:mm:ss'), "hh:mm a");
		} catch (err) {
			return '';
		}
	};
}]);

AppFilters.filter('cut', function () {
    return function (value, wordwise, max, tail) {
        if (!value) return '';

        max = parseInt(max, 10);
        if (!max) return value;
        if (value.length <= max) return value;

        value = value.substr(0, max);
        if (wordwise) {
            var lastspace = value.lastIndexOf(' ');
            if (lastspace != -1) {
              //Also remove . and , so its gives a cleaner result.
              if (value.charAt(lastspace-1) == '.' || value.charAt(lastspace-1) == ',') {
                lastspace = lastspace - 1;
              }
              value = value.substr(0, lastspace);
            }
        }

        return value + (tail || ' …');
    };
});

AppFilters.filter('removeSlash', function () {
    return function (text) {
    	 var s = String(text).replace("/","");
    	 return s;
    }
});

AppFilters.filter('convertTableStatus', ['constants', function (constants) {
    return function (status) {
    	return constants.tableStatusMap[status];
    }
}]);

AppFilters.filter('parseCashbackType',function () {
    return function (text) {
    	var cashbackTypeMap = {
    			"CASHBACK" : "Cashback",
    			"CASHBACKPLUS" : "Cashback Plus",
    			"RESTDISCOUNT" : "Restaurant Discount",
    			"EVFDISCOUNT" : "Evf Discount",
    			"RESTCASHBACK" : "Restaurant Cashback"
    	}
    	
    	return cashbackTypeMap[text];
    }
});

AppFilters.filter('changeDateFormat',['$filter','$dateParser', function($filter,$dateParser) {
    return function(inputDate, inputDateFormat , outputFormat) {
    	try{
    		return $filter('date')($dateParser(inputDate,inputDateFormat), outputFormat);
    	}catch(err){
    		return '';
    	}
    };
}]);

AppFilters.filter('averageRating', function () {
    return function (text) {
    	var sum = 0; 
        for(var i = 0; i < text.length; i++){
            sum += parseInt(text[i].averageRating, 10);
        }
        var avg = sum/text.length;
        return avg; 
    }
});