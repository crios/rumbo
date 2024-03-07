'use strict';

angular
  .module('rombusYeoApp', [
    'ngAnimate',
    'ngRoute',
    'ui.bootstrap',
    'duScroll',
    'ngMap',
    'ngCookies',
    'angucomplete-alt',
    'ngImgCrop',
    'countryPicker',
    'socialLogin',
    'codertyLoading',
    'pascalprecht.translate',
    'tmh.dynamicLocale',
    'ngYoutubeEmbed',
    'slick',
    'LocalStorageModule'
  ])
  .value('duScrollDuration', 2500)
  .config(function ($routeProvider, $locationProvider, $translateProvider, tmhDynamicLocaleProvider, localStorageServiceProvider) {

    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/benefits', {
        templateUrl: 'views/benefits.html'
      })
      .when('/services', {
        templateUrl: 'views/services.html',
        controller: 'ServicesCtrl',
        controllerAs: 'serv'
      })
      .when('/representatives',{
        templateUrl: 'views/representatives.html',
        controller: 'RepreCtrl',
        controllerAs: 'repre'
      })
      .when('/cowork', {
        templateUrl: 'views/cowork.html',
        controller: 'CoworkCtrl',
        controllerAs: 'cowork'
      })
      .when('/cowork/:id' ,{
        templateUrl: 'views/coworkDetails.html',
        controller: 'CwDetailsCtrl',
        controllerAs: 'cwDeta'
      })
      .when('/termsAndConditions', {
        templateUrl: 'views/termsAndConditions.html'
      })
      .when('/modo-rombus', {
        templateUrl: 'views/modo-rombus.html'
      })
      .when('/privacyPolicy', {
        templateUrl: 'views/privacyPolicy.html'
      })
      .when('/login',{
        templateUrl: 'views/login/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'login'
      })
      .when('/login/forgotPass',{
        templateUrl: 'views/login/forgotPass.html',
        controller: 'LoginCtrl',
        controllerAs: 'login'
      })
      .when('/login/restorePass', {
        templateUrl: 'views/login/restorePass.html',
        controller: 'LoginCtrl',
        controllerAs: 'login'
      })
      .when('/register/promotion', {
        templateUrl: 'views/register/promotion.html',
        controller: 'RegisterCtrl',
        controllerAs: 'register'
      })
      .when('/register', {
        templateUrl: 'views/register/step1.html',
        controller: 'RegisterCtrl',
        controllerAs: 'register'
      })
      .when('/register/emailSent', {
        templateUrl: 'views/register/emailSent.html',
        controller: 'RegisterCtrl',
        controllerAs: 'register'
      })
      .when('/register/confirmation', {
        templateUrl: 'views/register/confirmation.html',
        controller: 'RegisterCtrl',
        controllerAs: 'register'
      })
      .when('/register/welcome', {
        templateUrl: 'views/register/welcome.html',
        controller: 'RegisterCtrl',
        controllerAs: 'register'
      })
      .when('/register/welcome-professional', {
        templateUrl: 'views/register/welcome-professional.html',
        controller: 'RegisterCtrl',
        controllerAs: 'register'
      })
	    .when('/dashboard',{
        templateUrl: 'views/profile/dashboard.html',
        controller: 'DashboardCtrl',
        controllerAs: 'das'
      })
      .when('/profile', {
        templateUrl: 'views/profile/profile.html',
        controller: 'ProfileCtrl',
        controllerAs: 'prof'
      })
      .when('/project-wizard/summary', {
        templateUrl: 'views/project/summary.html',
        controller: 'WizardProjectCtrl',
        controllerAs: 'wwp'
      })
      .when('/project-wizard/step1', {
        templateUrl: 'views/project/step1.html',
        controller: 'WizardProjectCtrl',
        controllerAs: 'wwp'
      })
      .when('/project-wizard/step2', {
        templateUrl: 'views/project/step2.html',
        controller: 'WizardProjectCtrl',
        controllerAs: 'wwp'
      })
      .when('/project-wizard/step3', {
        templateUrl: 'views/project/step3.html',
        controller: 'WizardProjectCtrl',
        controllerAs: 'wwp'
      })
      .when('/project-wizard/step4', {
        templateUrl: 'views/project/step4.html',
        controller: 'WizardProjectCtrl',
        controllerAs: 'wwp'
      })
      /*.when('/projects/:companyId/:projectId', {
        templateUrl: 'views/project/project-details.html',
        controller: 'ProjectCtrl',
        controllerAs: 'proj'
      })*/
      .when('/projects/:companyId/:projectId/summary', {
        templateUrl: 'views/project/project-summary.html',
        controller: 'ProjectCtrl',
        controllerAs: 'proj'
      })
      .when('/profile/users/:id', {
        templateUrl: 'views/profile/user.html',
        controller: 'ProfileCtrl',
        controllerAs: 'prof'
      })
      .when('/company-dashboard',{
        templateUrl: 'views/profile-company/dashboard.html',
        controller: 'DashboardCtrl',
        controllerAs: 'das'
      })
      .when('/profile-company', {
        templateUrl: 'views/profile-company/profile.html',
        controller: 'CompanyProfileCtrl',
        controllerAs: 'comProf'
      })
      .when('/profile-company/company/:id', {
        templateUrl: 'views/profile-company/user.html',
        controller: 'CompanyProfileCtrl',
        controllerAs: 'comProf'
      })
      .when('/profile-company/config', {
        templateUrl: 'views/profile-company/configuration.html',
        controller: 'ProfileConfigCtrl',
        controllerAs: 'profConf'
      })
      .when('/profile/config', {
        templateUrl: 'views/profile/configuration.html',
        controller: 'ProfileConfigCtrl',
        controllerAs: 'profConf'
      })
      .when('/staff', {
        templateUrl: 'views/staff.html',
        controller: 'StaffCtrl',
        controllerAs: 'staff'
      })
      .when('/memberships', {
        templateUrl: 'views/platform/memberships.html'
      })
      .when('/portfoliouno', {
        templateUrl: 'views/samples/sample1.html'
      })
      .when('/portfoliodos', {
        templateUrl: 'views/samples/sample2.html'
      })
      .when('/portfoliotres', {
        templateUrl: 'views/samples/sample3.html'
      })
      .when('/portfoliocuatro', {
        templateUrl: 'views/samples/sample4.html'
      })
      .when('/portfoliocinco', {
        templateUrl: 'views/samples/sample5.html'
      })
      .when('/portfolioseis', {
        templateUrl: 'views/samples/sample6.html'
      })
      .when('/portfoliosiete', {
        templateUrl: 'views/samples/sample7.html'
      })
      .when('/red', {
        templateUrl: 'views/red.html'
      })
      .when('/security', {
        templateUrl: 'views/security.html'
      })
      .otherwise({
        templateUrl: '404.html'
      });

    // configure html5 to get links working
    $locationProvider.html5Mode(true);

    tmhDynamicLocaleProvider.localeLocationPattern('/i18n/angular-locale_{{locale}}.js');

    tmhDynamicLocaleProvider.defaultLocale('es');

    $translateProvider.useStaticFilesLoader({
      prefix: '/translations/locale-',
      suffix: '.json'
    }).preferredLanguage('esp').useSanitizeValueStrategy(null);

    localStorageServiceProvider.setPrefix('rombus');

  })
  .run(function ($rootScope, $location, $translate, $routeParams, UserService, ParameterService, LoginService, ModalService, ProfileService, CountryPickerService, localStorageService) {

    console.log('localStorage=', localStorageService.keys());

    console.log('localStorage - userLogged=',localStorageService.get('userLogged'));
    console.log('localStorage - loginType', localStorageService.get('loginType'));
    console.log('localStorage - userId', localStorageService.get('userId'));
    console.log ('localStorage - username', localStorageService.get('username'));
    console.log('localStorage - defaultProfile', localStorageService.get('defaultProfile'));

    var isUserLogged = localStorageService.get('userLogged');
    if(isUserLogged === true){
      UserService.loginUser(localStorageService.get('loginType'),
        localStorageService.get('userId'),
        localStorageService.get('username'),
        localStorageService.get('defaultProfile'));
    }
    else{
      $rootScope.globalIsUserLogged = false;
    }


    $rootScope.changeLanguage = function (language) {
      $translate.use(language);
      CountryPickerService.loadCountriesPerLang(language);
    };

    $rootScope.changeLanguage('esp');

    $rootScope.$on('$locationChangeStart', function () { //event, next, current
      // redirect to login page if not logged in and trying to access a restricted page
      var restrictedPage = $.inArray($location.path(), ['/profile', '/profile/config', '/dashboard',
        '/profile-company', '/dashboard-company']) !== -1 || $location.path().indexOf('/project') === 0;
      if (restrictedPage && !UserService.isLogged) {
        var redirectAfterLogin = $location.url().substr(1,$location.url().length);
        $location.path('/login').search({redirectAfterLogin:redirectAfterLogin});
      }
    });

    $rootScope.changeViewWithSpecElement = function (path, element) {
      $location.path(path).hash(element).search({});
    };

    $rootScope.changeViewWithParams = function(path, params){
      $location.path(path).search(params);
    };

    $rootScope.contactUsDialog = function (contactOption) {
      ModalService.showContact(contactOption);
    };

    ParameterService.initSpecAreasAndSkills();

    $rootScope.$on('event:social-sign-in-success', function(event, userDetails){
      switch (userDetails.provider){
        case 'google':
          LoginService.googleLogin(userDetails).then(
            function () { $rootScope.changeViewWithSpecElement('/register/welcome',''); },
            function(){ ModalService.showErrorTryAgain(); }
          );
          break;
        case 'facebook':
          LoginService.facebookLogin(userDetails).then(
            function () { $rootScope.changeViewWithSpecElement('/register/welcome',''); },
            function(){ ModalService.showErrorTryAgain(); }
          );
          break;
        default:
          console.log('Default switch provider');
      }
    });

    $rootScope.$on('user-logout', function () {
      $rootScope.globalIsUserLogged = false;
      ProfileService.blankValues();
    });

    $rootScope.isNotNullNorUndefinedNorEmpty = function (value) {
      if(angular.isNumber(value)){
        return value !== null && value !== undefined;
      }
      else{
        return value !== null && value !== undefined && value.length > 0;
      }
    };

  })
  .filter('dateToISO', function () {
    return function (input) {
      var result = '';
       if(Object.prototype.toString.call(input) === '[object Date]' && !isNaN(input.getTime())){
         var t = input.split(/[- :]/);
         result  = new Date(Date.UTC(t[0], t[1]-1, t[2], t[3], t[4], t[5]));
       }
      return result;
    };
  });

var config = {
  debug:          false,
  //baseUrl:        'http://ambienteuat.rombusglobal.com',
  baseUrl:        'https://rombusglobal.com',
  version:        '1.0.2',
  appName:        'rombusApp',
  slogan:         'rombusApp AngularJs',
  //endpoint:       'http://ambienteuat.rombusglobal.com:8080/rombus-war/rombus', // UAT
 // endpoint:       'http://localhost:8080/rombus-war/rombus', //DEV
  endpoint: 'https://loadbalancer.rombusglobal.com:443/rombus-war/rombus',
  timeout:        7500,
  toastPosition: 'toast-bottom-right',
  language: {
    default:    'eng',
    available: {
      eng:    'English'
    }
  }
};

angular.module('rombusYeoApp').constant('config', config);
