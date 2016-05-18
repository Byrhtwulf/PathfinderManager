'use strict';

var display = angular.module('PathfinderManager.MonsterDisplay', ["PathfinderManager.MonsterService"]);

display.controller('MonsterDisplay', ['$scope', 'MonsterManager', function($scope, MonsterManager) {
    //Watches changes to current monster
    $scope.$watch(
        function(){ return MonsterManager.currentMonster },

        function(newMonster) {
            $scope.currentMonster = newMonster;
        }
    )

    $scope.$watch(
        function(){ return MonsterManager.monsters },

        function(monsterList) {
            $scope.monsters = monsterList;
        }
    )

    $scope.useStatBlock = true;

    $scope.changeMonster = function(ID){
        MonsterManager.updateCurrentMonster(ID);
    }

    //Roll CMB for current monster
    $scope.rollCMB = function(currentMonster){
        currentMonster.currentCMBRoll = Math.floor(Math.random() * 20) + 1;
        currentMonster.currentCMB = currentMonster.currentCMBRoll + parseInt(currentMonster.CMB, 10);
    };

    //Roll attack for monster's attack group
    $scope.rollAttack = function(group){
        angular.forEach(group.groupAttacks, function(attack) {
            var total = 0;
            attack.currentRollToHit = Math.floor(Math.random() * 20) + 1;
            attack.currentTotalToHit = attack.currentRollToHit + attack.bonusToHit;
            for (var i = 0; i < attack.diceCount; i++) {

                var currentRoll = Math.floor(Math.random() * attack.diceValue) + 1;
                total += currentRoll;
            }
            attack.currentDamage = total + attack.diceBonus;
        });
    };


}]);