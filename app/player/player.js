'use strict';

angular
  .module('app.player', [])
  .controller('PlayerController', PlayerController);

  PlayerController.$inject = ['$scope', 'PlayerService'];

  function PlayerController($scope, PlayerService) {
    var vm = this;

    vm.currentSong = null;
    vm.showYoutubePlayer = false;

    $scope.$watch(function() {
      return PlayerService.currentSong;
    }, function(newVal, oldVal) {
      vm.currentSong = newVal;
    });

    $scope.$watch(function() {
      return PlayerService.showYoutubePlayer;
    }, function(newVal, oldVal) {
      vm.showYoutubePlayer = newVal;
    });

    vm.playNext = function() {
      PlayerService.playNext();
    }

    vm.playPrevious = function() {
      PlayerService.playPrevious();
    }
  }