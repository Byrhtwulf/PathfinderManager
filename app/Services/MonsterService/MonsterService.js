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

    //Sets current monster object
    this.setCurrentMonster = function(monster){
        this.currentMonster = monster;
    }

    //Updates current monster based on monster name
    this.updateCurrentMonster = function(ID){
        if (ID != 0) {
            var monsterArray = $.grep(this.monsters, function (x) {
                return x.ID == ID
            });
            if (monsterArray.length != 0) {
                this.setCurrentMonster(monsterArray[0]);
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

    //Array of monsters
    /*this.monsters = [
        {
            name:"Hound Archon",
            type:"LG Medium Outsider",
            initiative: 4,
            senses:"Darkvision 60ft, detect evil, low-light vision, scent, Perception+10",
            AC: "19, touch 10, flatfooted 19 (+9 natural; +2 deflection against evil)",
            auras: "Aura of Menace (DC16)",
            HP: 39,
            fortitude: 6,
            reflex: 5,
            will: 5,
            defences: "DR 10/evil, Immune electricity, petrification, SR15",
            speed:"30ft",
            attacks:[
                {groupName:"Using Natural Attacks", groupAttacks: [
                    {name:"Bite", bonusToHit: 8, diceValue: 8, diceCount: 1, diceBonus:3, currentRollToHit: 0, currentTotalToHit: 0, currentDamage:0, lowerCriticalRange: 15, additionalEffects:"Bleed(1d6)"},
                    {name:"Slam", bonusToHit: 8, diceValue: 8, diceCount: 1, diceBonus:1, currentRollToHit: 0, currentTotalToHit: 0, currentDamage:0, lowerCriticalRange: 15, additionalEffects:"Grab"}
                ]},
                {groupName:"Using Greatsword", groupAttacks: [
                    {name:"Mwk Greatsword", bonusToHit: 9, diceValue: 6, diceCount: 2, diceBonus:3, currentRollToHit: 0, currentTotalToHit: 0, currentDamage:0, lowerCriticalRange: 15, additionalEffects:""},
                    {name:"Mwk Greatsword", bonusToHit: 4, diceValue: 6, diceCount: 2, diceBonus:3, currentRollToHit: 0, currentTotalToHit: 0, currentDamage:0, lowerCriticalRange: 15, additionalEffects:""},
                    {name:"Bite", bonusToHit: 3, diceValue: 8, diceCount: 1, diceBonus:3, currentRollToHit: 0, currentTotalToHit: 0, currentDamage:0, lowerCriticalRange: 15, additionalEffects:""}
                ]},
                {groupName:"Using Natural Attacks w/ Power Attack", groupAttacks: [
                    {name:"Bite", bonusToHit: 6, diceValue: 8, diceCount: 1, diceBonus:9, currentRollToHit: 0, currentTotalToHit: 0, currentDamage:0, lowerCriticalRange: 15, additionalEffects:""},
                    {name:"Slam", bonusToHit: 6, diceValue: 8, diceCount: 1, diceBonus:5, currentRollToHit: 0, currentTotalToHit: 0, currentDamage:0, lowerCriticalRange: 15, additionalEffects:""}
                ]},
                {groupName:"Using Greatsword w/Power Attack", groupAttacks: [
                    {name:"Mwk Greatsword", bonusToHit: 7, diceValue: 6, diceCount: 2, diceBonus:9, currentRollToHit: 0, currentTotalToHit: 0, currentDamage:0, lowerCriticalRange: 15, additionalEffects:""},
                    {name:"Mwk Greatsword", bonusToHit: 7, diceValue: 6, diceCount: 2, diceBonus:9, currentRollToHit: 0, currentTotalToHit: 0, currentDamage:0, lowerCriticalRange: 15, additionalEffects:""},
                    {name:"Bite", bonusToHit: 1, diceValue: 8, diceCount: 1, diceBonus:6, currentRollToHit: 0, currentTotalToHit: 0, currentDamage:0, lowerCriticalRange: 15, additionalEffects:""}
                ]}],
            baseAttack: 6,
            CMB: 8,
            currentCMB: 0,
            currentCMBRoll:0,
            CMD: 18,
            feats:"Improved Initiative, Iron Will, Power Attack",
            skills:"Acrobatics + 9, Intimidate + 10, Stealth + 13, Survival + 14",
            additionalNotes:[
                {heading:"Aura of Menace(DC 16)", value:"A righteous aura surrounds archons that fight or get angry. Any " +
                "hostile creature within a 20-foot radius of an archon must succeed on a Will save to resist its effects. " +
                "The save DC varies with the type of archon, is Charisma-based, and includes a +2 racial bonus. Those who fail " +
                "take a -2 penalty on attacks, AC, and saves for 24 hours or until they successfully hit the archon that generated " +
                "the aura. A creature that has resisted or broken the effect cannot be affected again by the same archon's aura for 24 hours."},
                {heading:"Constant Abilities", value: "Detect Evil, Magic Circle Against Evil"},
                {heading:"SLA(Caster Level 6th)", value: "Aid, Continual Flame, Greater Teleport"},
                {heading:"Change Shape:", value:"A hound archon can assume any canine form of Small to Large size, " +
                "as if using beast shape II. While in canine form, the hound archon loses its bite, slam, and greatsword " +
                "attacks, but gains the bite attack of the form it chooses. For the purposes of this ability, canines include " +
                "any dog-like or wolf-like creature of the animal type."}
            ]

        },
        {
            name:"Succubus",
            type:"CE Medium Outsider",
            initiative: 3,
            senses:"darkvision 60 ft., detect good; Perception +21",
            auras: "",
            AC: "20, touch 13, flat-footed 17 (+3 Dex, +7 natural)",
            HP: 84,
            fortitude: 7,
            reflex: 9,
            will: 10,
            defences: "DR 10/cold iron or good; Immune electricity, fire, poison; Resist acid 10, cold 10; SR 18",
            speed:"30 ft, fly 50ft",
            attacks:[
                {groupName:"Using Natural Attacks", groupAttacks: [
                    {name:"Claw", bonusToHit: 11, diceValue: 6, diceCount: 1, diceBonus:1, currentRollToHit: 0, currentTotalToHit: 0, currentDamage:0, lowerCriticalRange: 15, additionalEffects:"Bleed(1d6)"},
                    {name:"Claw", bonusToHit: 11, diceValue: 6, diceCount: 1, diceBonus:1, currentRollToHit: 0, currentTotalToHit: 0, currentDamage:0, lowerCriticalRange: 15, additionalEffects:"Grab"}
                ]}
            ],
            baseAttack: 8,
            CMB: 11,
            currentCMB: 0,
            currentCMBRoll:0,
            CMD: 22,
            feats:"Agile Maneuvers, Combat Reflexes, Iron Will, Weapon Finesse",
            skills:"Bluff +27, Diplomacy +19, Disguise +19, Escape Artist +11, Fly +14, Intimidate +16, Knowledge (local) +15, Perception +21, Sense Motive +13, Stealth +14; Racial Modifiers +8 Bluff, +8 Perception",
            additionalNotes:[
                {heading:"Energy Drain (Su)", value:"A succubus drains energy from a mortal she lures into an act of passion, such as a kiss. An unwilling victim must be grappled before the succubus can use this ability. The succubus's kiss bestows one negative level. The kiss also has the effect of a suggestion spell, asking the victim to accept another act of passion from the succubus. The victim must succeed on a DC 22 Will save to negate the suggestion. The DC is 22 for the Fortitude save to remove a negative level. These save DCs are Charisma-based."},
                {heading:"Profane Gift (Su)", value: "Once per day as a full-round action, a succubus may grant a profane gift to a willing humanoid creature by touching it for 1 full round. The target gains a +2 profane bonus to an ability score of his choice. A single creature may have no more than one profane gift from a succubus at a time. As long as the profane gift persists, the succubus can communicate telepathically with the target across any distance (and may use her suggestion spell-like ability through it). A profane gift is removed by dispel evil or dispel chaos. The succubus can remove it as well as a free action (causing 2d6 Charisma drain to the victim, no save)."}
            ],
            rollCMB: function(){
                this.currentCMB = Math.floor(Math.random() * 20) + 1 + this.CMB;
            },
            rollAttack: function(group){
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
            }
        }
    ];*/

});