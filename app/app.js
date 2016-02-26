'use strict';

// Declare app level module which depends on views, and components
var PathfinderManager = angular.module('PathfinderManager', ['cfp.hotkeys', "checklist-model", "ui.sortable", "ngAnimate", "ui.bootstrap"]);

PathfinderManager.controller('CombatManager', ['$scope', '$filter', 'hotkeys', '$uibModal', function($scope, $filter, hotkeys, $uibModal) {
    $scope.roundCounter = 1; //Current Number of Rounds
    $scope.numOfActions = 0; //Number of characters that have gone in current round
    //Stores characters in initiative order
    $scope.characterData = [{name:"Boromir", initiative:17, currentHp: 78, hpDifference: "", statuses:[{name: "Dazed", duration: 1}, {name: "Stunned", duration: 3}]},
        {name:"Arc", initiative:12, currentHp: 69, hpDifference:"", statuses:[{name: "Poisoned", duration: 8}, {name: "Stunned", duration: 3}]},
        {name:"Rhaelyn", initiative:13, currentHp: 100,  hpDifference:"", statuses:[{name: "Dazzled", duration: 9}, {name: "Diseased", duration: 5}]}];

    //List of characters to add group status to
    $scope.charactersToAddStatuses = [];

    $scope.emptyArray = [];

    //Adds new character to initiative order
    $scope.addCharacterToInitiative = function () {
        var newCharacter= {name:this.newCharacterName, initiative: this.newCharacterInitiative, currentHp: this.newCharacterHp, hpDifference: "", statuses:[]};
        //var item = {name:"test", initiative: 1}
        $scope.characterData.push(newCharacter);
        $scope.newCharacterInitiative = 0;
    };

    $scope.removeCharacterFromInitiative = function(character){
        var index = $scope.characterData.indexOf(character);
        $scope.characterData.splice(index, 1);
    }

    //Adds new status to character
    $scope.addStatusToCharacter = function ($statusScope, $index) {
        var status= {name:this.newStatusName, duration: this.newStatusDuration};
        //var item = {name:"test", initiative: 1}
        $scope.characterData[$index].statuses.push(status);
        $statusScope.newStatusName = "";
        $statusScope.newStatusDuration = 0;
    };

    //Updates hp of character on Enter key
    $scope.updateHp = function($event, hpDifference, character){
        if ($event.keyCode == 13){
            character.currentHp = character.currentHp + hpDifference;
            character.hpDifference="";
        }
    }


    //Settings for Character Drag and Drop
    $scope.characterSort = {
        containment:"#initiative-tracker",
        cursor:"move"
    }

    //Adds new status to multiple characters
    $scope.addGroupStatus = function () {
        var status= {name:this.newGroupStatusName, duration: this.newGroupStatusDuration};

        angular.forEach($scope.charactersToAddStatuses, function(statusList){
            statusList.push(status);
        });
        $scope.newGroupStatusName = "";
        $scope.newGroupStatusDuration = 0;
        $scope.charactersToAddStatuses = angular.copy($scope.emptyArray);
    };

    $scope.openAddGroupStatus = function(){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'addGroupStatus.html',
            controller:"AddGroupStatus",
            resolve: {
                items: function () {
                    return $scope.characterData;
                }
            }
        });
        modalInstance.result.then(function () {
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
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

PathfinderManager.controller("AddGroupStatus",function($scope, $uibModalInstance, items){
    $scope.items = items;
    console.log(items);
    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});