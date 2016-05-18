'use strict';

var MonsterService = angular.module('PathfinderManager.MonsterService', []);

MonsterService.service('MonsterManager', function($http, $sce){

    //Current monster object used in display
    this.currentMonster = {};
    this.monsters = [];
    this.monsterNames = [];
    this.noteLabels = ["Init", "Senses", "Perception", "Aura", "AC", "hp", "Fort", "Ref", "Will", "DR", "Defensive Abilities", "Immune", "Speed",
        "Melee", "Ranged", "Special Attacks", "Domain Spell-Like Abilities", "Spells Known", "Spells Prepared", "Arcane Spells Known", "Divine Spells Known",
        "Bloodlines", "Bloodline", "Reach", "Str", "Dex", "Con", "Int", "Wis", "Cha", "Base Atk", "CMB", "CMD", "Feats", "SKills", "Languages", "SQ", "XP", "Space",
        "Constant", "Spell-Like Abilities", "Skills", "Gear", "Arcane School"]
    this.url = "http://localhost:53927/api/";
    //this.url = "https://home.schmidtaki.com/pfmanager/api/"
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
    //Removes monster name from list of monster names when monster is deleted
    this.removeMonsterName = function(ID){
        if (ID != 0) {
            var monsterArray = $.grep(this.monsterNames, function (x) {
                return x.ID == ID
            });
            if (monsterArray.length != 0) {
                var index = this.monsterNames.indexOf(monsterArray[0]);
                this.monsterNames.splice(index, 1);
            }
        }
    }

    //Adds monster name to list of monster names when monster is added or edited
    this.addMonsterName = function(monsterName){
        this.monsterNames.push(monsterName);
    }

    //Adds monster to array of monsters
    this.addMonsterToArray = function(monster){
        var newMonster = this.createNewMonsterData(monster);
        this.monsters.push(newMonster);
    }

    //Gets monster with monsterID from database
    this.getMonsterByID = function(monsterID){
        var promise = $http({
            url: this.url + "pathfindermonster/"+monsterID,
            method: "get",
            cache: true
        })
        return promise;
    }

    //Gets list of all Monster Names
    this.getAllMonsterNames = function(){
        var promise = $http({
            url: this.url + "initiativetrackernameautocomplete",
            method: "get",
            cache: true
        })
        return promise;
    }

    //Set monster name to new list of monster names
    this.setMonsterNames = function(names){
        this.monsterNames = names;
    }

    //Takes monster from MonsterCreator form and creates new monster in database
    this.createNewMonster = function(newMonster){
        var monsterData = angular.toJson(newMonster);
        var promise = $http({
            url: this.url + "pathfindermonster",
            contentType: "application/json",
            method: "Put",
            data: {'monsterDataString': monsterData},
            /*crossDomain: true,*/
            headers: {
                "Content-Type": "application/json"
            }
        });
        return promise;
    }

    //Edits existing monster by deleting existing monster and creating new one
    this.editMonster = function(id, newMonster){
        var monsterData = angular.toJson(newMonster);
        var promise = $http({
            url: this.url + "pathfindermonstereditor/"+id,
            contentType: "application/json",
            method: "Put",
            data: {'monsterDataString': monsterData},
            /*crossDomain: true,*/
            headers: {
                "Content-Type": "application/json"
            }
        });
        return promise;
    }

    //Deletes existing monster from database
    this.deleteMonster = function(id){
        $http({
            url: this.url + "pathfindermonstereditor/"+id,
            contentType: "application/json",
            method: "Delete",
            /*crossDomain: true,*/
            headers: {
                "Content-Type": "application/json"
            }
        });
    }

    //Creates new javascript object (monster) with data from database
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
            currentHP: 1,
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
        monster.attacks = [];
        monster.monsterAdditionalNotes = [];

        this.setMonsterAttacks(monster, newMonster);
        this.setMonsterAdditionalNotes(monster, newMonster);

        return monster;
    }

    //Initializes monster attacks
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

    //Initializes monster additional notes
    this.setMonsterAdditionalNotes = function(monster, newMonster){
        for (var i = 0; i < newMonster.Monster_Additional_Notes.length; i++){
            var note = newMonster.Monster_Additional_Notes[i];
            if (note != null && note.Notes != null) {
                var tempNotes = this.formatAdditionalNotes(note.Notes);
                var noteValue = $sce.trustAsHtml(tempNotes);
                var newNote = {heading: note.Name, value: noteValue}
                monster.monsterAdditionalNotes.push(newNote);
            }
        }
    }

    this.formatAdditionalNotes = function(noteValue){
        for (var i = 0, word; word = this.noteLabels[i]; i++){
            //noteValue = noteValue.replace(this.noteLabels[i], "<b>"+this.noteLabels[i]+"</b>");
            var re = new RegExp("\\b"+word+"\\b", 'g');
            noteValue = noteValue.replace(re, "<b>" + word + "</b>");
        }
        return noteValue;
    }


});