'use strict';

var PathfinderManager = angular.module('PathfinderManager');
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