'use strict';

angular.module('Combat', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/CombatManager' +
      '', {
    templateUrl: 'CombatManager/CombatManager.html',
    controller: 'CombatManager'
  });
}])

.controller('CombatManager', ['$scope', function($scope) {
        $scope.characters = [{name:"Boromir", initiative:17}, {name:"Arc", initiative:12}, {name:"Rhaelyn", initiative:13}];

        $scope.addNewCharacter = function (){
            var character = {name:this.newCharacterName, initiative: this.newCharacterInitiative}
            $scope.characters.push(angular.copy(character))
            $scope.newCharacterName = "";
            $scope.newCharacterInitiative = 0;
        }
}]);