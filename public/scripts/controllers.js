'use strict';

angular.module('portfolioCenterApp')

.controller('PortfoliosController', ['$scope', 'portfoliosFactory', function ($scope, portfoliosFactory) {

    $scope.portfolios = [];
    $scope.showDetails = false;
    $scope.message = "Loading ...";
    $scope.portfolio = {
        name: '',
        description: ''
    };
    
    $scope.loadData = function() {
        portfoliosFactory.query(
        function (response) {
            $scope.portfolios = response;
            $scope.showMenu = true;

        },
        function (response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
        });
    }

    $scope.toggleDetails = function () {
        $scope.showDetails = !$scope.showDetails;
    };
    
    $scope.addPortfolio = function() {
        console.log('Add portfolio' + $scope.portfolio.name);
        portfoliosFactory.save(null, $scope.portfolio);
        $scope.loadData();
        //$state.go($state.current, {}, {reload: true});
    };
    
    $scope.loadData();
}])

.controller('ContactController', ['$scope', 'feedbackFactory', function ($scope, feedbackFactory) {

    $scope.feedback = {
        mychannel: "",
        firstName: "",
        lastName: "",
        agree: false,
        email: ""
    };

    var channels = [{
        value: "tel",
        label: "Tel."
    }, {
        value: "Email",
        label: "Email"
    }];

    $scope.channels = channels;
    $scope.invalidChannelSelection = false;

    $scope.sendFeedback = function () {


        if ($scope.feedback.agree && ($scope.feedback.mychannel == "")) {
            $scope.invalidChannelSelection = true;
        } else {
            $scope.invalidChannelSelection = false;
            feedbackFactory.save($scope.feedback);
            $scope.feedback = {
                mychannel: "",
                firstName: "",
                lastName: "",
                agree: false,
                email: ""
            };
            $scope.feedback.mychannel = "";
            $scope.feedbackForm.$setPristine();
        }
    };
}])

.controller('PortfolioController', ['$scope', '$state', '$stateParams', 'portfolioFactory', 'securitiesFactory', 'portfolioItemFactory', function ($scope, $state, $stateParams, portfolioFactory, securitiesFactory, portfolioItemFactory) {

    $scope.portfolio = {};
    $scope.securities = [];
    $scope.securitySelect = {};
    $scope.message = "Loading ...";
    
    $scope.loadPortfolio = function() {
        $scope.portfolio = portfolioFactory.get({
            id: $stateParams.id
        })
        .$promise.then(
            function (response) {
                $scope.portfolio = response;
                console.log("successfully retrieved portfolio: " + response.name);
            },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            }
        );
    }

    securitiesFactory.query(
        function (response) {
            $scope.securities = response;
            $scope.showMenu = true;

        },
        function (response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
        });
    
    $scope.newitem = {};
    
    $scope.addItem = function () {
        console.log($scope.securitySelect.name);
        /*if($scope.portfolio.items.indexOf($scope.securitySelect._id) == -1) $scope.portfolio.items.push($scope.securitySelect._id);*/
        portfolioItemFactory.save({ id: $scope.portfolio._id, securityId: $scope.securitySelect._id });
        $scope.loadPortfolio();
        $state.go($state.current, {}, {reload: true});
    }
    
    $scope.deleteItem = function () {
        portfolioItemFactory.delete({ id: $scope.portfolio._id, securityId: $scope.securitySelect._id });
        $state.go($state.current, {}, {reload: true});
    }

    $scope.saveChanges = function () {

        // portfolioFactory.delete();
        portfolioFactory.save({id: $stateParams.id}, $scope.portfolio);

        $state.go($state.current, {}, {reload: true});
        
        $scope.commentForm.$setPristine();

    }
    
    $scope.loadPortfolio();
}])

.controller('HomeController', ['$scope', 'portfoliosFactory', function ($scope, portfoliosFactory) {
    $scope.showDish = false;
    $scope.showLeader = false;
    $scope.showPromotion = false;
    $scope.message = "Loading ...";
   
}])

.controller('HeaderController', ['$scope', '$state', '$rootScope', 'ngDialog', 'AuthFactory', function ($scope, $state, $rootScope, ngDialog, AuthFactory) {

    $scope.loggedIn = false;
    $scope.username = '';
    
    if(AuthFactory.isAuthenticated()) {
        $scope.loggedIn = true;
        $scope.username = AuthFactory.getUsername();
    }
        
    $scope.openLogin = function () {
        ngDialog.open({ template: 'views/login.html', scope: $scope, className: 'ngdialog-theme-default', controller:"LoginController" });
    };
    
    $scope.logOut = function() {
       AuthFactory.logout();
        $scope.loggedIn = false;
        $scope.username = '';
    };
    
    $rootScope.$on('login:Successful', function () {
        $scope.loggedIn = AuthFactory.isAuthenticated();
        $scope.username = AuthFactory.getUsername();
    });
        
    $rootScope.$on('registration:Successful', function () {
        $scope.loggedIn = AuthFactory.isAuthenticated();
        $scope.username = AuthFactory.getUsername();
    });
    
    $scope.stateis = function(curstate) {
       return $state.is(curstate);  
    };
    
}])

.controller('LoginController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', function ($scope, ngDialog, $localStorage, AuthFactory) {
    
    $scope.loginData = $localStorage.getObject('userinfo','{}');
    
    $scope.doLogin = function() {
        if($scope.rememberMe)
           $localStorage.storeObject('userinfo',$scope.loginData);

        AuthFactory.login($scope.loginData);

        ngDialog.close();

    };
            
    $scope.openRegister = function () {
        ngDialog.open({ template: 'views/register.html', scope: $scope, className: 'ngdialog-theme-default', controller:"RegisterController" });
    };
    
}])

.controller('RegisterController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', function ($scope, ngDialog, $localStorage, AuthFactory) {
    
    $scope.register={};
    $scope.loginData={};
    
    $scope.doRegister = function() {
        console.log('Doing registration', $scope.registration);

        AuthFactory.register($scope.registration);
        
        ngDialog.close();

    };
}])
;