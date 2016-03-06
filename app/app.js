'use strict';

// Declare app level module which depends on views, and components
var PathfinderManager = angular.module('PathfinderManager', ['cfp.hotkeys', "checklist-model", "ui.sortable", "ngAnimate", "ui.bootstrap",
    "PathfinderManager.DiceRoller", "PathfinderManager.MonsterFactory"]);

PathfinderManager.controller('CombatManager', ['$scope', '$filter', 'hotkeys', '$uibModal', 'MonsterManager', function($scope, $filter, hotkeys, $uibModal, MonsterManager) {
    $scope.roundCounter = 1; //Current Number of Rounds
    $scope.numOfActions = 0; //Number of characters that have gone in current round
    //Stores characters in initiative order
    $scope.characterData = [{characters:[{name:"Boromir", currentHp: 78, hpDifference: "", newStatus:"", statuses:[{name: "Dazed", duration: 1}, {name: "Stunned", duration: 3}]}], initiative:17,},
        {characters:[{name:"Arc", currentHp: 69, hpDifference:"", newStatus:"", statuses:[{name: "Poisoned", duration: 8}, {name: "Stunned", duration: 3}]}], initiative:12,},
        {characters:[{name:"Rhaelyn", currentHp: 100,  hpDifference:"", newStatus:"", statuses:[{name: "Dazzled", duration: 9}, {name: "Diseased", duration: 5}]}], initiative:13,},
        {characters:[{name:"Skirmisher 1", currentHp: 100,  hpDifference:"", newStatus:"", statuses:[{name: "Dazzled", duration: 9}, {name: "Diseased", duration: 5}]},
                    {name:"Skirmisher 2", currentHp: 100,  hpDifference:"", newStatus:"", statuses:[{name: "Dazzled", duration: 9}, {name: "Diseased", duration: 5}]},
                    {name:"Skirmisher 3", currentHp: 100,  hpDifference:"", newStatus:"", statuses:[{name: "Dazzled", duration: 9}, {name: "Diseased", duration: 5}]}], initiative:10},
        {characters:[{name:"Hound Archon", currentHp: 100,  hpDifference:"", newStatus:"", statuses:[{name: "Dazzled", duration: 9}, {name: "Diseased", duration: 5}]}], initiative:13},
        {characters:[{name:"Succubus", currentHp: 100,  hpDifference:"", newStatus:"", statuses:[{name: "Dazzled", duration: 9}, {name: "Diseased", duration: 5}]}], initiative:13}
    ];
    //$scope.characterData=[];

    $scope.mainCharacters = ["Arc", "Boromir", "Kabuto", "Rhaelyn"];

    //List of characters to add group status to
    $scope.charactersToAddStatuses = [];

    $scope.emptyArray = [];

    $scope.currentCharacter = MonsterManager.getCurrentMonster();


    //Boolean value to determine if Add New Character Form should show
    $scope.toggleAddNewCharacterForm = function(){
        $scope.showAddNewCharacterForm = !$scope.showAddNewCharacterForm;
    }

    $scope.toggleAddMainCharacters = function(){
        $scope.showAddMainCharacters = !$scope.showAddMainCharacters;
    }

    $scope.addMainCharacter = function ($event, mainCharacterName, mainCharacterInitiative){
        if ($event.keyCode==13) {
            $scope.addCharactersToInitiative(mainCharacterName, mainCharacterInitiative, 0, 1);
        }
    }

    //Adds new character to initiative order
    $scope.addCharactersToInitiative = function (newCharacterName, newCharacterInitiative, newCharacterHp, newCharacterCount) {
        if (newCharacterName.trim() != "") {
            $scope.characterData.push($scope.createNewCharacterGroup(newCharacterName, newCharacterInitiative, newCharacterHp, newCharacterCount));
            $scope.newCharacterName = "";
            $scope.newCharacterInitiative = "";
            $scope.newCharacterCount = 1;
            $scope.newCharacterHp = "";
        }
    };

    //Create New Character Group to add to initiative
    $scope.createNewCharacterGroup = function(newCharacterName, newCharacterInitiative, newCharacterHp, newCharacterCount){
        var characterGroup = {
            characters: [],
            initiative: newCharacterInitiative,
        }
        for(var i = 0; i < newCharacterCount; i++) {
            var characterName = newCharacterName.charAt(0).toUpperCase() + newCharacterName.slice(1);
            if (newCharacterCount > 1){
                characterName = characterName + " " + (i+1);
            }
            var newCharacter = {
                name: characterName,
                initiative: newCharacterInitiative,
                currentHp: newCharacterHp,
                hpDifference: "",
                newStatus: "",
                statuses: []
            };
            characterGroup.characters.push(newCharacter);
        }
        return characterGroup;
    }

    //Removes character from initiative
    $scope.removeCharacterFromInitiative = function(group, character){
        var characterIndex = group.characters.indexOf(character);
        group.characters.splice(characterIndex, 1);
        if (group.characters.length == 0){
            var groupIndex = $scope.characterData.indexOf(group);
            $scope.characterData.splice(groupIndex, 1);
        }
    }

    //Adds new status to character
    $scope.addStatusToCharacter = function ($event, character) {
        if ($event.keyCode==13) {
            var statusArray = character.newStatusName.split("=");
            if (statusArray[0] != null && statusArray[0] != ""
                && statusArray[1] != null && statusArray[1] != "") {
                var statusName = statusArray[0].charAt(0).toUpperCase() +statusArray[0].slice(1);
                var statusDuration = parseInt(statusArray[1], 10)
                var status = {name:statusName, duration:statusDuration };
                //var item = {name:"test", initiative: 1}
                character.statuses.push(status);
                character.newStatusName = "";
            }
        }
    };

    $scope.removeStatusFromCharacter = function(character, status){
        var statusIndex = character.statuses.indexOf(status);
        character.statuses.splice(statusIndex, 1);
    }

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

    //Create Modal Window for adding Group Status
    $scope.openAddGroupStatus = function(){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'addGroupStatus.html',
            controller:"AddGroupStatus",
            scope:$scope,
            resolve: {
                items: function () {
                    return $scope.characterData;
                }
            }
        });
        //modalInstance.result.then(function () {
        //}, function () {
        //    $log.info('Modal dismissed at: ' + new Date());
        //});
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
        angular.forEach($scope.characterData[0].characters, function(character){
            angular.forEach(character.statuses, function(status)
            {
                status.duration = status.duration - 1;
                if (status.duration <= -1) {
                    character.statuses.splice(character.statuses.indexOf(status), 1);
                }
            });
        });

        //Increases number of characters that have gone in current round and checks to see if round is over
        $scope.numOfActions = $scope.numOfActions + 1;
        if ($scope.numOfActions == $scope.characterData.length){
            $scope.numOfActions = 0;
            $scope.roundCounter = $scope.roundCounter + 1;
        }

        var currentCharacterName = $scope.characterData[0].characters[0].name;
        MonsterManager.updateCurrentMonster(currentCharacterName);
        $scope.currentCharacter = MonsterManager.getCurrentMonster();
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

    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.addGroupStatus = function(newGroupStatusName, newGroupStatusDuration){
        if(newGroupStatusName!=""){
            var statusName = newGroupStatusName.charAt(0).toUpperCase() + newGroupStatusName.slice(1);
            var statusDuration = parseInt(newGroupStatusDuration, 10)
            var status = {name: statusName, duration: statusDuration};
            angular.forEach($scope.charactersToAddStatuses, function(character){
                character.statuses.push(status);
            });
        };
        $scope.charactersToAddStatuses = [];
        $uibModalInstance.close();
    };


});