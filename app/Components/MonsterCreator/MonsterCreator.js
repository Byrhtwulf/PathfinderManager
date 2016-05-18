'use strict';

var creator = angular.module('PathfinderManager.MonsterCreator', []);

creator.controller('MonsterCreator', ['$scope', 'MonsterManager', function($scope, MonsterManager) {

    MonsterManager.getAllMonsterNames().then(function(response){
        MonsterManager.setMonsterNames(response.data);
    });

    $scope.$watch(
        function(){ return MonsterManager.monsterNames },

        function(monsterNames) {
            $scope.monsterNames = monsterNames;
        }
    )

    $scope.currentMonsterName = "";

    $scope.MonsterCreated = false;
    $scope.MonsterEdited = false;
    $scope.MonsterDeleted = false;
    $scope.useStatBlock = true;


    $scope.addAttackGroup = function(){
        var attackGroup = {groupName: "", groupAttacks:[]};
        attackGroup.groupAttacks.push(angular.copy($scope.newAttack));
        $scope.newMonster.attacks.push(attackGroup);
    }
    $scope.deleteAttackGroup = function(attackGroup){
        var index = $scope.newMonster.attacks.indexOf(attackGroup);
        $scope.newMonster.attacks.splice(index, 1);
    }

    $scope.addAttack = function(attackGroup){
        attackGroup.groupAttacks.push(angular.copy($scope.newAttack));
    }

    $scope.deleteAttack = function(attackGroup, attack){
        var index = attackGroup.groupAttacks.indexOf(attack);
        attackGroup.groupAttacks.splice(index, 1);
    }

    $scope.addAdditionalNotes = function(){
        var note = {noteTitle:"", noteBody:""}
        $scope.newMonster.monsterAdditionalNotes.push(note);
    }
    $scope.removeAdditionalNotes = function(note){
        var index = $scope.newMonster.additionalNotes.indexOf(note);
        $scope.newMonster.monsterAdditionalNotes.splice(index, 1);
    }

    $scope.submitMonster = function(){
        var id = $scope.newMonster.ID;
        var name = $scope.newMonster.name;
        MonsterManager.addMonsterName({ID:id, Name: name});
        if ($scope.useStatBlock){
            $scope.newMonster.monsterAdditionalNotes = angular.copy($scope.statBlockAbilities);
        }
        MonsterManager.createNewMonster($scope.newMonster).then(function(response){
            MonsterManager.addMonsterName(response.data);
        });
        $scope.newMonster = angular.copy($scope.emptyMonster);
        $scope.statBlockAbilities = angular.copy($scope.emptyStatBlockAbilities);
        $scope.MonsterCreated = true;
    }

    $scope.editMonster = function(id){
        MonsterManager.removeMonsterName(id);
        MonsterManager.editMonster(id, $scope.newMonster).then(function(response){
            MonsterManager.addMonsterName(response.data);
        });
        $scope.newMonster = angular.copy($scope.emptyMonster);
        $scope.MonsterEdited = true;
    }

    $scope.retrieveMonster = function(currentMonster){
        var monsterName = "";
        var monsterId = 0;
        if (currentMonster.Name && currentMonster.ID) {
            monsterName = currentMonster.Name;
            monsterId = currentMonster.ID;
        }else {
            monsterName = currentMonster.trim();
        }
        MonsterManager.getMonsterByID(monsterId).then(function(response){
            var monster = JSON.parse(response.data)
            var editedMonster = MonsterManager.createNewMonsterData(monster);
            $scope.newMonster = editedMonster;
            $scope.currentMonsterName = null;
        })
    }

    $scope.deleteMonster = function(id){
        MonsterManager.removeMonsterName(id);
        MonsterManager.deleteMonster(id);
        $scope.newMonster = angular.copy($scope.emptyMonster);
        $scope.MonsterDeleted = true;
    }

    $scope.statBlockAbilities = [{noteTitle: "Info", noteBody: ""}, {noteTitle: "Defense", noteBody: ""}, {noteTitle: "Offense", noteBody: ""}, {noteTitle: "Statistics", noteBody: ""}, {noteTitle: "Special Abilities", noteBody: ""} ]
    $scope.emptyStatBlockAbilities = [{noteTitle: "Info", noteBody: ""}, {noteTitle: "Defense", noteBody: ""}, {noteTitle: "Offense", noteBody: ""}, {noteTitle: "Statistics", noteBody: ""}, {noteTitle: "Special Abilities", noteBody: ""} ]


    $scope.newAttack =  {name:"", bonusToHit: "", diceValue: "", diceCount: "", diceBonus:"", currentRollToHit: 0, currentTotalToHit: 0, currentDamage:0, lowerCriticalRange: "", additionalEffects:""}
    $scope.newMonster = {
        ID: 0,
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
        monsterAdditionalNotes: [{noteTitle: "Special", noteBody: ""}]
    }

    $scope.emptyMonster = {
        ID: 0,
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
        monsterAdditionalNotes: [{noteTitle: "Special", noteBody: ""}]
    }

}]);