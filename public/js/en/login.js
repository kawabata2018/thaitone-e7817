let user_name;
let user_email;
let user_uid;

let authPromise = new Promise((res, rej) => {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            user_name = user.displayName;
            user_email = user.email;
            user_uid = user.uid;
            console.log('auth user', user);
        } else {
            // No user is signed in.
            user_name = "guestuser";
            user_email = "guest@user.com";
            user_uid = "uid_guestuser";
        }
        res();
    })
})

authPromise.then(() => {
    sessionStorage['u-name'] = user_name;
    sessionStorage['u-email'] = user_email;
    sessionStorage['u-uid'] = user_uid;
    // console.log("[referrer]", sessionStorage.getItem('referrer'));
    console.log("[u-email]", sessionStorage.getItem('u-email'));
    console.log("[u-uid]", sessionStorage.getItem('u-uid'));
    let innerHtml = '<span>Welcome, <b>'+user_name+'</b> !</span>';
    if (user_name=="guestuser") {
        innerHtml += '<button class="overBtn" onclick="signIn()">Sign In</button>';
    } else {
        innerHtml += '<button class="overBtn" onclick="signOut()">Sign Out</button>';
    }
    $('#user_menu').html(innerHtml);
})

function signOut(){
    let res = confirm("Are you sure you want to log out?");
    if (res==true) {
        firebase.auth().signOut().then(() => {
            sessionStorage.removeItem('referrer');
            location.reload();
            console.log("Successfully logged out");
        })
    }
}

function signIn(){
    sessionStorage['referrer'] = location.href;
    setTimeout(function(){
        location.href = 'index.html';
    }, 500)
}