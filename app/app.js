'use strict';

// Declare app level module which depends on views, and components
var PathfinderManager = angular.module('PathfinderManager', ['cfp.hotkeys', "checklist-model"]);

PathfinderManager.controller('CombatManager', ['$scope', '$filter', 'hotkeys', function($scope, $filter, hotkeys) {
    $scope.roundCounter = 1; //Current Number of Rounds
    $scope.numOfActions = 0; //Number of characters that have gone in current round
    //Stores characters in initiative order
    $scope.characterData = [{name:"Boromir", initiative:17, statuses:[{name: "Dazed", duration: 1}, {name: "Stunned", duration: 3}]},
        {name:"Arc", initiative:12, statuses:[{name: "Poisoned", duration: 8}, {name: "Stunned", duration: 3}]},
        {name:"Rhaelyn", initiative:13, statuses:[{name: "Dazzled", duration: 9}, {name: "Diseased", duration: 5}]}];

    //List of characters to add group status to
    $scope.charactersToAddStatuses = [];

    //Adds new character to initiative order
    $scope.addCharacterToInitiative = function () {
        var newCharacter= {name:this.newCharacterName, initiative: this.newCharacterInitiative, statuses:[]};
        //var item = {name:"test", initiative: 1}
        $scope.characterData.push(newCharacter);
        $scope.newCharacterInitiative = 0;
    };

    //Adds new status to character
    $scope.addStatusToCharacter = function ($statusScope, $index) {
        var status= {name:this.newStatusName, duration: this.newStatusDuration};
        //var item = {name:"test", initiative: 1}
        $scope.characterData[$index].statuses.push(status);
        $statusScope.newStatusName = "";
        $statusScope.newStatusDuration = 0;
    };

    //Adds new status to multiple characters
    $scope.addGroupStatus = function () {
        var status= {name:this.newStatusNameTo, duration: this.newStatusDurationTo};

        angular.forEach($scope.charactersToAddStatuses, function(statusList){
            statusList.push(status);
        });
        $scope.newStatusNameTo = "";
        $scope.newStatusDurationTo = 0;
        $scope.charactersToAddStatuses = [];
    };

    //Define hotkey for Next Initiative
    hotkeys.add({
        combo: 'shift+space',
        description: 'Advance to next character',
        callback:function(){
            $scope.nextInitiative();
        }
    })

    //Moves to next character in initiative order
    $scope.nextInitiative = function(){

        //Move first character to bottom of initiative
        $scope.characterData.push($scope.characterData.shift());

        //Decrement all statuses for current character in initiative order
        angular.forEach($scope.characterData[0].statuses, function(status){
            status.duration = status.duration -1;
            if (status.duration == -1){
                $scope.characterData[0].statuses.splice($scope.characterData[0].statuses.indexOf(status), 1);
            }
        });

        //Increases number of characters that have gone in current round and checks to see if round is over
        $scope.numOfActions = $scope.numOfActions + 1;
        if ($scope.numOfActions == $scope.characterData.length){
            $scope.numOfActions = 0;
            $scope.roundCounter = $scope.roundCounter + 1;
        }
    };

    //Starts combat
    $scope.startCombat = function(){
        //Set Rounds = 1
        $scope.roundCounter = 1;
        //Order list of characters by initiative
        $scope.characterData = $filter('orderBy')($scope.characterData, "-initiative");
    }


}]);