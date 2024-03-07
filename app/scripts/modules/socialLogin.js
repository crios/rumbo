'use strict';
/**
 * @ngdoc overview
 * @name rombusYeoApp
 * @description
 * # rombusYeoApp
 *
 * Module to interact with social networks and consume the login service provided
 */
angular.module('socialLogin', [])

  .provider("social", function(){
    var fbKey, fbApiV, googleKey, linkedInKey;
    return {
      setFacebookKey: function(appId, apiVersion){
        fbKey = appId;
        fbApiV = apiVersion;
        var d = document, fbJs, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
        fbJs = d.createElement('script');
        fbJs.id = id;
        fbJs.async = true;
        fbJs.src = "//connect.facebook.net/en_US/sdk.js";

        fbJs.onload = function() {
          FB.init({
            appId: fbKey,
            status: true,
            cookie: true,
            xfbml: true,
            version: fbApiV
          });
        };

        ref.parentNode.insertBefore(fbJs, ref);
      },
      setGoogleKey: function(value){
        googleKey = value;
        var d = document, gJs, ref = d.getElementsByTagName('script')[0];
        gJs = d.createElement('script');
        gJs.async = true;
        gJs.src = "//apis.google.com/js/platform.js";

        gJs.onload = function() {
          var params ={
            client_id: value,
            scope: 'email'
          };
          gapi.load('auth2', function() {
            gapi.auth2.init(params);
          });
        };

        ref.parentNode.insertBefore(gJs, ref);
      },
      $get: function(){
        return{
          fbKey: fbKey,
          googleKey: googleKey,
          linkedInKey: linkedInKey,
          fbApiV: fbApiV
        };
      }
    };
  })

  .factory("socialLoginService", function($window, $rootScope){
    return {
      logout: function(){
        var provider = $window.localStorage.getItem('_login_provider');
        switch(provider) {
          case "google":
            //its a hack need to find better solution.
            var gElement = document.getElementById("gSignout");
            if (typeof(gElement) !== 'undefined' && gElement !== null)
            {
              gElement.remove();
            }
            var d = document, gSignout, ref = d.getElementsByTagName('script')[0];
            gSignout = d.createElement('script');
            gSignout.src = "https://accounts.google.com/Logout";
            gSignout.type = "text/html";
            gSignout.id = "gSignout";
            $window.localStorage.removeItem('_login_provider');
            $rootScope.$broadcast('event:social-sign-out-success', "success");
            ref.parentNode.insertBefore(gSignout, ref);
            break;
          case "facebook":
            FB.logout(function(){
              $window.localStorage.removeItem('_login_provider');
              $rootScope.$broadcast('event:social-sign-out-success', "success");
            });
            break;
        }
      },
      setProvider: function(provider){
        $window.localStorage.setItem('_login_provider', provider);
      }
    };
  })

  .directive("gLogin", function($rootScope, social, socialLoginService){
    return {
      restrict: 'EA',
      scope: {},
      replace: true,
      link: function(scope, ele){
        ele.on('click', function(){
          var fetchUserDetails = function(){
            var currentUser = scope.gauth.currentUser.get();
            var profile = currentUser.getBasicProfile();
            var idToken = currentUser.getAuthResponse().id_token;
            return {
              token: idToken,
              name: profile.getName(),
              email: profile.getEmail(),
              uid: profile.getId(),
              provider: "google"
            };
          };
          if(typeof(scope.gauth) === "undefined") {
            scope.gauth = gapi.auth2.getAuthInstance();
          }
          if(!scope.gauth.isSignedIn.get()){
            scope.gauth.signIn().then(function(){
              socialLoginService.setProvider("google");
              $rootScope.$broadcast('event:social-sign-in-success', fetchUserDetails());
            }, function(err){
              console.log(err);
            });
          }else{
            socialLoginService.setProvider("google");
            $rootScope.$broadcast('event:social-sign-in-success', fetchUserDetails());
          }

        });
      }
    };
  })

  .directive("fbLogin", function($rootScope, social, socialLoginService, $q){
    return {
      restrict: 'EA',
      scope: {},
      replace: true,
      link: function(scope, ele){
        ele.on('click', function(){
          var fetchUserDetails = function(){
            var deferred = $q.defer();
            FB.api('/me?fields=name,email,picture', function(res){
              if(!res || res.error){
                deferred.reject('Error occured while fetching user details.');
              }else{
                deferred.resolve({
                  name: res.name,
                  email: res.email,
                  uid: res.id,
                  provider: "facebook"
                });
              }
            });
            return deferred.promise;
          };
          FB.getLoginStatus(function(response) {
            if(response.status === "connected"){
              fetchUserDetails().then(function(userDetails){
                userDetails.token = response.authResponse.accessToken;
                socialLoginService.setProvider("facebook");
                $rootScope.$broadcast('event:social-sign-in-success', userDetails);
              });
            }else{
              FB.login(function(response) {
                if(response.status === "connected"){
                  fetchUserDetails().then(function(userDetails){
                    userDetails.token = response.authResponse.accessToken;
                    socialLoginService.setProvider("facebook");
                    $rootScope.$broadcast('event:social-sign-in-success', userDetails);
                  });
                }
              }, {scope: 'email', auth_type: 'rerequest'});
            }
          });
        });
      }
    };
  })

  .config(function(socialProvider){
    socialProvider.setGoogleKey('1089682171333-putb2fc1v2g8u7k0gs4qi74mvq48g2cm.apps.googleusercontent.com');
    socialProvider.setFacebookKey('312295089168915', 'v2.8');
  });
