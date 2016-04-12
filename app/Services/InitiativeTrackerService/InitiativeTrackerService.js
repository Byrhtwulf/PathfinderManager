'use strict';

var InitiativeTrackerService = angular.module('PathfinderManager.InitiativeTrackerService', ['PathfinderManager.MonsterService']);

InitiativeTrackerService.service('InitiativeTrackerService', ['MonsterManager', '$filter', 'MonsterMigrator', function(MonsterManager, $filter, MonsterMigrator){

  /*this.characterData = [{characters:[{name:"Boromir", currentHp: 78, hpDifference: "", newStatus:"", statuses:[{name: "Dazed", duration: 1}, {name: "Stunned", duration: 3}]}], initiative:17,},
    {characters:[{name:"Arc", currentHp: 69, hpDifference:"", newStatus:"", statuses:[{name: "Poisoned", duration: 8}, {name: "Stunned", duration: 3}]}], initiative:12,},
    {characters:[{name:"Rhaelyn", currentHp: 100,  hpDifference:"", newStatus:"", statuses:[{name: "Dazzled", duration: 9}, {name: "Diseased", duration: 5}]}], initiative:13,},
    {characters:[{name:"Skirmisher 1", currentHp: 100,  hpDifference:"", newStatus:"", statuses:[{name: "Dazzled", duration: 9}, {name: "Diseased", duration: 5}]},
      {name:"Skirmisher 2", currentHp: 100,  hpDifference:"", newStatus:"", statuses:[{name: "Dazzled", duration: 9}, {name: "Diseased", duration: 5}]},
      {name:"Skirmisher 3", currentHp: 100,  hpDifference:"", newStatus:"", statuses:[{name: "Dazzled", duration: 9}, {name: "Diseased", duration: 5}]}], initiative:10},
    {characters:[{name:"Hound Archon", currentHp: 100,  hpDifference:"", newStatus:"", statuses:[{name: "Dazzled", duration: 9}, {name: "Diseased", duration: 5}]}], initiative:13},
    {characters:[{name:"Succubus", currentHp: 100,  hpDifference:"", newStatus:"", statuses:[{name: "Dazzled", duration: 9}, {name: "Diseased", duration: 5}]}], initiative:13}
  ];*/
  //Character Data for Initiative Tracker
  this.characterData=[];

  //Adds new characters to initiative tracker
  this.addCharactersToInitiative = function (newCharacterName, newCharacterInitiative, newCharacterHp, newCharacterCount) {

    if (newCharacterCount == undefined){
      newCharacterCount = 1;
    }
    if (newCharacterInitiative == "" || newCharacterInitiative == undefined){
      newCharacterInitiative = 1;
    }
    if (newCharacterName.trim() != "") {
      this.characterData.push(this.createNewCharacterGroup(newCharacterName, newCharacterInitiative, newCharacterHp, newCharacterCount));
    }
  };

  //Create New Character Group to add to initiative
  this.createNewCharacterGroup = function(newCharacterName, newCharacterInitiative, newCharacterHp, newCharacterCount){

    //Creates new character Group with empty array of characters and sets initiative
    var characterGroup = {
      characters: [],
      initiative: newCharacterInitiative,
    }
    //Populates characters in characterGroup
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
  this.removeCharacterFromInitiative = function(group, character){
    var characterIndex = group.characters.indexOf(character);
    group.characters.splice(characterIndex, 1);
    if (group.characters.length == 0){
      var groupIndex = this.characterData.indexOf(group);
      this.characterData.splice(groupIndex, 1);
    }
  }

  //Sorts character groups  by initiative
  this.sortCharacterDataByInitiative = function(){
    this.characterData = $filter('orderBy')(this.characterData, "-initiative");
  }



  //Adds new status to character
  this.addStatusToCharacter = function (character) {
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
  };

  //Removes characters from initiative
  this.removeStatusFromCharacter = function(character, status){
    var statusIndex = character.statuses.indexOf(status);
    character.statuses.splice(statusIndex, 1);
  }

  //Updates hp of character
  this.updateHp = function(hpDifference, character){
      character.currentHp = character.currentHp + hpDifference;
      character.hpDifference="";
  }

  //Moves to next character group in initiative order
  this.nextInitiative = function(){

    //Move first character to bottom of initiative
    this.characterData.push(this.characterData.shift());

    //Decrement all statuses for current character in initiative order
    angular.forEach(this.characterData[0].characters, function(character){
      angular.forEach(character.statuses, function(status)
      {
        status.duration = status.duration - 1;
        if (status.duration <= -1) {
          character.statuses.splice(character.statuses.indexOf(status), 1);
        }
      });
    });

    var currentCharacterName = this.characterData[0].characters[0].name;
    //Updates monster display if current character is monster
    MonsterManager.updateCurrentMonster(currentCharacterName);
    MonsterMigrator.createMonsterFromDatabase();
  };

}]);