/**
 * signon.js
 * @file Handles all of the sign-procedures and authentications.
 * Will read and write to the database (Firebase) when needed.
 * @requires sessvars
 * @requires sessionModule
 * @requires alertify
 * @author James Teague II jtteague13@gmail.com
 * @since 10/13/2014
 */
/*jslint white: true */
/*jslint browser: true */
/*global alertify, sessvars, Firebase, SessionModule*/
/*List of variables*/
var ref = new Firebase("https://qb-stock-exchange.firebaseio.com/");
var userRef = null;
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
 * @since 10/13/2014
 */
function login() {
	var isMobile = false;
	if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
 		isMobile = true;
	}
	//authenticate user with firebase.
	ref.authWithPassword({
		email    : $("#email").val(),
		password : $("#password").val()
	}, function(error, authData) {
		if(error){
			switch (error.code){
				case ErrorEnum.INVALID_PASSWORD:
					// $("#signInErr").text("Password is incorrect.");
					// setTimeout(function(){$("#signInErr").text("")},5000);
					if(isMobile){
						var scrollY = window.pageYOffset;
						alertify.error("Password is incorrect.");
						$(".alertify-logs").css("top", scrollY+"px");
					}
					else{
						alertify.error("Password is incorrect.");
					}
					break;
				case ErrorEnum.INVALID_USER:
					// $("#signInErr").text(error.message);
					// setTimeout(function(){$("#signInErr").text("")},5000);
					
					if(isMobile){
						var scrollY = window.pageYOffset;
						alertify.error(error.message);
						$(".alertify-logs").css("top", scrollY+"px");
					}
					else{
						alertify.error(error.message);
					}
					break;
				case ErrorEnum.INVALID_EMAIL:
					// $("#signInErr").text("Not a valid format of email address.");
					// setTimeout(function(){$("#signInErr").text("")},5000);
					//window.scrollTo(0,1);
					if(isMobile){
						var scrollY = window.pageYOffset;
						alertify.error("Not a valid format of email address.");
						$(".alertify-logs").css("top", scrollY+"px");
					}
					else{
						alertify.error("Not a valid format of email address.");
					}
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
			console.log(error.code, error.message);
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
			switch(error.code){
				case ErrorEnum.USER_CANCELLED:
					alertify.log("User cancelled action.");
					break;
				case ErrorEnum.INVALID_PASSWORD:
					alertify.error("Password is incorrect.");
					break;
				case ErrorEnum.PROVIDER_ERROR:
					alertify.error(error.message);
					break;
				case ErrorEnum.NETWORK_ERROR:
					alertify.error(error.message);
					break;
				default:
					alertify.alert(error.code + ": Please contact webmaster");
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
	// email = $("#userEmail").val();
	var pword = $("#userPass").val();
	var verify = $("#verifyPass").val();
	//verify that the passwords match
	if(pword === verify){
		//create the user using Firebase
		ref.createUser({
			email    : $("#userEmail").val(),
			password : pword
		}, function(error) {
			if(error){
				switch (error.code){
					case ErrorEnum.INVALID_EMAIL:
						alertify.error("The specified email address is not valid.");
						break;
					case ErrorEnum.EMAIL_TAKEN:
						alertify.error(error.message);
						break;
					default:
						alertify.alert(error.code+": Please contact webmaster.");
				}
			} else {
				$("#userEmail").attr("disabled","disabled");
				$("#userPass").attr("disabled","disabled");
				$("#verifyPass").attr("disabled","disabled");
				alertify.success("You have successfully created an account! \
					Please log in using your new credentials.");
			}
		});
	}
	else{
		alertify.error("Passwords do not match.");
	}
}
/**
 * @function insertNewUser
 * @description inserts a new user into database with the alotted $20,000
 * and the user's access level
 * @param  {Object} user authData
 * @return none
 * @author James Teague II
 * @since 10/13/2014
 */
function insertNewUser(user) {
	var userRef = ref.child('users').child(user.uid);
	userRef.child('purse').set(20000);
	userRef.child('level').set(0);
	if(user.provider === ProviderEnum.EMAIL){
		userRef.update({"email": user.password.email});
	}
	else if(user.provider === ProviderEnum.FACEBOOK){
		userRef.update({"email": user.facebook.email});
		//.displayName
	}
	else if(user.provider === ProviderEnum.GOOGLE){
		userRef.update({"email": user.google.email});
		//.displayName
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
 * @see logout
 * @param  {String} email User's email to be deleted.
 * @return none
 * @author James Teague II
 * @since 11/4/2014
 */
function deleteUser(email) {
	var authData = ref.getAuth();
	if(authData.provider === ProviderEnum.EMAIL) {
		// var p = prompt("Warning! This will remove all progress made on this account.",
	 // 	"Enter your password.");
	 	alertify.prompt("Warning! This will remove all progress made on this account.", function(e, str){
			if(e){
				ref.child('users').child(authData.uid).once("value", function(snapshot) {
					sessvars.tempData = snapshot.val();
					ref.child('users').child(authData.uid).remove(deleteAccount(email, str));
				});
			}
		}, "Enter your password");
		
	}
	else if(authData.provider === ProviderEnum.FACEBOOK || authData.provider === ProviderEnum.GOOGLE) {
		// var sure = confirm("Are you sure you want to remove Stock Account?")
		alertify.confirm("Are you sure you want to remove your Stock Account?", function(e){
			if(e){
				ref.child('users').child(authData.uid).remove(function(error){
					if(error){
						alertify.alert("There was an error. Please try again or contact webmaster.", error.code);
					}
					else{
						alertify.alert("You have been removed.");
						logout();
					}
				});
			}
		});
	}
	
}
/**
 * @function deleteAccount
 * @description remove user account from the application
 * @param  {String} email user's email
 * @param  {String} pass  user's password
 * @return none
 * @see logout
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
	  				alertify.alert("Password was invalid. Your account was not deleted.");
	  				restoreLostData(email, pass);
	  				break;
	  			default:
	  				alertify.alert("OOPS! There was an error on our end! Please try again later or contact the webmaster.", error.code);
	  				restoreLostData(email, pass);
	  				break;
  			}
		} else {
			alertify.alert("User Account Deleted.");
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
 * @see autoLogin
 * @see module:SessionModule#pruneTemporary
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
/**
 * @function forgotPassword
 * @description Sends user an email with temporary password
 * @return none
 * @author James Teague II
 * @since 12/12/2014
 */
function forgotPassword() {
	ref.resetPassword({
  		email : $("#email").val()
	}, function(err) {
		  if (err) {
		    switch (err.code) {
		      case ErrorEnum.INVALID_USER:
		        alertify.error(err.message);
		        break;
		   	  case ErrorEnum.INVALID_EMAIL:
		   	  	alertify.error(err.message);
		   	  	break;
		      default:
				alertify.alert(err.code+": "+ "Please contact webmaster.");
		    }
		  } else {
		    alertify.alert("Password Reset Email sent.");
		  }
	});
}
/**
 * @function getOldPassword
 * @description Prompts user for old/current password
 * then calls function to get the new password
 * @return none
 * @see getNewPassword
 * @author James Teague II
 * @since 12/14/2014
 */
function getOldPassword() {
	alertify.prompt("Enter Password", function(e, str){
		if(e){
			getNewPassword(str);
		}
	}, "Temporary Password");
}

/**
 * @function getNewPassword
 * @description Prompts user for new password
 * then calls function to change password
 * @param {String} oldPass the users old/current password
 * @return none
 * @see resetPassword
 * @author James Teague II
 * @since 12/14/2014
 */
function getNewPassword(oldPass) {
	alertify.prompt("Enter New Password", function(e, str){
		if(e){
			resetPassword(sessvars.sessionObj.email, oldPass, str);
		}
	}, "New Password");
}
/**
 * @function resetPassword
 * @description Changes the password associated with the account
 * @param {String} email email tied to account to change password
 * @param {String} op old/current password
 * @param {String} np new password
 * @return none
 * @author James Teague II
 * @since 12/14/2014
 */
function resetPassword(email, op, np) {
	ref.changePassword({
		email       : email,
		oldPassword : op,
		newPassword : np
	}, function(error) {
  		if (error) {
  			alertify.error("Error changing password: "+ error.message);
  		} else {
    		alertify.success("Password changed successfully!");
  		}
	});
}

/**
 * @function logout
 * @description Cleans session object, logs out user from application, and
 * sends user back to login page.
 * @see module:SessionModule#destroySession
 * @return none
 * @author James Teague II
 * @since 10/13/2014
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
 * @see getOldPassword
 * @see module:SessionModule#freeze
 * @param  {Object} authData authentication object from firebase
 * @return none
 * @author James Teague II
 * @since 12/14/2014
 * @todo Look at check for beenRedirected. Maybe check for missing
 * "index.html" instead of page 
 */
var handleLogon = function (authData) {
	var go = false;
	var beenRedirected = false;
	if(window.location.href.indexOf("myaccount.html") > -1){
		beenRedirected = true;
	}
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
				if(authData.provider === ProviderEnum.EMAIL && authData.password.isTemporaryPassword){
					alertify.alert("You have logged in with temporary password and you must change it.");
					getOldPassword(authData.password.email);
				}
				//if there is not session object
				if(!sessvars.sessionObj){
					//allow for page redirection
					go = true;
					sessvars.sessionObj = Object.freeze(snapshot.exportVal());
				}
				if(go || (sessvars.sessionObj && authData && !beenRedirected)){
					go = false;
					window.location.href = "https://qb-stock-exchange.firebaseapp.com/myaccount.html";
				}
				else{
					SessionModule.freeze(sessvars.sessionObj);
				}
			}
		});
  	}
  	//if user session timed out and there is no authData but there is a lingering session, clear it
  	else if (!authData && sessvars.sessionObj){
  		SessionModule.destroySession(sessvars);
  	}
};
/**
 * @event onAuth
 * @description Event listener for a change in authentication.
 * @param  {function} Function that runs code desired to be done on the event
 * @return none
 * @author James Teague II
 * @since 10/13/2014
 */
ref.onAuth(handleLogon);