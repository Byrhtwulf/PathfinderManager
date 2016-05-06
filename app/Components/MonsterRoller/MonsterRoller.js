'use strict';

var display = angular.module('PathfinderManager.MonsterRoller', ["PathfinderManager.MonsterService"]);

display.controller('MonsterRoller', ['$scope', 'MonsterManager', function($scope, MonsterManager) {
    $scope.currentMonster = {};
    $scope.monsters = [];
    $scope.monsterCount = 1;
    $scope.hpDifference = 0;
    $scope.$watch(
        function(){ return MonsterManager.monsterNames },

        function(monsterNames) {
            $scope.monsterNames = monsterNames;
        }
    )

    $scope.clearName = function(){
        $scope.newMonster = null;
    }

    $scope.addMonsterToDisplay = function (monster) {
        if (monster.ID){
            MonsterManager.getMonsterByID((monster.ID)).then(function(response){
                var monster = JSON.parse(response.data)
                var editedMonster = MonsterManager.createNewMonsterData(monster);
                var newName = editedMonster.name + " " + $scope.monsterCount;
                while($scope.getMonsterByName(newName) != null){
                    $scope.monsterCount = $scope.monsterCount + 1;
                    newName =  editedMonster.name + " " + $scope.monsterCount;
                }
                editedMonster.name = newName;
                $scope.monsterCount = 1;
                $scope.monsters.push(editedMonster);
                $scope.currentMonster = editedMonster;
                var newMonster = $scope.getMonsterByName(editedMonster.name);
                if (newMonster != null){
                    newMonster.currentHP = monster.HP;
                }
            })
        }
    }

    $scope.updateCurrentMonster = function(name){
        var monster = $scope.getMonsterByName(name);
        if (monster != null){
            $scope.currentMonster = monster;
        }
    }

    $scope.getMonsterByName = function (name){
        var monster = $.grep($scope.monsters, function(obj){
            return obj.name == name;
        })[0];
        return monster;
    }

    $scope.getMonsterByID = function(ID){
        var monster = $.grep($scope.monsters, function(obj){
            return obj.ID == ID;
        })[0];
        return monster;
    }

    $scope.updateCurrentMonsterHP = function(hpDifference){
        $scope.currentMonster.currentHP = ($scope.currentMonster.currentHP + hpDifference);
        $scope.currentMonster.hpDifference = "";
    }

    $scope.deleteMonster = function(){
        var index = $scope.monsters.indexOf($scope.currentMonster);
        $scope.monsters.splice(index, 1);
        if ($scope.monsters.size > 0){
            $scope.currentMonster = monsters[0];
        }else{
            $scope.currentMonster = null;
        }
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