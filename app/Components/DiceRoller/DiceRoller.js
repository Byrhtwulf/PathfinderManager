'use strict';

var roller = angular.module('PathfinderManager.DiceRoller', []);

roller.controller('DiceRoller', ['$scope', function($scope) {
    //List of preset dice
    $scope.diceList = [
        {diceValue:20, diceCount:"",  diceBonus:"", rolls:[]},
        {diceValue:12, diceCount:"", diceBonus:"", rolls:[]},
        {diceValue:10, diceCount:"", diceBonus:"", rolls:[]},
        {diceValue:8, diceCount:"", diceBonus:"", rolls:[]},
        {diceValue:6, diceCount:"", diceBonus:"", rolls:[]},
        {diceValue:4, diceCount:"", diceBonus:"", rolls:[]},
        {diceValue:100, diceCount:"", diceBonus:"", rolls:[]}
    ]

    //Array for custom dice formula
    $scope.customRolls = {customRollFormula:"", rolls: []};

    //Empty array to copy, used to clear dice rolls
    $scope.emptyArray = [];

    //Function to roll preset dice
    $scope.rollDice = function(dice){
        if (dice.diceCount == undefined ||  dice.diceCount == ""){
            dice.diceCount = 1;
        }
        if (dice.diceBonus == undefined || dice.diceBonus == ""){
            dice.diceBonus = 0;
        }
        dice.rolls.push($scope.populateDice(dice.diceValue, dice.diceCount, dice.diceBonus));

        if (dice.diceCount == 1){
            dice.diceCount = "";
        }
        if (dice.diceBonus == 0){
            dice.diceBonus = "";
        }
    }

    //Parses custom dice formula and rolls dice
    $scope.rollCustomDice = function($event, customRollFormula){
        if ($event.keyCode == 13){
            var diceCount = customRollFormula.substring(0, customRollFormula.lastIndexOf("d"));
            var diceValue = customRollFormula.substring(customRollFormula.lastIndexOf("d")+1, customRollFormula.length);
            var diceBonus = 0;
            if (customRollFormula.indexOf("+") != -1){
                diceValue = customRollFormula.substring(customRollFormula.lastIndexOf("d")+1, customRollFormula.lastIndexOf("+"));
                diceBonus = customRollFormula.substring(customRollFormula.lastIndexOf("+")+1, customRollFormula.length);
            }

            $scope.customRolls.rolls.push($scope.populateDice(diceValue, diceCount, diceBonus));
        }
    }

    //Clears current dice
    $scope.clearDiceRolls = function(dice){
        dice.currentTotal = 0;
        dice.diceCount = "";
        dice.diceBonus = "";
        dice.currentRoll = 0;
        dice.rolls = (angular.copy($scope.emptyArray));
    }

    //Clear all dice
    $scope.clearAllDice = function(){
        angular.forEach($scope.diceList, function(dice){
            $scope.clearDiceRolls(dice);
        })
        $scope.clearCustomRoll();
    }

    //Clear custom dice formula
    $scope.clearCustomRoll = function(){
        $scope.customRolls.customRollFormula = "";
        $scope.customRolls.rolls = angular.copy($scope.emptyArray);
    }

    //Creates new dice with dice breakdown and adds it to dice.rolls
    $scope.populateDice = function(diceValue, diceCount, diceBonus){
        var total = 0;
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
        return newRoll;
    }

    //Create new dice object
    $scope.createNewDice= function(diceValue, diceCount, diceBonus){
        return {diceValue:diceValue, diceCount:diceCount, diceBonus:diceBonus, currentRoll: 0, currentTotal: 0, rolls:[]};
    }

}]);