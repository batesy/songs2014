'use strict';

angular
  .module('app')
  .service('PlayerService', ['$window', '$rootScope', '$log', 'DetailsService', function ($window, $rootScope, $log, DetailsService) {
    var service = this;

    initializeSoundcloudPlayer();

    service.player = {
      status: null,
      service: null,
      soundObj: null
    };

    var youtube = {
      ready: false,
      player: null,
      playerId: null,
      videoId: null,
      videoTitle: null,
      playerHeight: '100%',
      playerWidth: '100%',
      state: 'stopped'
    };
    service.showYoutubePlayer = false;
    service.playlist = [];
    service.currentSong = null;
    service.getCurrentSong = function() {
      return service.currentSong;
    };
    service.getPlayer = function() {
      return service.player;
    };
    service.greg = "GREG!";
    service.bindPlayer = function(elementId) {
      $log.info('Binding to ' + elementId);
      youtube.playerId = elementId;
    }

    service.createPlayer = function(song) {
      return new YT.Player(youtube.playerId, {
        height: youtube.playerHeight,
        width: youtube.playerWidth,
        videoId: song.youtube,
        playerVars: {
          "rel": 0,
          "showinfo": 0,
          "controls": 1,
          "autoplay": 1
        },
        events: {
          'onReady': onYoutubeReady,
          'onStateChange': onYoutubeStateChange
        }
      });
    };

    service.loadPlayer = function() {
      if (youtube.ready && youtube.playerId) {
        if (youtube.player) {
          youtube.player.destroy();
        }
        youtube.player = service.createPlayer();
      }
    }

    service.loadPlaylist = function(songs) {
      service.playlist = songs;
    }

    service.playSong = function(song) {
      service.currentSong = song;
      if (song.soundcloud) {
        service.showYoutubePlayer = false;
        if (service.player.status == 'playing' && service.player.service == 'youtube') {
          youtube.player.stopVideo();
          SC.stream("/tracks/" + song.soundcloud, function(sound){
            sound.play();
            service.player.service = 'soundcloud';
            service.player.soundObj = sound;
          });
        } else if (service.player.status == 'playing' && service.player.service == 'soundcloud') {
          service.player.soundObj.stop();
          SC.stream("/tracks/" + song.soundcloud, function(sound) {
            sound.play();
            service.player.soundObj = sound;
          });
        } else {
          SC.stream("/tracks/" + song.soundcloud, function(sound) {
            sound.play();
            service.player.soundObj = sound;
            service.player.status = "playing";
            service.player.service = "soundcloud";
          });
        }
      } else if (song.youtube) {
        service.showYoutubePlayer = true;
        if (service.player.status == 'playing' && service.player.service == 'youtube') {
          youtube.player.loadVideoById(song.youtube);
        } else if (service.player.status == 'playing' && service.player.service == 'soundcloud') {
          service.player.soundObj.stop();
          if (!youtube.player) {
            youtube.player = service.createPlayer(song);
          } else {
            youtube.player.loadVideoById(song.youtube);
          }
        } else {
          youtube.player = service.createPlayer(song);
          service.player.status = 'playing';
          service.player.service = 'youtube';
        }
      };
    }

    service.playNext = function() {
      var currentIndex = service.playlist.indexOf(service.currentSong);
      console.log('current index is: ' + currentIndex);
      var nextSong = service.playlist[currentIndex + 1];
      service.playSong(nextSong);
      $rootScope.$apply();
    }

    service.playPrevious = function() {
      var currentIndex = service.playlist.indexOf(service.currentSong);
      var previousSong = service.playlist[currentIndex - 1];
      service.playSong(previousSong);
    }

    $window.onYouTubeIframeAPIReady = function() {
      $log.info('YouTube API is ready!');
      youtube.ready = true;
      service.bindPlayer('youtube-player');
      $rootScope.$apply();
    }

    function initializeSoundcloudPlayer() {
      console.log("Initializing Soundcloud player!");
      SC.initialize({
        client_id: "e4f3352aa8947923e20001a023639470"
      });
    }

    function onYoutubeReady(event) {
      $log.info('Youtube Player is READY!');
    }

    function onYoutubeStateChange(event) {
      if (event.data == YT.PlayerState.PLAYING) {
        youtube.state = 'playing';
      } else if (event.data == YT.PlayerState.PAUSED) {
        youtube.state = 'paused';
      } else if (event.data == YT.PlayerState.ENDED) {
        youtube.state = 'ended';
        console.log('Play next song');
        console.log('Current song is: ' + service.currentSong.id);
        service.playNext();
      }
    }

  }]);