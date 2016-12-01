// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','firebase','starter.configs'])

.run(function($ionicPlatform,CONFIG) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

      
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

    firebase.initializeApp({
      apiKey: "AIzaSyDaYSKqGVfWJVa2kP-l93HAYBf9qv9l1Vs",
    authDomain: "tutrial-f8258.firebaseapp.com",
    databaseURL: "https://tutrial-f8258.firebaseio.com",
    storageBucket: "tutrial-f8258.appspot.com",
    messagingSenderId: "197368857037"

    });


  });
})

.config(['$stateProvider', '$urlRouterProvider','$ionicConfigProvider',function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    
    $ionicConfigProvider.navBar.alignTitle('center');

    $stateProvider

    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html',
      controller: 'appController'
    })

    .state('login', {
      url: '/login',
      templateUrl: "templates/login.html",
      controller: "loginController"
    })

    .state('signup', {
      url: '/signup',
      templateUrl: "templates/signup.html",
      controller: "signupController"
    })

    .state('reset', {
      url: '/reset',
      templateUrl: "templates/resetemail.html",
      controller: "resetController"
    })

    .state('intro', {
      url: '/intro',
      views: {
        'menuContent': {
          templateUrl: "templates/intro.html",
          controller: "introController"
        }
      }
    })

    .state('app.dashboard', {
      url: '/app/dashboard',
      views: {
        'menuContent': {
          templateUrl: "templates/dashboard.html",
          controller: "dashboardController"
        }
      }
    })
      
    $urlRouterProvider.otherwise('/login');

}])

.controller('loginController',['$scope', '$firebaseArray', 'CONFIG', '$document', '$state', function($scope, $firebaseArray, CONFIG, $document, $state) {



  // Perform the login action when the user submits the login form
  $scope.doLogin = function(userLogin) {
    

   
    console.log(userLogin);

    if($document[0].getElementById("user_name").value != "" && $document[0].getElementById("user_pass").value != ""){


        firebase.auth().signInWithEmailAndPassword(userLogin.username, userLogin.password).then(function() {
          // Sign-In successful.
          //console.log("Login successful");


          

                    var user = firebase.auth().currentUser;

                    var name, email, photoUrl, uid;

                    if(user.emailVerified) { //check for verification email confirmed by user from the inbox

                      console.log("email verified");
                      $state.go("app.dashboard");

                      name = user.displayName;
                      email = user.email;
                      photoUrl = user.photoURL;
                      uid = user.uid;  

                      //console.log(name + "<>" + email + "<>" +  photoUrl + "<>" +  uid);

                      localStorage.setItem("photo",photoUrl);

                    }else{

                        alert("Email not verified, please check your inbox or spam messages")
                        return false;

                    } // end check verification email

           
        }, function(error) {
          // An error happened.
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(errorCode);
          if (errorCode === 'auth/invalid-email') {
             alert('Enter a valid email.');
             return false;
          }else if (errorCode === 'auth/wrong-password') {
             alert('Incorrect password.');
             return false;
          }else if (errorCode === 'auth/argument-error') {
             alert('Password must be string.');
             return false;
          }else if (errorCode === 'auth/user-not-found') {
             alert('No such user found.');
             return false;
          }else if (errorCode === 'auth/too-many-requests') {
             alert('Too many failed login attempts, please try after sometime.');
             return false;
          }else if (errorCode === 'auth/network-request-failed') {
             alert('Request timed out, please try again.');
             return false;
          }else {
             alert(errorMessage);
             return false;
          }
        });



    }else{

        alert('Please enter email and password');
        return false;

    }//end check client username password

    
  };// end $scope.doLogin()

}]) 

.controller('appController',['$scope', '$firebaseArray', 'CONFIG', '$document', '$state', function($scope, $firebaseArray, CONFIG, $document, $state) {

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        
      $document[0].getElementById("photo_user").src = localStorage.getItem("photo");
          
        
    } else {
      // No user is signed in.
      $state.go("login");
    }
  });


  $scope.doLogout = function(){
      
      firebase.auth().signOut().then(function() {
        // Sign-out successful.
        //console.log("Logout successful");
        $state.go("login");

      }, function(error) {
        // An error happened.
        console.log(error);
      });

}// end dologout()



}])

.controller('resetController', ['$scope', '$state', '$document', '$firebaseArray', 'CONFIG', function($scope, $state, $document, $firebaseArray, CONFIG) {

$scope.doResetemail = function(userReset) {
    

   
    //console.log(userReset);

    if($document[0].getElementById("ruser_name").value != ""){


        firebase.auth().sendPasswordResetEmail(userReset.rusername).then(function() {
          // Sign-In successful.
          //console.log("Reset email sent successful");
          
          $state.go("login");


        }, function(error) {
          // An error happened.
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(errorCode);

          
          if (errorCode === 'auth/user-not-found') {
             alert('No user found with provided email.');
             return false;
          }else if (errorCode === 'auth/invalid-email') {
             alert('Email you entered is not complete or invalid.');
             return false;
          }
          
        });



    }else{

        alert('Please enter registered email to send reset link');
        return false;

    }//end check client username password

    
  };// end $scope.doSignup()
  
  
  
}])



.controller('signupController', ['$scope', '$state', '$document', '$firebaseArray', 'CONFIG', function($scope, $state, $document, $firebaseArray, CONFIG) {

$scope.doSignup = function(userSignup) {
    

   
    //console.log(userSignup);

    if($document[0].getElementById("cuser_name").value != "" && $document[0].getElementById("cuser_pass").value != ""){


        firebase.auth().createUserWithEmailAndPassword(userSignup.cusername, userSignup.cpassword).then(function() {
          // Sign-In successful.
          //console.log("Signup successful");

          var user = firebase.auth().currentUser;

          user.sendEmailVerification().then(function(result) { console.log(result) },function(error){ console.log(error)}); 

          user.updateProfile({
            displayName: userSignup.displayname,
            photoURL: userSignup.photoprofile
          }).then(function() {
            // Update successful.
            $state.go("login");
          }, function(error) {
            // An error happened.
            console.log(error);
          });
          
          


        }, function(error) {
          // An error happened.
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(errorCode);

          if (errorCode === 'auth/weak-password') {
             alert('Password is weak, choose a strong password.');
             return false;
          }else if (errorCode === 'auth/email-already-in-use') {
             alert('Email you entered is already in use.');
             return false;
          }



          
        });



    }else{

        alert('Please enter email and password');
        return false;

    }//end check client username password

    
  };// end $scope.doSignup()
  
  
  
}])


.controller('dashboardController', ['$scope', '$firebaseArray', 'CONFIG', function($scope, $firebaseArray, CONFIG) {
// TODO: Show profile data
  
  
}]);

