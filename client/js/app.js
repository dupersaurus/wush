/* global angular */
var wushApp = angular.module("wushApp", ["ngRoute", 'ui.bootstrap', "ngCookies"]);

// configure our routes
wushApp.config(function($routeProvider, $locationProvider) {
    $routeProvider

    // route for the home page
    .when('/', {
        templateUrl : 'pages/profile.html',
        controller  : 'profileController as profile'
    })

    // route for the about page
    .when('/login', {
        templateUrl : 'pages/login.html',
        controller  : 'loginController as login'
    })

    // route for the contact page
    .when('/room/:id', {
        templateUrl : 'pages/room.html',
        controller  : 'roomController as room'
    })

    // route for the contact page
    .when('/places', {
        templateUrl : 'pages/places.html',
        controller  : 'placeListController as places'
    })

    // route for the contact page
    .when('/places/:id', {
        templateUrl : 'pages/place.html',
        controller  : 'placeController as place'
    })

    // route for the contact page
    .when('/character/:id', {
        templateUrl : 'pages/character.html',
        controller  : 'characterController as character'
    })

    // route for the contact page
    .when('/newaccount', {
        templateUrl : 'pages/newaccount.html',
        controller  : 'accountController as account'
    })
    
    .otherwise({
        redirectTo: '/'
    });
    
    //$locationProvider.html5Mode(true);
});

// Main app controller
wushApp.controller("wushController", function($scope, $cookies, $controller, $route) {
    this.userInfo = null;
    this.socket = null;
    
    this.getContrastColor = function(hex) {
        return hexToLuminosity(hex) >= 0.5 ? "#000" : "#fff";
    }
    
    // Sets the information of the current user
    this.setUserInfo = function(user) {
        this.userInfo = user;
        $cookies.putObject("wushUserInfo", this.userInfo);
        
        if (this.socket == null) {
            this.setupSocket();
        }
    }
    
    this.getUserInfo = function() {
        if (this.userInfo == null) {
            this.userInfo = $cookies.getObject("wushUserInfo");
        }
        
        return this.userInfo;
    }
    
    this.getSocket = function() {
        return this.socket;
    }
    
    this.setupSocket = function() {
        // Set up the socket connection
        /* global io */
        this.socket = io.connect("", {query: "user=" + this.userInfo.id});
        
        // Connection successful
        this.socket.on('connect', function () {
            console.log("socket connection");
        });
        
        // Notification of a new pose in a room not being viewed
        this.socket.on('distancepose', function (info) {
            console.log("distancepose: " + info);
        });
        
        // Notification of new pose in the same room
        this.socket.on('newpose', function (pose) {
            //console.log(pose);
            $route.current.scope.room.receiveNewPose(pose);
        });   
    }
});

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function hexToLuminosity(hex) {
    var rgb = hexToRgb(hex);
    
    if (rgb == null) {
        return 0;
    } else {
        return (rgb.r * 0.2 + rgb.g * 0.6 + rgb.b * 0.1) / 255;
    }
}