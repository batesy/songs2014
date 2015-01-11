'use strict';

angular
  .module('app.songs', ['ngRoute'])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
      templateUrl: 'songs/songs.html',
      controller: 'SongsController',
      controllerAs: 'vm'
    })
  }])
  .controller('SongsController', SongsController);

  SongsController.$inject = ['$scope', '$http', 'PlayerService', 'DetailsService'];

  function SongsController($scope, $http, PlayerService, DetailsService) {
    console.log("Songs Controller!");
    var vm = this;
    initializeYouTubePlayer();
    vm.songs = [];
    vm.showingDetails = false;
    vm.details = null;

    vm.playSong = function(song) {
      console.log("Playing song: " + song.title);
      PlayerService.playSong(song);
    }

    vm.showDetails = function(song) {
      vm.details = song;
      vm.showingDetails = true;
    }

    vm.hideDetails = function() {
      vm.showingDetails = false;
      console.log("Hide");
    }

    vm.isReleased = function(song) {
      var today = moment()
      var releaseDate = moment(song.releaseDate);

      if (releaseDate.isBefore(today)) {
        return "Released";
      } else {
        return "Unreleased";
      }
    }

    $scope.$watch(function() {
      return DetailsService.showingDetails;
    }, function(newVal, oldVal) {
      vm.showingDetails = newVal;
    });

    $http.get('json/2014.json')
      .success(function(data) {
        console.log(data);
        vm.songs = data;
        PlayerService.loadPlaylist(vm.songs);
      });

    function initializeYouTubePlayer() {
      console.log("Initializing YouTube Player");

    }
  }