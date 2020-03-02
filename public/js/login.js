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
    console.log("[referrer]", sessionStorage.getItem('referrer'));
    console.log("[u-uid]" ,sessionStorage.getItem('u-uid'));
    let innerHtml = '<span>ようこそ, <b>'+user_name+'</b>さん</span>';
    if (user_name=="guestuser") {
        innerHtml += '<button class="overBtn" onclick="signIn()">Sign In</button>';
    } else {
        innerHtml += '<button class="overBtn" onclick="signOut()">Sign Out</button>';
    }
    $('#user_menu').html(innerHtml);
})

function signOut(){
    let res = confirm("本当にサインアウトしますか？");
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
        location.replace('index.html');
    }, 500)
}