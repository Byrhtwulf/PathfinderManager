'use strict';

var MonsterService = angular.module('PathfinderManager.MonsterService', []);

MonsterService.service('MonsterManager', function($http){

    //Current monster object used in display
    this.currentMonster = {};
    this.monsters = [];

    //retrieves current monster
    this.getCurrentMonster = function(){
        if (this.currentMonster === undefined) {
            return {};
        }else{
            return this.currentMonster;
        }
    }

    //Updates current monster based on monster name
    this.updateCurrentMonster = function(ID){
        if (ID != 0) {
            var monsterArray = $.grep(this.monsters, function (x) {
                return x.ID == ID
            });
            if (monsterArray.length != 0) {
                this.currentMonster = monsterArray[0];
            }
        }
    };

    //Adds monster to array of monsters
    this.addMonsterToArray = function(monster){
        var newMonster = this.createNewMonsterData(monster);
        this.monsters.push(newMonster);
    }

    //Gets monster with monsterID from database
    this.getMonsterByID = function(monsterID){
        var promise = $http({
            url:"http://localhost:53927/api/pathfindermonster/"+monsterID,
            method: "get",
            cache: true
        })
        return promise;
    }

    //Gets list of all Monster Names
    this.getAllMonsterNames = function(){
        var promise = $http({
            url:"http://localhost:53927/api/initiativetrackernameautocomplete",
            method: "get",
            cache: true
        })
        return promise;
    }

    //Takes monster from MonsterCreator form and creates new monster in database
    this.createNewMonster = function(newMonster){
        var monsterData = angular.toJson(newMonster);
        $http({
            url: "http://localhost:53927/api/pathfindermonster",
            contentType: "application/json",
            method: "Put",
            data: {'monsterDataString': monsterData},
            /*crossDomain: true,*/
            headers: {
                "Content-Type": "application/json"
            }
        });
    }

    this.createNewMonsterData = function(newMonster){
        var monster = {
            ID: 0,
            name:"",
            type:"",
            initiative: 0,
            senses:"",
            AC: "",
            auras: "",
            HP: 0,
            HPMods: "",
            HD: 0,
            fortitude: 0,
            reflex: 0,
            will: 0,
            saveMods: "",
            defenses: "",
            defensiveAbilities: "",
            weaknesses: "",
            reach:"",
            speed:"",
            attacks:[],
            baseAttack: 0,
            CMB: 0,
            CMBMods: "",
            currentCMB: 0,
            currentCMBRoll:0,
            CMD: 0,
            specialAttacks: "",
            specialQualities: "",
            abilityScores: "",
            feats:"",
            skills:"",
            description:"",
            additionalNotes:[]


        }
        monster.ID = newMonster.ID;
        monster.name = newMonster.Name;
        monster.type = newMonster.Type;
        monster.initiative = newMonster.Initiative;
        monster.senses = newMonster.Senses;
        monster.auras = newMonster.Auras;
        monster.AC = newMonster.AC;
        monster.HP = newMonster.HP;
        monster.HPMods = newMonster.HP_Mods;
        monster.HD = newMonster.HD;
        monster.fortitude = newMonster.Fortitude;
        monster.reflex = newMonster.Reflex;
        monster.will = newMonster.Will;
        monster.saveMods = newMonster.Save_Mods;
        monster.defenses = newMonster.Defenses;
        monster.defensiveAbilities = newMonster.Defensive_Abilities;
        monster.weaknesses = newMonster.Weaknesses;
        monster.speed = newMonster.Speed;
        monster.reach = newMonster.Reach;
        monster.baseAttack = newMonster.Base_Attack;
        monster.CMB = newMonster.CMB;
        monster.CMBMods = newMonster.CMB_Mods;
        monster.CMD = newMonster.CMD;
        monster.specialAttacks = newMonster.Special_Attacks;
        monster.specialQualities = newMonster.Special_Qualities;
        monster.abilityScores = newMonster.Ability_Scores;
        monster.feats = newMonster.Feats;
        monster.skills = newMonster.skills;
        monster.description = newMonster.Description;

        this.setMonsterAttacks(monster, newMonster);
        this.setMonsterAdditionalNotes(monster, newMonster);

        return monster;
    }

    this.setMonsterAttacks = function(monster, newMonster){
        for (var i = 0; i < newMonster.Monster_Attack_Groups.length; i++){
            var attackGroup = newMonster.Monster_Attack_Groups[i];
            var newAttackGroup = {groupName:attackGroup.Name, groupAttacks: []};
            for (var j = 0; j < attackGroup.Monster_Attacks.length; j++){
                var attack = attackGroup.Monster_Attacks[j];
                var attackArray = attack.To_Hit.split("/");
                for (var k = 0; k < attackArray.length; k ++){
                    var newAttack = {name:attack.Name, bonusToHit: parseInt(attackArray[k]), diceValue: attack.Dice_Value, diceCount: attack.Dice_Count,
                        diceBonus:attack.Bonus_Damage, currentRollToHit: 0, currentTotalToHit: 0, currentDamage:0, lowerCriticalRange: attack.Lower_Crit_Range,
                        additionalEffects:attack.Additional_Effects}
                    newAttackGroup.groupAttacks.push(newAttack);
                }

            }
            monster.attacks.push(newAttackGroup);

        }
    }

    this.setMonsterAdditionalNotes = function(monster, newMonster){
        for (var i = 0; i < newMonster.Monster_Additional_Notes.length; i++){
            var note = newMonster.Monster_Additional_Notes[i];
            var newNote = {heading:note.Name, value:note.Notes}
            monster.additionalNotes.push(newNote);
        }
    }


});