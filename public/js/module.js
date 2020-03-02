function urlTo(lang){
    let url = location.href;
    if (lang=="en") {
        let src = url.split('/').pop();
        let new_url = url.replace(src, 'en/'+src);
        location.replace(new_url);
    } else {
        let new_url = url.replace('/en/', '/');
        location.replace(new_url);
    }
}

function confirmQuit(url){
    let res = confirm("保存せずに終了しますか？");
    // let res = confirm("Are you sure you want to quit without saving?");
    if (res) {
        location.replace(url);
    }
}

function shuffle(array){
    let n = array.length, t, i;
    while (n) {
      i = Math.floor(Math.random() * n--);
      t = array[n];
      array[n] = array[i];
      array[i] = t;
    }
    return array;
}
  
function array2CSV(array){
    let csv = "";
    for (let line of array){
        csv += line.join(",");
        csv += "\r\n";
    }
    return csv;
}

function getNowtime(){
    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth()+1;
    let day = today.getDate();
    let hour = today.getHours();
    let minute = today.getMinutes();
    let YY = year;
    let MM = ("0"+month).slice(-2);
    let DD = ("0"+day).slice(-2);
    let hh = ("0"+hour).slice(-2);
    let mm = ("0"+minute).slice(-2);
    return YY+"-"+MM+DD+"-"+hh+mm;
}

function downloadCSV(csvString, filename){
    const bom     = new Uint8Array([0xEF, 0xBB, 0xBF]);
    const blob    = new Blob([bom, csvString], {'type': 'text/csv'});
    const url     = window.URL || window.webkitURL;
    const blobURL = url.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = blobURL;
    a.download = decodeURI(filename);
    a.type = 'text/csv';
    a.click();
}
  
function uploadCSV(csvString, filename){
    let userId = (function(){
        console.log("uid:", sessionStorage.getItem('u-uid'));
        return sessionStorage.getItem('u-uid');
    })();
    // Create a root reference
    let storageRef = firebase.storage().ref('results_term1');
    // Create a reference to directory {uid}/
    let uidRef = storageRef.child(userId);
    // Create a reference to csv file
    let csvFileRef = uidRef.child(filename);
    // CSV string
    upload = csvFileRef.putString(csvString)
    // Show uploading window
    dispUploading();
    upload.on('state_changed', function(snapshot){
        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED:
                console.log('Upload is paused');
                break;
            case firebase.storage.TaskState.RUNNING:
                console.log('Upload is running');
                break;
        }
    }, function(error) {
        console.log(error.code);
        alert('Upload Failed\nError code: '+error.code);
    }, function() {
        console.log('Successfully uploaded');
        setTimeout(function(){
            removeUploading();
        }, 500);
    })
}

function dispUploading(){
    var dispMsg = "<div class='uploadingMsg'><h1>Uploading...</h1></div>";
    $("body").append("<div id='uploading'>" + dispMsg + "</div>");
}
   
function removeUploading(){
    $("#uploading").remove();
}