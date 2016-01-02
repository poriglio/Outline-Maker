angular.module("storyApp",["ngRoute","ui.bootstrap"])

angular.module("storyApp").config(["$routeProvider",function($routeProvider){

	$routeProvider.when("/",{
		templateUrl : "/html/login.html",
		controller  : "outlineController"
	})
	.when("/outlines",{
		templateUrl : "/html/outline.html",
		controller  : "outlineController",
	})
}])

angular.module("storyApp").controller("dropdownController",["$scope","$log",function($scope,$log){

  $scope.browseItems = [
  		"users",
  		"stories",
  		"poems",
  		"essays"
  ];

  $scope.accountItems = [
  		"profile",
  		"submissions"
  ]

  $scope.status = {
    isopen: false
  };

  $scope.toggled = function(open) {
    $log.log('Dropdown is now: ', open);
  };

  $scope.toggleDropdown = function($event) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.status.isopen = !$scope.status.isopen;
  };

}])

angular.module("storyApp").controller("outlineController",["$scope","$http",function($scope,$http){

	console.log($scope.username)

	$scope.stories = []

	$http.get("/api/me").then(function(returnData){
		$scope.username = returnData.data.username
	})

	var getOutlines = function(){
		$http.get("/api/outline").then(function(returnData){
			$scope.stories = returnData.data
			$scope.stories = $scope.stories.sort(function(a,b){
				return b.dateAdded - a.dateAdded
			})
			console.log($scope.stories)
		})
	}

	getOutlines()

	var Outline = function(title,username,parts){
		this.title = title
		this.username = username
		this.parts = parts
		var newStory = []
		newStory.push(this)
		$scope.stories = newStory.concat($scope.stories)
	}

	var Part = function(name,chapters,index){
		this.name = name
		this.chapters = chapters
		$scope.stories[index].parts.push(this)
	}

	var Chapter = function(name,events,storyIndex,partIndex){
		this.name = name
		this.events = events
		$scope.stories[storyIndex].parts[partIndex].chapters.push(this)
	}

	var Event = function(content,storyIndex,partIndex,chapterIndex){
		this.content = content
		$scope.stories[storyIndex].parts[partIndex].chapters[chapterIndex].events.push(this)
	}

	$scope.createOutline = function(){
		new Outline($scope.title,"Paula",[])
		$scope.saveOutline(0)
		getOutlines()
	}

	$scope.createPart = function($index,part){
		new Part(part.name,[],$index)
	}

	$scope.createChapter = function(storyIndex,partIndex,chapter){
		new Chapter(chapter.name,[],storyIndex,partIndex)
	}

	$scope.createEvent = function(storyIndex,partIndex,chapterIndex,event){
		new Event(event.content,storyIndex,partIndex,chapterIndex)
	}

	$scope.up = function(index1,index2,index3,index4){
		if(index1 != 0){
			if(index4 !== undefined){
				// an event is being moved up
				var1 = angular.copy($scope.stories[index4].parts[index3].chapters[index2].events[index1])
				var2 = angular.copy($scope.stories[index4].parts[index3].chapters[index2].events[index1-1])
				$scope.stories[index4].parts[index3].chapters[index2].events[index1] = var2
				$scope.stories[index4].parts[index3].chapters[index2].events[index1-1] = var1
			}
			else if(index3 !== undefined){
				// a chapter is being moved up
				var1 = angular.copy($scope.stories[index3].parts[index2].chapters[index1])
				var2 = angular.copy($scope.stories[index3].parts[index2].chapters[index1-1])
				$scope.stories[index3].parts[index2].chapters[index1] = var2
				$scope.stories[index3].parts[index2].chapters[index1-1] = var1
			}
			else if(index2 !== undefined){
				// a part is being moved up
				var1 = angular.copy($scope.stories[index2].parts[index1])
				var2 = angular.copy($scope.stories[index2].parts[index1-1])
				$scope.stories[index2].parts[index1] = var2
				$scope.stories[index2].parts[index1-1] = var1	
			
			}
		}
	}

	$scope.down = function(index1,index2,index3,index4){
		if(index4 !== undefined){
			// an event is being moved
			if(index1 != $scope.stories[index4].parts[index3].chapters[index2].events.length - 1){	
				var1 = angular.copy($scope.stories[index4].parts[index3].chapters[index2].events[index1+1])
				var2 = angular.copy($scope.stories[index4].parts[index3].chapters[index2].events[index1])
				$scope.stories[index4].parts[index3].chapters[index2].events[index1] = var1
				$scope.stories[index4].parts[index3].chapters[index2].events[index1+1] = var2
			}
		}
		else if(index3 !== undefined){
			// a chapter is being moved
			if(index1 != $scope.stories[index3].parts[index2].chapters.length - 1){
				var1 = angular.copy($scope.stories[index3].parts[index2].chapters[index1+1])	
				var2 = angular.copy($scope.stories[index3].parts[index2].chapters[index1])
				$scope.stories[index3].parts[index2].chapters[index1] = var1
				$scope.stories[index3].parts[index2].chapters[index1+1] = var2					
			}
		}	
		else if(index2 !== undefined){
			// a part is being moveed
			if(index1 != $scope.stories[index2].parts.length - 1){
				var1 = angular.copy($scope.stories[index2].parts[index1 + 1])
				var2 = angular.copy($scope.stories[index2].parts[index1])
				$scope.stories[index2].parts[index1] = var1
				$scope.stories[index2].parts[index1+1] = var2				
			}
		}	
	}

	$scope.delete = function(index1,index2,index3,index4){
		if(index4 !== undefined){
			// the deleted item is an event
			$scope.stories[index4].parts[index3].chapters[index2].events.splice(index1,1)
		}
		else if(index3 !== undefined){
			// the deleted item is a chapter
			$scope.stories[index3].parts[index2].chapters.splice(index1,1)
		}
		else if(index2 !== undefined){
			// the deleted item is a part
			$scope.stories[index2].parts.splice(index1,1)
		}
		else{
			// the deleted item is a story
			var id = $scope.stories[index1]._id
			$http({
				method : "POST",
				url    : "/api/outline/delete",
				data   : {id : id}
			}).then(getOutlines())
		}
	}

	$scope.saveOutline = function($index){
		$http({
			method : "POST",
			url    : "/api/outline",
			data   : $scope.stories[$index]
		})
	}

	$scope.copiedText = {}

	$scope.copyEvent = function(index1,index2,index3,index4){
		$scope.hideButtons = true
		$scope.hideForms = true
		$scope.showPasteButtons = true
		$scope.copiedText = angular.copy($scope.stories[index4].parts[index3].chapters[index2].events[index1])
		$scope.delete(index1,index2,index3,index4)
	}

	$scope.pasteEvent = function(index2,index3,index4){
		$scope.hideButtons = false
		$scope.hideForms = false
		$scope.showPasteButtons = false
		$scope.createEvent(index4,index3,index2,$scope.copiedText)
	}

	$scope.hideButtons = false
	$scope.hideForms = false

	$scope.toggleButtons = function(){
		if($scope.hideButtons === true){
			$scope.hideButtons = false
		}
		else{
			$scope.hideButtons = true
		}
	}

	$scope.toggleForms = function(){
		if($scope.hideForms === true){
			$scope.hideForms = false
		}
		else{
			$scope.hideForms = true
		}
	}

	$scope.toggleList = function(){
		if($scope.showList === true){
			$scope.showList = false
		}
		else{
			$scope.showList = true
		}
	}

	$scope.activate = function($index){
		for(var i = 0; i < $scope.stories.length; i++){
			$scope.stories[i].active = false
		}
		$scope.stories[$index].active = true
	}

}])