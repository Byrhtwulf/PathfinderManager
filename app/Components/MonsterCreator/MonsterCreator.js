'use strict';

var creator = angular.module('PathfinderManager.MonsterCreator', []);

creator.controller('MonsterCreator', ['$scope', 'MonsterManager', function($scope, MonsterManager) {
    $scope.newMonster = {
        name: "",
        type: "",
        initiative: 0,
        senses: "",
        auras: "",
        AC: "",
        HP: "",
        HD: 0,
        HPmods: "",
        fortitude: "",
        reflex: "",
        will: "",
        saveMods: "",
        defenses: "",
        defensiveAbilities: "",
        weaknesses: "",
        speed: "",
        space: "",
        reach: "",
        attacks: [{groupName:"Default Attack", groupAttacks:[{name:"", bonusToHit: "", diceValue: "", diceCount: "", diceBonus:"", currentRollToHit: 0, currentTotalToHit: 0, currentDamage:0, lowerCriticalRange: "", additionalEffects:""}]}],
        baseAttack: 0,
        CMB: "",
        CMBMods:"",
        currentCMB: 0,
        currentCMBRoll: 0,
        CMD: "",
        specialAttacks: "",
        specialQualities: "",
        abilityScores: "",
        feats: "",
        skills: "",
        description: "",
        monsterAdditionalNotes: [{noteTitle: "Notes", noteBody: ""}]
    }

    $scope.addAttackGroup = function(){
        var attackGroup = {groupName: "", groupAttacks:[]};
        $scope.newMonster.attacks.push(attackGroup);
    }
    $scope.deleteAttackGroup = function(attackGroup){
        var index = $scope.newMonster.attacks.indexOf(attackGroup);
        $scope.newMonster.attacks.splice(index, 1);
    }

    $scope.addAttack = function(attackGroup){
        var attack =  {name:"", bonusToHit: "", diceValue: "", diceCount: "", diceBonus:"", currentRollToHit: 0, currentTotalToHit: 0, currentDamage:0, lowerCriticalRange: "", additionalEffects:""}
        attackGroup.groupAttacks.push(attack);
    }

    $scope.deleteAttack = function(attackGroup, attack){
        var index = attackGroup.groupAttacks.indexOf(attack);
        attackGroup.groupAttacks.splice(index, 1);
    }

    $scope.addAdditionalNotes = function(){
        var ability = {noteTitle:"", noteBody:""}
        $scope.newMonster.additionalNotes.push(ability);
    }
    $scope.removeAdditionalNotes = function(note){
        var index = $scope.newMonster.additionalNotes.indexOf(note);
        $scope.newMonster.additionalNotes.splice(index, 1);
    }

    $scope.submitMonster = function(){
        MonsterManager.createNewMonster($scope.newMonster);
    }

}]);