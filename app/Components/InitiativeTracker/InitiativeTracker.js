'use strict';

var tracker = angular.module('PathfinderManager.InitiativeTracker', ["ui.sortable","ngAnimate", "ui.bootstrap",
    "PathfinderManager.InitiativeTrackerService"]);

tracker.controller('InitiativeTracker', ['$scope', 'InitiativeTrackerService', function($scope, InitiativeTrackerService) {

    $scope.$watch(
        function(){ return InitiativeTrackerService.characterData },

        function(characterData) {
            $scope.characterData = characterData;
        }
    )

    //Settings for Character Drag and Drop
    $scope.characterSort = {
        containment:"#initiative-tracker",
        cursor:"move"
    }

    //Removes character from initiative
    $scope.removeCharacterFromInitiative = function(group, character){
        InitiativeTrackerService.removeCharacterFromInitiative(group, character);
    }

    //Adds status to character
    $scope.addStatusToCharacter = function ($event, character) {
        if ($event.keyCode==13) {
           InitiativeTrackerService.addStatusToCharacter(character);
        }
    };

    //removes status from character
    $scope.removeStatusFromCharacter = function(character, status){
        InitiativeTrackerService.removeStatusFromCharacter(character, status);
    }

    //Updates hp of character on Enter key
    $scope.updateHp = function($event, hpDifference, character) {
        if ($event.keyCode == 13) {
            InitiativeTrackerService.updateHp(hpDifference, character);
        }
    }

}]);