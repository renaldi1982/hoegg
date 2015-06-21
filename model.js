/* App Module */
var app = angular.module('hoegg',[]);

/* Controllers */
app.controller('ObjectController',['$scope','$http','$window',function($scope,$http,$window){
	$scope.data = "";
	$scope.result = "";		
	$scope.JSONObj = {};	
	$scope.url = "http://63.223.84.104:44400/hoegg/data.json"
	
		
	/* Buttons Controllers */
		
	/* Load dummy JSON data */
	$scope.fetch = function(){
		$http.get($scope.url).success(function(data, status, config){
			$scope.JSONObj = data;
			$scope.data = JSON.stringify(data);
			$scope.submit();
			$scope.turnGreen();
			$scope.error = "Dummy JSON Loaded";
		}).error(function(data, status, header, config){
			console.log(status);
			$scope.turnRed();
			$scope.error = "Data Unavailable";
		});		
	}
	
	/* Clean Input */
	$scope.submit = function(){			
		if($scope.data.length > 0){
			var data = $scope.data.trim().replace(/\s/g,"");						
			try{
				jsonData = angular.fromJson(data);
				$scope.JSONObj = jsonData;				
				$scope.result = data;		
				$scope.turnGreen();
				$scope.error = "JSON Loaded";				
			}catch(e){
				console.log(e);
				$scope.turnRed();
				$scope.error = "Invalid JSON";				
				$scope.data = "";
			}				
		}else{
			$scope.turnRed();
			$scope.error = "No Data to load";			
		}								
	}	
	
	/* Clean JSON from duplicates */
	$scope.clean = function(){		
		var outerField = [];
		var innerField = [];
		var counter = 0;		
		var cleaned = false;
		
		/* Collect all outer fields keys */
		jQuery.each($scope.JSONObj, function(index, val){				
			outerField.push(index);					
		});							
		
		/* Loop Outer Fields */
		jQuery.each($scope.JSONObj, function(index, value){				
			if(jQuery.isArray(value)){
				
				/* Inner Array */
				jQuery.each(value, function(i,v){
					var keys;					
					if((keys = hasKey(outerField,v)).length > 0){						
						if(keys.length > 1){
							v = removeProperties(keys,v);
						}else{
							delete v[keys[0]];
						}		
						cleaned = true;
					}
						
				});
			}				
		});	
		
		if(cleaned){
			$scope.result = JSON.stringify($scope.JSONObj);
			$scope.turnGreen();
			$scope.error = "How do you like them clean JSON";			
		}else{
			$scope.turnRed();
			$scope.error = "There nothing to be cleaned";			
		}		
	}
	
	/* Reload page */
	$scope.reload = function(){
		$window.location.reload();
	}
	
	/* End Button Controllers */
	
	
	/* Error and Style */
	$scope.error = "";
	$scope.customStyle = {
			style : {
				"font-weight" : "bold"
			}
	};	
	$scope.turnGreen = function(){
		var style = $scope.customStyle.style;
		style["color"] = "green";
	}
	$scope.turnRed = function(){
		var style = $scope.customStyle.style;
		style["color"] = "red";
	}
	
}]);

/* Functions */

/* Check if object contains any outer key */
function hasKey(outer,object){
	var result = [];
	jQuery.each(outer, function(i,v){
		if(v in object){
			result.push(v);
		}
	});
	return result;
}

/* Removing properties that appears in outer field/s */
function removeProperties(keys, object){
	jQuery.each(keys, function(i,v){
		delete object[v];
	});
	return object;
}