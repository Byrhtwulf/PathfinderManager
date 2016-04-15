'use strict';

// Declare app level module which depends on views, and components
var PathfinderManager = angular.module('PathfinderManager', ['cfp.hotkeys', "checklist-model", "ngAnimate", "ui.bootstrap",
    "PathfinderManager.DiceRoller", "PathfinderManager.MonsterService", "PathfinderManager.MonsterDisplay", "PathfinderManager.InitiativeTrackerService",
    "PathfinderManager.InitiativeTracker","ngRoute", 'ngMaterial']);


PathfinderManager.config(function($routeProvider){
   $routeProvider
       .when('/',{
           templateUrl : 'InitiativeTracker.html',
           controller : 'CombatManager'
       })
       .when('/MonsterCreator',{
           templateURL : 'MonsterCreator.html',
           controller : 'MonsterCreator'
       });

});


PathfinderManager.controller('CombatManager', ['$scope', 'hotkeys', '$uibModal', 'InitiativeTrackerService', '$timeout', 'MonsterManager',
    function($scope, hotkeys, $uibModal, InitiativeTrackerService, $timeout, MonsterManager) {


    $scope.roundCounter = 1; //Current Number of Rounds
    $scope.numOfActions = 0; //Number of characters that have gone in current round
    $scope.showDiceRoller = false;
    $scope.roundTimer = 0;
    $scope.newCharacterName = "";
    $scope.searchText = "";
    $scope.selectedItem = "";


    $scope.toggleDiceRoller = function(){
        if($scope.showDiceRoller == true){
            $scope.showDiceRoller = false;
        }
        else{
            $scope.showDiceRoller = true;
        }
    };

    $scope.monsterNames = MonsterManager.getAllMonsterNames();

    //Watches Character data in InitiativeTracker
    $scope.$watch(
        function(){ return InitiativeTrackerService.characterData },

        function(characterData) {
            $scope.characterData = characterData;
        }
    )

    //Current list of Main Characters
    $scope.mainCharacters = ["Arc", "Boromir", "Kabuto", "Rhaelyn"];

    //List of characters to add group status to
    $scope.charactersToAddStatuses = [];

    $scope.toggleMonsterCreator = function(){
        $scope.showMonsterCreator = !$scope.showMonsterCreator;
    }

    //Boolean value to determine if Add New Character Form should show
    $scope.toggleAddNewCharacterForm = function(){
        $scope.showAddNewCharacterForm = !$scope.showAddNewCharacterForm;
    }

    //Boolean value to determine if Add Main Character Form should should
    $scope.toggleAddMainCharacters = function(){
        $scope.showAddMainCharacters = !$scope.showAddMainCharacters;
    }

    //Function to add main character to initiative tracker
    $scope.addMainCharacter = function ($event, mainCharacterName, mainCharacterInitiative){
        if ($event.keyCode==13) {
            InitiativeTrackerService.addCharactersToInitiative(mainCharacterName, mainCharacterInitiative, 0, 1);
        }
    }

    //Adds character to initiative and resets initiative tracker form
    $scope.addCharactersToInitiative = function (newCharacterName, newCharacterInitiative, newCharacterHp, newCharacterCount) {
        InitiativeTrackerService.addCharactersToInitiative(newCharacterName, newCharacterInitiative, newCharacterHp, newCharacterCount);
        $scope.newCharacterName = "";
        $scope.newCharacterInitiative = "";
        $scope.newCharacterCount = 1;
        $scope.newCharacterHp = "";
    }

    //Create Modal Window for adding Group Status
    $scope.openAddGroupStatus = function(){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'ModalWindows/GroupStatusModalWindow/GroupStatusModalWindow.html',
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

    function countdown(){
        $scope.roundTimer++;
        $scope.timeout = $timeout(countdown,1000);
    }

    //Moves tracker to next initiative and updates actions and rounds
    $scope.nextInitiative = function(){
        $timeout.cancel($scope.timeout);
        $scope.roundTimer = 0;
        countdown();
        InitiativeTrackerService.nextInitiative();

        //Increases number of characters that have gone in current round and checks to see if round is over
        $scope.numOfActions = $scope.numOfActions + 1;
        if ($scope.numOfActions == $scope.characterData.length){
            $scope.numOfActions = 0;
            $scope.roundCounter = $scope.roundCounter + 1;
        }

    }

    //Starts combat
    $scope.startCombat = function(){
        //Set Rounds = 1
        $scope.roundCounter = 1;
        //Adds a new item to the start of the initiative order to keep track of the start of a new round
        $scope.addCharactersToInitiative("Start of New Round", 1000, 0,1);
        //Order list of characters by initiative
        InitiativeTrackerService.sortCharacterDataByInitiative();
    }

    $scope.autoCompleteSearch = function (query) {
        var results = query ? $scope.monsterNames.filter(autoCompleteFilter(query)) : $scope.monsterNames;
        return results;
    }
    $scope.autoCompleteFilter = function(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(monster) {
            return (monster.Name.toLowerCase().indexOf(lowercaseQuery) === 0);
        };
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

