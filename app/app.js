'use strict';

// Declare app level module which depends on views, and components
var PathfinderManager = angular.module('PathfinderManager', []);

PathfinderManager.controller('CombatManager', ['$scope', '$filter', function($scope, $filter) {
    $scope.roundCounter = 1;
    $scope.numOfActions = 0;
    $scope.data = [{name:"Boromir", initiative:17, statuses:[{name: "Dazed", duration: 1}, {name: "Stunned", duration: 3}]},
        {name:"Arc", initiative:12, statuses:[{name: "Poisoned", duration: 8}, {name: "Stunned", duration: 3}]},
        {name:"Rhaelyn", initiative:13, statuses:[{name: "Dazzled", duration: 9}, {name: "Diseased", duration: 5}]}];

    $scope.addItem = function () {
        var item= {name:this.newCharacterName, initiative: this.newCharacterInitiative, statuses:[]};
        //var item = {name:"test", initiative: 1}
        $scope.data.push(item);
        $scope.newCharacterName = "";
        $scope.newCharacterInitiative = 0;
    };

    $scope.addStatus = function ($statusScope, $index) {
        var status= {name:this.newStatusName, duration: this.newStatusDuration};
        //var item = {name:"test", initiative: 1}
        $scope.data[$index].statuses.push(status);
        $statusScope.newStatusName = "";
        $statusScope.newStatusDuration = 0;
    };

    $scope.nextInitiative = function(){

        $scope.data.push($scope.data.shift());


        angular.forEach($scope.data[0].statuses, function(status){
            status.duration = status.duration -1;
            if (status.duration == -1){
                $scope.data[0].statuses.splice($scope.data[0].statuses.indexOf(status), 1);
            }
        });

        $scope.numOfActions = $scope.numOfActions + 1;
        if ($scope.numOfActions == $scope.data.length){
            $scope.numOfActions = 0;
            $scope.roundCounter = $scope.roundCounter + 1;
        }
    };

    $scope.startCombat = function(){
        $scope.roundCounter = 1;
        $scope.data = $filter('orderBy')($scope.data, "-initiative");
    }


}]);