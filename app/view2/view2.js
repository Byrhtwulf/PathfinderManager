'use strict';

var myApp = angular.module("myApp", []);
myApp.factory("items", function () {
  var items = {};
  items.data = [{
    id: "1",
    title: "Item 1"
  }, {
    id: "2",
    title: "Item 2"
  }, {
    id: "3",
    title: "Item 3"
  }, {
    id: "4",
    title: "Item 4"
  }];
  return items;
});

function ItemsController($scope, items) {
  $scope.items = items;

  $scope.deleteItem = function (index) {
    items.data.splice(index, 1);
  }
  $scope.addItem = function (index) {
    items.data.push({
      id: $scope.items.data.length + 1,
      title: $scope.newItemName
    });
  }
}