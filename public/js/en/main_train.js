﻿let count;
let total;
let isCorrect = 0;
let clickNum = 0;
let isAnswered = false;
let refArray = [];
let soundArray = [];
let outputs = [["soundPath", "clickNum", "reference", "your", "isCorrect"]];
const soundFolderRef = firebase.storage().ref('soundFolder/');

$('#startBtn').on('click', () => {
    // create mondai set
    for (let tone=1; tone<6; tone++){
      let ref = [];
      // 1.wav-50.wav in the directory
      for (let i=1; i<51; i++){
        // 0/-7/ dir
        for (let j=0; j<8; j++){
          let path = j+"/"+tone+"/"+i+".wav";
          ref.push([path, tone]);
        }
      }
      ref = shuffle(ref).slice(0,4);
      refArray = refArray.concat(ref);
    }
    refArray = shuffle(refArray);
    total = refArray.length;
    console.log("refArray has been set successfully")
    console.log(refArray);
    // create soundArray
    async function loop(i){
      let cnt = await new Promise((res, rej) => {
        new Promise((resolve, reject) => {
          soundFolderRef.child(refArray[i][0]).getDownloadURL().then((url) => {
            soundArray.push(url);
            resolve();
          })
        }).then(() => {
          res(i+1);
        })
      })
      if (cnt < refArray.length) {
        loop(cnt);
      }
    }
    // start
    loop(0);
    count = 0;
    $('#text').html("Q. " + (count+1) + "/" + total);
    $('#mondai').html("Training Mode");
    $('#mondaiSet').prop('disabled', true);
    $('#playBtn').prop('disabled', false);
    $('#startBtn').prop('disabled', true);
})

function playSound(wavPath){
  let myAudio = new Audio(wavPath);
  let p = myAudio.play();
  p.catch(function(e){
    console.log(e.message);
    alert("The audio file not available\nError code: "+e.message);
  })
}

function myPlaySound(){
  clickNum++;
  if (count <= total-1){
    playSound(soundArray[count]);
    // if the question has not answered yet
    if (!isAnswered) {
      $('.answerBtn').prop('disabled', false);
    }
  }
}

function incFunc(){
  if (count<total-1){
    count++;
    clickNum = 0;
    $('#soundBtn').get(0).play();
    isAnswered = false;
    $('#nextBtn').prop('disabled', true);
    $('#text').html("Q. " + (count+1) + "/" + total);
    $('#mondai').html("Training Mode");
    $('#playBtn').html("Play");
  } else {
    $('#mondai').html("Finished!");
    let csv = array2CSV(outputs);
    let nowtime = getNowtime();
    console.log(csv);
    try {
      uploadCSV(csv, "trainall_"+nowtime+".csv");
    } catch(err) {
      console.log(err.message);
      alert("Upload Failed\nError code: "+err.message)
    } finally {
      $('#nextBtn').prop('disabled', true);
      $('#quitBtn').hide();
      $('#text').html(isCorrect + "/" + total + " Corrects");
      $('#playBtn').html("Back to home screen");
      $('#playBtn').on('click', function(){
        location.replace('home.html');
      })
    }
  }
}

function answerFunc(btn){
  $('#playBtn').prop('disabled', false);
  $('.answerBtn').prop('disabled', true);
  let ref = refArray[count][1];
  let out = [refArray[count][0], clickNum, refArray[count][1], btn,];
  console.log("COUNT:"+count);
  console.log("ref:"+ref);
  console.log("your:"+btn);
  // right or wrong!
  if (btn == ref){
    isAnswered = true;
    isCorrect++;
    out.push(1);
    $('#soundRgt').get(0).play();
    $('#mondai').html("Right! The answer is "+ref);
    $('#playBtn').html("Listen again");
    $('#nextBtn').prop('disabled', false);
  } else {
    isAnswered = true;
    out.push(0);
    $('#soundWrg').get(0).play();
    $('#mondai').html("Wrong! The answer is "+ref);
    $('#playBtn').html("Listen again");
    $('#nextBtn').prop('disabled', false);
  }
  outputs.push(out);
}
