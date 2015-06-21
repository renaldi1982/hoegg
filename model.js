/* App Module */
var app = angular.module('hoegg',[]);

/* Controllers */
app.controller('ObjectController',['$scope',function($scope){
	$scope.data = "";
	$scope.result = "";		
	$scope.JSONObj = {};	
		
	/* Clean Data */
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
//		if($scope.customStyle.style.hasOwnProperty("color")){			
//			
//		}else{
//			$scope.customStyle.style =+ {"color" : "green"};
//		}		
	}
	$scope.turnRed = function(){
		var style = $scope.customStyle.style;
		style["color"] = "red";
//		if($scope.customStyle.style.hasOwnProperty("color")){
//			alert("has color");
//			$scope.customStyle.style["color"] = "red";
//		}else{
//			alert("add color");
//			$scope.customStyle.style =+ {"color" : "red"};
//		}		
	}
	
}]);

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