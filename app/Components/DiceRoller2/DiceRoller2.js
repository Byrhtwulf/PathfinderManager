'use strict';

var roller = angular.module('PathfinderManager.DiceRoller', []);

roller.controller('DiceRoller2', ['$scope', function($scope) {
    //List of preset dice
    $scope.diceList = [
        {diceValue:20, diceCount:"",  diceBonus:"", rolls:[]},
        {diceValue:100, diceCount:"", diceBonus:"", rolls:[]}
    ]

    //Array for custom dice formula
    $scope.customRollsButtons = [
        {   label:"3d20",
            diceTotal:"",
            diceHistory:[],

        }
    ];

    //Empty array to copy, used to clear dice rolls
    $scope.emptyArray = [];

    $scope.addDice = function(customRollFormula) {
        var diceArray = customRollFormula.split(",");

        for(var i = 0; i < diceArray.length; i++)
        {
            $scope.customRollsButtons.push({label: diceArray[i].toString(), diceTotal: "", diceHistory:[]});
        }
        $scope.customRolls.customRollFormula = "";

    }

    $scope.rollCustomDice = function(index, diceLabel){
        var diceCount = diceLabel.substring(0, diceLabel.lastIndexOf("d"));
        var diceValue = diceLabel.substring(diceLabel.lastIndexOf("d")+1, diceLabel.length);
        var diceBonus = 0;
        if(diceLabel.indexOf("+") != -1){
            diceValue = diceLabel.substring(diceLabel.lastIndexOf("d")+1, diceLabel.lastIndexOf("+"));
            diceBonus = diceLabel.substring(diceLabel.lastIndexOf("+")+1, diceLabel.length);
        }
        $scope.customRollsButtons[index].diceTotal = $scope.populateDice(diceValue,diceCount,diceBonus).currentTotal;
        $scope.customRollsButtons[index].diceHistory.push($scope.customRollsButtons[index].diceTotal);
    }


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

    $scope.clearDice = function(index){
        $scope.customRollsButtons.splice(index);
    }

    $scope.clearAllDice = function(){
        $scope.customRolls.customRollFormula = "";
        $scope.customRollsButtons = angular.copy($scope.emptyArray);
    }

    //Parses custom dice formula and rolls dice
   /* $scope.rollCustomDice = function($event, customRollFormula){
        //if ($event.keyCode == 13){
            var diceCount = customRollFormula.substring(0, customRollFormula.lastIndexOf("d"));
            var diceValue = customRollFormula.substring(customRollFormula.lastIndexOf("d")+1, customRollFormula.length);
            var diceBonus = 0;
            if (customRollFormula.indexOf("+") != -1){
                diceValue = customRollFormula.substring(customRollFormula.lastIndexOf("d")+1, customRollFormula.lastIndexOf("+"));
                diceBonus = customRollFormula.substring(customRollFormula.lastIndexOf("+")+1, customRollFormula.length);
            }

            $scope.customRolls.rolls.push($scope.populateDice(diceValue, diceCount, diceBonus));
        //}
    }*/

    //Clears current dice
   /*$scope.clearDiceRolls = function(dice){
        dice.currentTotal = 0;
        dice.diceCount = "";
        dice.diceBonus = "";
        dice.currentRoll = 0;
        dice.rolls = (angular.copy($scope.emptyArray));
    }

    //Clear all dice


    //Clear custom dice formula
    $scope.clearCustomRoll = function(){
        $scope.customRolls.customRollFormula = "";
        $scope.customRolls.rolls = angular.copy($scope.emptyArray);
    }*/




}]);