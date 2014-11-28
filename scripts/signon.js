/**
 * signon.js
 * @file Handles all of the sign-procedures and authentications.
 * Will read and write to the database (Firebase) when needed.
 * @author James Teague II jtteague13@gmail.com
 * @since 10/13/2014
 */

/*List of variables*/
var ref = new Firebase("https://qb-stock-exchange.firebaseio.com/");
var userRef = null;
var email = null;
var pword = null;
var verify = null;
/**
 * @enum {string}
 * @description Enumeration of all possible errors with authentication.
 * @readonly
 * @author James Teague II
 */
var ErrorEnum = Object.freeze({
	AUTHENTICATION_DISABLED: "AUTHENTICATION_DISABLED",
	EMAIL_TAKEN: "EMAIL_TAKEN",
	INVALID_ARGUMENTS: "INVALID_ARGUMENTS",
	INVALID_CONFIGURATION: "INVALID_CONFIGURATION",
	INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
	INVALID_EMAIL: "INVALID_EMAIL",
	INVALID_ORIGIN: "INVALID_ORIGIN",
	INVALID_PASSWORD: "INVALID_PASSWORD",
	INVALID_PROVIDER: "INVALID_PROVIDER",
	INVALID_TOKEN: "INVALID_TOKEN",
	INVALID_USER: "INVALID_USER",
	NETWORK_ERROR: "NETWORK_ERROR",
	PROVIDER_ERROR: "PROVIDER_ERROR",
	TRANSPORT_UNAVAILABLE: "TRANSPORT_UNAVAILABLE",
	UNKNOWN_ERROR: "UNKNOWN_ERROR",
	USER_CANCELLED: "USER_CANCELLED",
	USER_DENIED: "USER_DENIED",
	/** @type {Object} */
	NULL: null
});
/**
 * @enum {string}
 * @description Enumeration of possible providers for authentication.
 * @readonly
 * @author James Teague II
 */
var ProviderEnum = Object.freeze({
	FACEBOOK: "facebook",
	GOOGLE: "google",
	EMAIL: "password"
});

/**
 * @function login
 * @description Authenticate user with Email and Password.
 * @return none
 * @author James Teague II
 */
function login() {
	email = $("#email").val();
	pword = $("#password").val();
	//authenticate user with firebase.
	ref.authWithPassword({
		email    : email,
		password : pword
	}, function(error, authData) {
		if(error){
			switch (error.code){
				case ErrorEnum.INVALID_PASSWORD:
					$("#signInErr").text("Password is incorrect.");
					setTimeout(function(){$("#signInErr").text("")},5000);
					break;
				case ErrorEnum.INVALID_USER:
					$("#signInErr").text(error.message);
					setTimeout(function(){$("#signInErr").text("")},5000);
					break;
				case ErrorEnum.INVALID_EMAIL:
					$("#signInErr").text("Not a valid format of email address.");
					setTimeout(function(){$("#signInErr").text("")},5000);
					break;
			}
		}
	});
}
/**
 * @function autoLogin
 * @private
 * @description Logs user in using provider password.
 * @param  {String} email user email
 * @param  {String} pword user password
 * @return none
 * @author James Teague II
 * @since 11/6/2014
 */
function autoLogin(email, pword) {
	ref.authWithPassword({
		email    : email,
		password : pword
	}, function(error, authData) {
		if(error){
			console.log(error.code, error.message)
		}
	});
}
/**
 * @function thirdPartyLogin
 * @description Authenticate user using a third-party.
 * @param  {string} provider name of the third party
 * @return none
 * @author James Teague II
 * @since 10/25/2014
 */
function thirdPartyLogin(provider){
	ref.authWithOAuthPopup(provider, function(error, authData) {
		if(error){
			switch(error){
				case ErrorEnum.USER_CANCELLED:
					if(provider === ProviderEnum.FACEBOOK){
						$("#fbErr").text("User cancelled action");
						setTimeout(function(){$("#fbErr").text("")},5000);
						break;	
					}
					if(provider === ProviderEnum.GOOGLE){
						$("#googErr").text("User cancelled action");
						setTimeout(function(){$("#googErr").text("")},5000);
						break;
					}
				case ErrorEnum.INVALID_PASSWORD:
					if(provider === ProviderEnum.FACEBOOK){
						$("#fbErr").text("Password is incorrect.");
						setTimeout(function(){$("#fbErr").text("")},5000);
						break;	
					}
					if(provider === ProviderEnum.GOOGLE){
						$("#googErr").text("Password is incorrect.");
						setTimeout(function(){$("#googErr").text("")},5000);
						break;
					}
				case ErrorEnum.PROVIDER_ERROR:
					if(provider === ProviderEnum.FACEBOOK){
						$("#fbErr").text(error.message);
						setTimeout(function(){$("#fbErr").text("")},5000);
						break;	
					}
					if(provider === ProviderEnum.GOOGLE){
						$("#googErr").text(error.message);
						setTimeout(function(){$("#googErr").text("")},5000);
						break;
					}
				case ErrorEnum.NETWORK_ERROR:

				break;
			}
		}
	}, {scope: "email"}); //the permissions requested
}
/**
 * @function createUser
 * @description create an account and register it with the database
 * @return none
 * @author James Teague II
 * @since 10/13/2014
 */
function createUser() {
	//Grab user input from input boxes on page
	email = $("#userEmail").val();
	pword = $("#userPass").val();
	verify = $("#verifyPass").val();
	//verify that the passwords match
	if(pword === verify){
		//create the user using Firebase
		ref.createUser({
			email    : email,
			password : pword
		}, function(error) {
			if(error){
				switch (error.code){
					case ErrorEnum.INVALID_EMAIL:
						$("#divErr").text("The specified email address is not valid.");
						setTimeout(function(){$("#divErr").text("")},5000);
						break;
					case ErrorEnum.EMAIL_TAKEN:
						$("#divErr").text(error.message);
						setTimeout(function(){$("#divErr").text("")},5000);
						break;
					default:
						$("#divErr").text(error.code+": "+ "Please contact webmaster.");
				}
			} else {
				$("#userEmail").attr("disabled","disabled");
				$("#userPass").attr("disabled","disabled");
				$("#verifyPass").attr("disabled","disabled");
				$("#divErr").text("You have successfully created an account! \
					Please log in using your new credentials.");
			}
		});
	}
	else{
		$("#divErr").text("Passwords do not match.");
	}
}
/**
 * @function insertNewUser
 * @description Inserts a new user into database with the alotted $1000
 * @param  {Object} user authData
 * @return none
 * @author James Teague II
 * @since 10/13/2014
 */
function insertNewUser(user) {
	var userRef = ref.child('users').child(user.uid);
	userRef.child('purse').set(20000);
	userRef.child('level').update(0);
	if(user.provider === ProviderEnum.EMAIL){
		userRef.update({"email": user.password.email});
	}
	else if(user.provider === ProviderEnum.FACEBOOK){
		userRef.update({"email": user.facebook.email});
	}
	else if(user.provider === ProviderEnum.GOOGLE){
		userRef.update({"email": user.google.email});
	}
	userRef.once('value', function(snapshot){
		if(snapshot.val()){
			sessvars.sessionObj = Object.freeze(snapshot.exportVal());
			window.location.href = "https://qb-stock-exchange.firebaseapp.com/myaccount.html";
		}
	});
}
/**
 * @function deleteUser
 * @description Deletes user node from the database 
 * and calls deleteAccount.
 * @see deleteAccount
 * @param  {String} email User's email to be deleted.
 * @return none
 * @author James Teague II
 * @since 11/4/2014
 */
function deleteUser(email) {
	var authData = ref.getAuth();
	if(authData.provider === ProviderEnum.EMAIL) {
		var p = prompt("If you enter your password, this will delete all of your progress even in the event of an error.",
	 	"Enter your password.");
		ref.child('users').child(authData.uid).once("value", function(snapshot) {
			sessvars.tempData = snapshot.val();
			ref.child('users').child(authData.uid).remove(deleteAccount(email, p));
		});
	}
	else if(authData.provider === ProviderEnum.FACEBOOK || authData.provider === ProviderEnum.GOOGLE) {
		var sure = confirm("Are you sure you want to remove Stock Account?")
		if(sure){
			ref.child('users').child(authData.uid).remove(function(error){
				if(error){
					alert("There was an error. Please try again or contact webmaster.", error.code);
				}
				else{
					alert("You have been removed.")
					logout();
				}
			});
		}
	}
	
}
/**
 * @function deleteAccount
 * @description remove user account from the application
 * @param  {String} email user's email
 * @param  {String} pass  user's password
 * @return none
 * @author James Teague II
 * @since 11/4/2014
 */
function deleteAccount(email, pass) {
	ref.removeUser({
  		email    : email,
  		password : pass
	}, function(error) {
		if(error){
			switch(error.code){
	  			case ErrorEnum.INVALID_PASSWORD:
	  				alert("Password was invalid. Account not deleted.");
	  				restoreLostData(email, pass);
	  				break;
	  			default:
	  				alert("OOPS! There was an error on our end! Please try again later or contact the webmaster.", error.code);
	  				restoreLostData(email, pass);
	  				break;
  			}
		} else {
			alert("User Account Deleted.");
			logout();
		}
	});
}
/**
 * @function restoreLostData
 * @private
 * @description Puts user data back into the database if
 * there was an issue removing their account.
 * @param  {String} email user email
 * @param  {String} pword user password
 * @return none
 * @author James Teague II
 * @since 11/6/2014
 */
function restoreLostData(email, pass) {
	//log user back in
	autoLogin(email,pass);
	//get authData, eventListener should be off
	var data = ref.getAuth();
	if(data.uid){
		//insert users temporary data back into the db and remove that data from session object
		ref.child('users').child(data.uid).set(sessvars.tempData, function(){
			sessvars.tempData = SessionModule.pruneTemporary(sessvars.tempData);
		});
	}
}
function forgotPassword() {
	firebaseRef.resetPassword({
  		email : $("#userEmail").val();
	}, function(err) {
		  if (err) {
		    switch (err.code) {
		      case ErrorEnum.INVALID_USER:
		        $("#signInErr").text(err.message);
		      case default:
				$("#signInErr").text(err.code+": "+ "Please contact webmaster.");
		    }
		  } else {
		    alert("Password Reset Email sent.");
		  }
	});
}
function resetPassword(email) {
	ref.changePassword({
  		email       : email,
  		oldPassword : "correcthorsebatterystaple",
  		newPassword : "neatsupersecurenewpassword"
	}, function(error) {
  		if (error === null) {
    		console.log("Password changed successfully");
  		} else {
    		console.log("Error changing password:", error);
  		}
	});
}
/**
 * @function logout
 * @description Cleans session object, logs out user from application, and
 * sends user back to login page.
 * @see module:SessionModule#destroySession
 * @return none
 */
function logout() {
	SessionModule.destroySession(sessvars);
	ref.unauth();
	window.location.href = "https://qb-stock-exchange.firebaseapp.com";
}
/**
 * @function handleLogon
 * @description  If the authenticated user does not have a node in
 * the database one will be created for them. If the user does
 * have a node a session object is made. Once session object
 * is created the page is redirected.
 * @see insertNewUser
 * @param  {Object} authData authentication object from firebase
 * @return none
 */
var handleLogon = function (authData) {
	var go = false;
	if (authData) {
		//keep this from being run again
		ref.offAuth(handleLogon);
		//get a reference to the user and store it for quick access
		userRef = ref.child('users').child(authData.uid);
		userRef.once('value', function(snapshot){
			//if user data does not exist in database
			if(!snapshot.val()){
				insertNewUser(authData);
			}
			else{
				//if there is not session object
				if(!sessvars.sessionObj){
					//allow for page redirection
					go = true;
					sessvars.sessionObj = Object.freeze(snapshot.exportVal());
				}
				if(go){
					go = false;
					window.location.href = "https://qb-stock-exchange.firebaseapp.com/myaccount.html";
				}
				else{
					SessionModule.freeze(sessvars.sessionObj);
				}
			}
		});
  	}
}
/**
 * @event onAuth
 * @description Event listener for a change in authentication.
 * @param  {function} Function that runs code you want to do on the event
 * @return none
 * @author James Teague II
 * @since 10/13/2014
 */
ref.onAuth(handleLogon);