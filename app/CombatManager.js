'use strict';

// Declare app level module which depends on views, and components
var PathfinderManager = angular.module('PathfinderManager', ['cfp.hotkeys', "checklist-model", "ngAnimate", "ui.bootstrap",
    "PathfinderManager.DiceRoller", "PathfinderManager.MonsterService", "PathfinderManager.MonsterDisplay", "PathfinderManager.InitiativeTrackerService",
    "PathfinderManager.InitiativeTracker", "PathfinderManager.MonsterCreator", "PathfinderManager.MonsterRoller", "ngRoute", 'ngMaterial']);


PathfinderManager.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/', {
                templateUrl: 'InitiativeTracker.html',
                controller: 'CombatManager'
            }).
            when('/MonsterCreator', {
                templateUrl: 'Components/MonsterCreator/MonsterCreator.html',
                controller: 'MonsterCreator'
            }).when('/MonsterRoller', {
                templateUrl: 'Components/MonsterRoller/MonsterRoller.html',
                controller: 'MonsterRoller'
            }).
            otherwise({
                redirectTo: '/'
            });
    }]);


PathfinderManager.controller('CombatManager', ['$scope', 'hotkeys', '$uibModal', 'InitiativeTrackerService', '$timeout', 'MonsterManager',
    function($scope, hotkeys, $uibModal, InitiativeTrackerService, $timeout, MonsterManager) {


    $scope.roundCounter = 1; //Current Number of Rounds
    $scope.numOfActions = 0; //Number of characters that have gone in current round
    $scope.showDiceRoller = false;
    $scope.roundTimer = 0;
    $scope.newCharacterName = "";
    $scope.newCharacterInitiative = "";
    $scope.newCharacterCount = 1;
    $scope.newCharacterHp = "";
    $scope.combatStarted = false;


    $scope.toggleDiceRoller = function(){
        if($scope.showDiceRoller == true){
            $scope.showDiceRoller = false;
        }
        else{
            $scope.showDiceRoller = true;
        }
    };

    MonsterManager.getAllMonsterNames().then(function(response){
       MonsterManager.setMonsterNames(response.data);
    });

    $scope.$watch(
        function(){ return MonsterManager.monsterNames },

        function(monsterNames) {
            $scope.monsterNames = monsterNames;
        }
    )

    //Watches Character data in InitiativeTracker
    $scope.$watch(
        function(){ return InitiativeTrackerService.characterData },

        function(characterData) {
            $scope.characterData = characterData;
        }
    )

    //Current list of Main Characters
    $scope.mainCharacters = ["Ahmenhotep", "Kirk", "Acheron"];

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
        if (newCharacterName.ID){
            MonsterManager.getMonsterByID((newCharacterName.ID)).then(function(response){
                var monster = JSON.parse(response.data)
                MonsterManager.addMonsterToArray(monster);
                InitiativeTrackerService.setHp(newCharacterName.ID, monster.HP);
                InitiativeTrackerService.setInitiative(newCharacterName.ID, monster.Initiative);
            })
        }
        InitiativeTrackerService.addCharactersToInitiative(newCharacterName, newCharacterInitiative, newCharacterHp, newCharacterCount);
        this.newCharacterName = "";
        this.newCharacterInitiative = "";
        this.newCharacterCount = 1;
        this.newCharacterHp = "";
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
        if (!$scope.combatStarted) {
            //Set Rounds = 1
            $scope.roundCounter = 1;
            //Adds a new item to the start of the initiative order to keep track of the start of a new round
            $scope.addCharactersToInitiative("Start of New Round", 1000, 0, 1);
            //Order list of characters by initiative
            InitiativeTrackerService.sortCharacterDataByInitiative();

            $scope.combatStarted = true;
        }
    }

    $scope.autoCompleteSearch = function (query) {
        $http({
            url:"http://localhost:53927/api/initiativetrackernameautocomplete",
            method: "get"
        }).success(function(data){
            return data;
        });
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

