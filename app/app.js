'use strict';

// Declare app level module which depends on views, and components
var PathfinderManager = angular.module('PathfinderManager', ['cfp.hotkeys', "checklist-model", "ui.sortable", "ngAnimate", "ui.bootstrap"]);

PathfinderManager.controller('CombatManager', ['$scope', '$filter', 'hotkeys', '$uibModal', function($scope, $filter, hotkeys, $uibModal) {
    $scope.diceList = [
        {diceValue:20, diceCount:"",  diceBonus:"", rolls:[]},
        {diceValue:12, diceCount:"", diceBonus:"", rolls:[]},
        {diceValue:10, diceCount:"", diceBonus:"", rolls:[]},
        {diceValue:8, diceCount:"", diceBonus:"", rolls:[]},
        {diceValue:6, diceCount:"", diceBonus:"", rolls:[]},
        {diceValue:4, diceCount:"", diceBonus:"", rolls:[]},
        {diceValue:100, diceCount:"", diceBonus:"", rolls:[]}
    ]

    $scope.customRolls = {customRollFormula:"", rolls: []};
    $scope.roundCounter = 1; //Current Number of Rounds
    $scope.numOfActions = 0; //Number of characters that have gone in current round
    //Stores characters in initiative order
    $scope.characterData = [{characters:[{name:"Boromir", currentHp: 78, hpDifference: "", newStatus:"", statuses:[{name: "Dazed", duration: 1}, {name: "Stunned", duration: 3}]}], initiative:17,},
        {characters:[{name:"Arc", currentHp: 69, hpDifference:"", newStatus:"", statuses:[{name: "Poisoned", duration: 8}, {name: "Stunned", duration: 3}]}], initiative:12,},
        {characters:[{name:"Rhaelyn", currentHp: 100,  hpDifference:"", newStatus:"", statuses:[{name: "Dazzled", duration: 9}, {name: "Diseased", duration: 5}]}], initiative:13,},
        {characters:[{name:"Skirmisher 1", currentHp: 100,  hpDifference:"", newStatus:"", statuses:[{name: "Dazzled", duration: 9}, {name: "Diseased", duration: 5}]},
                    {name:"Skirmisher 2", currentHp: 100,  hpDifference:"", newStatus:"", statuses:[{name: "Dazzled", duration: 9}, {name: "Diseased", duration: 5}]},
                    {name:"Skirmisher 3", currentHp: 100,  hpDifference:"", newStatus:"", statuses:[{name: "Dazzled", duration: 9}, {name: "Diseased", duration: 5}]}], initiative:10,
        }];
    //$scope.characterData=[];

    $scope.mainCharacters = ["Arc", "Boromir", "Kabuto", "Rhaelyn"];

    //List of characters to add group status to
    $scope.charactersToAddStatuses = [];

    $scope.emptyArray = [];

    $scope.currentCharacter = {};

    $scope.monsters = [
        {
        name:"Hound Archon",
        type:"LG Medium Outsider",
        initiative: 4,
        senses:"Darkvision 60ft, detect evil, low-light vision, scent, Perception+10",
        AC: "19, touch 10, flatfooted 19 (+9 natural; +2 deflection against evil)",
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
            CMD: 22,
            feats:"Agile Maneuvers, Combat Reflexes, Iron Will, Weapon Finesse",
            skills:"Bluff +27, Diplomacy +19, Disguise +19, Escape Artist +11, Fly +14, Intimidate +16, Knowledge (local) +15, Perception +21, Sense Motive +13, Stealth +14; Racial Modifiers +8 Bluff, +8 Perception",
            additionalNotes:[
                {heading:"Energy Drain (Su)", value:"A succubus drains energy from a mortal she lures into an act of passion, such as a kiss. An unwilling victim must be grappled before the succubus can use this ability. The succubus's kiss bestows one negative level. The kiss also has the effect of a suggestion spell, asking the victim to accept another act of passion from the succubus. The victim must succeed on a DC 22 Will save to negate the suggestion. The DC is 22 for the Fortitude save to remove a negative level. These save DCs are Charisma-based."},
                {heading:"Profane Gift (Su)", value: "Once per day as a full-round action, a succubus may grant a profane gift to a willing humanoid creature by touching it for 1 full round. The target gains a +2 profane bonus to an ability score of his choice. A single creature may have no more than one profane gift from a succubus at a time. As long as the profane gift persists, the succubus can communicate telepathically with the target across any distance (and may use her suggestion spell-like ability through it). A profane gift is removed by dispel evil or dispel chaos. The succubus can remove it as well as a free action (causing 2d6 Charisma drain to the victim, no save)."}
            ]
        }
    ]

    $scope.rollCMB = function(character){
        character.currentCMB = Math.floor(Math.random() * 20) + 1 + character.CMB;
    }
    $scope.rollAttack = function(attackGroup){
        angular.forEach(attackGroup.groupAttacks, function(attack){
            var total=0;
            attack.currentRollToHit = Math.floor(Math.random() * 20) + 1;
            attack.currentTotalToHit = attack.currentRollToHit + attack.bonusToHit;
            for (var i = 0; i < attack.diceCount; i++){

                var currentRoll = Math.floor(Math.random() * attack.diceValue) + 1;
                total += currentRoll;
            }
            attack.currentDamage = total + attack.diceBonus;
        });
    }


    //Boolean value to determine if Add New Character Form should show
    $scope.toggleAddNewCharacterForm = function(){
        $scope.showAddNewCharacterForm = !$scope.showAddNewCharacterForm;
    }

    $scope.toggleAddMainCharacters = function(){
        $scope.showAddMainCharacters = !$scope.showAddMainCharacters;
    }

    $scope.toggleDiceHistory = function(dice){
        if (dice.showDiceHistory == true){
            dice.showDiceHistory =false;
        }else{
            dice.showDiceHistory = true;
        }
    }

    $scope.addMainCharacter = function ($event, mainCharacterName, mainCharacterInitiative){
        if ($event.keyCode==13) {
            $scope.addCharactersToInitiative(mainCharacterName, mainCharacterInitiative, 0, 1);
        }
    }

    //Adds new character to initiative order
    $scope.addCharactersToInitiative = function (newCharacterName, newCharacterInitiative, newCharacterHp, newCharacterCount) {
        if (newCharacterName.trim() != "") {
            $scope.characterData.push($scope.createNewCharacterGroup(newCharacterName, newCharacterInitiative, newCharacterHp, newCharacterCount));
            $scope.newCharacterName = "";
            $scope.newCharacterInitiative = "";
            $scope.newCharacterCount = 1;
            $scope.newCharacterHp = "";
        }
    };

    //Create New Character Group to add to initiative
    $scope.createNewCharacterGroup = function(newCharacterName, newCharacterInitiative, newCharacterHp, newCharacterCount){
        var characterGroup = {
            characters: [],
            initiative: newCharacterInitiative,
        }
        for(var i = 0; i < newCharacterCount; i++) {
            var characterName = newCharacterName.charAt(0).toUpperCase() + newCharacterName.slice(1);
            if (newCharacterCount > 1){
                characterName = characterName + " " + (i+1);
            }
            var newCharacter = {
                name: characterName,
                initiative: newCharacterInitiative,
                currentHp: newCharacterHp,
                hpDifference: "",
                newStatus: "",
                statuses: []
            };
            characterGroup.characters.push(newCharacter);
        }
        return characterGroup;
    }

    //Removes character from initiative
    $scope.removeCharacterFromInitiative = function(group, character){
        var characterIndex = group.characters.indexOf(character);
        group.characters.splice(characterIndex, 1);
        if (group.characters.length == 0){
            var groupIndex = $scope.characterData.indexOf(group);
            $scope.characterData.splice(groupIndex, 1);
        }
    }

    //Adds new status to character
    $scope.addStatusToCharacter = function ($event, character) {
        if ($event.keyCode==13) {
            var statusArray = character.newStatusName.split("=");
            if (statusArray[0] != null && statusArray[0] != ""
                && statusArray[1] != null && statusArray[1] != "") {
                var statusName = statusArray[0].charAt(0).toUpperCase() +statusArray[0].slice(1);
                var statusDuration = parseInt(statusArray[1], 10)
                var status = {name:statusName, duration:statusDuration };
                //var item = {name:"test", initiative: 1}
                character.statuses.push(status);
                character.newStatusName = "";
            }
        }
    };

    $scope.removeStatusFromCharacter = function(character, status){
        var statusIndex = character.statuses.indexOf(status);
        character.statuses.splice(statusIndex, 1);
    }

    //Updates hp of character on Enter key
    $scope.updateHp = function($event, hpDifference, character){
        if ($event.keyCode == 13){
            character.currentHp = character.currentHp + hpDifference;
            character.hpDifference="";
        }
    }


    //Settings for Character Drag and Drop
    $scope.characterSort = {
        containment:"#initiative-tracker",
        cursor:"move"
    }

    //Create Modal Window for adding Group Status
    $scope.openAddGroupStatus = function(){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'addGroupStatus.html',
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

    //Moves to next character in initiative order
    $scope.nextInitiative = function(){

        //Move first character to bottom of initiative
        $scope.characterData.push($scope.characterData.shift());

        //Decrement all statuses for current character in initiative order
        angular.forEach($scope.characterData[0].characters, function(character){
            angular.forEach(character.statuses, function(status)
            {
                status.duration = status.duration - 1;
                if (status.duration <= -1) {
                    character.statuses.splice(character.statuses.indexOf(status), 1);
                }
            });
        });

        //Increases number of characters that have gone in current round and checks to see if round is over
        $scope.numOfActions = $scope.numOfActions + 1;
        if ($scope.numOfActions == $scope.characterData.length){
            $scope.numOfActions = 0;
            $scope.roundCounter = $scope.roundCounter + 1;
        }

        if ($scope.currentCharacter.name == $scope.monsters[0].name){
            $scope.currentCharacter = $scope.monsters[1];
        }else{
            $scope.currentCharacter = $scope.monsters[0];
        }
    };

    //Starts combat
    $scope.startCombat = function(){
        //Set Rounds = 1
        $scope.roundCounter = 1;
        //Order list of characters by initiative
        $scope.characterData = $filter('orderBy')($scope.characterData, "-initiative");
        $scope.clearAllDice();
        $scope.currentCharacter = $scope.monsters[0];
    }

    $scope.rollDice = function(dice){
        var total = 0;
        if (dice.diceCount == undefined ||  dice.diceCount == ""){
            dice.diceCount = 1;
        }
        if (dice.diceBonus == undefined || dice.diceBonus == ""){
            dice.diceBonus = 0;
        }
        var newRoll = $scope.createNewDice(dice.diceValue, dice.diceCount, dice.diceBonus);
        for (var i = 0; i < dice.diceCount; i++){

            var currentRoll = Math.floor(Math.random() * dice.diceValue) + 1;
            total += currentRoll;

            var oneDice = $scope.createNewDice(dice.diceValue, 1, 0);
            oneDice.currentRoll = currentRoll;
            oneDice.currentTotal = currentRoll + dice.diceBonus;
            newRoll.rolls.push(oneDice);
        }
        newRoll.currentRoll = total;
        total = total + dice.diceBonus;
        newRoll.currentTotal = total;
        dice.rolls.push(newRoll);

        if (dice.diceCount == 1){
            dice.diceCount = "";
        }
        if (dice.diceBonus == 0){
            dice.diceBonus = "";
        }


    }

    $scope.createNewDice= function(diceValue, diceCount, diceBonus){
        return {diceValue:diceValue, diceCount:diceCount, diceBonus:diceBonus, currentRoll: 0, currentTotal: 0, rolls:[]};
    }

    $scope.clearDiceRolls = function(dice){
        dice.currentTotal = 0;
        dice.diceCount = "";
        dice.diceBonus = "";
        dice.currentRoll = 0;
        dice.rolls = (angular.copy($scope.emptyArray));
    }

    $scope.clearAllDice = function(){
        angular.forEach($scope.diceList, function(dice){
            $scope.clearDiceRolls(dice);
        })
        $scope.clearCustomRoll();
    }

    $scope.rollCustomDice = function($event, customRollFormula){
        if ($event.keyCode == 13){
            var total = 0;
            var diceCount = customRollFormula.substring(0, customRollFormula.lastIndexOf("d"));
            var diceValue = customRollFormula.substring(customRollFormula.lastIndexOf("d")+1, customRollFormula.length);
            var diceBonus = 0;
            if (customRollFormula.indexOf("+") != -1){
                diceValue = customRollFormula.substring(customRollFormula.lastIndexOf("d")+1, customRollFormula.lastIndexOf("+"));
                diceBonus = customRollFormula.substring(customRollFormula.lastIndexOf("+")+1, customRollFormula.length);
            }

            var newRoll = $scope.createNewDice(diceValue, diceCount, diceBonus);
            for (var i = 0; i < diceCount; i++){

                var currentRoll = Math.floor(Math.random() * diceValue) + 1;
                total += currentRoll;

                var oneDice = $scope.createNewDice(diceValue, 1, 0);
                oneDice.currentRoll = currentRoll;
                oneDice.currentTotal = currentRoll;
                newRoll.rolls.push(oneDice);
            }
            newRoll.currentRoll = total;
            if (diceBonus == ""){
                newRoll.currentTotal = total;
            }else{
                newRoll.currentTotal = total + parseInt(diceBonus, 10);
            }
            $scope.customRolls.rolls.push(newRoll);
        }
    }

    $scope.clearCustomRoll = function(){
        $scope.customRolls.customRollFormula = "";
        $scope.customRolls.rolls = angular.copy($scope.emptyArray);
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