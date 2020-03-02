let count;
let isCorrect = 0;
let clickNum = 0;
let refArray = [];
let soundArray = [];
let outputs = [["soundPath", "clickNum", "reference", "your", "isCorrect"]];
const total = 40;
const soundFolderRef = firebase.storage().ref('soundFolder/');

$(function(){
  $(window).on('beforeunload', function(){
    return "このページから移動してよろしいですか？\n移動すると結果が保存されません。";
  })
})

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
      ref = shuffle(ref).slice(0,8);
      refArray = refArray.concat(ref);
    }
    refArray = shuffle(refArray);
    // total = refArray.length;
    console.log("refArray has been set successfully")
    // console.log(refArray);
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
    $('#mondai').html("Q. " + (count+1) + "/" + total);
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
    $('.answerBtn').prop('disabled', false);
  }
}

function answerFunc(btn){
  $('#playBtn').prop('disabled', false);
  $('.answerBtn').prop('disabled', true);
  let ref = refArray[count][1];
  let out = [refArray[count][0], clickNum, refArray[count][1], btn,];
  console.log("COUNT:"+count);
  // console.log("ref:"+ref);
  // console.log("your:"+btn);
  if (btn == ref){
    isCorrect++;
    out.push(1);
  } else {
    out.push(0);
  }
  count++;
  clickNum = 0;
  outputs.push(out);
  $('#soundBtn').get(0).play();
  $('#mondai').html("Q. " + (count+1) + "/" + total);

  if (count > total-1){
    $('#mondai').html("Finished!");
    let csv = array2CSV(outputs);
    let nowtime = getNowtime();
    console.log(csv);
    try {
      uploadCSV(csv, "testall_"+nowtime+".csv");
    } catch(err) {
      console.log(err.message);
      alert("Upload Failed\nError code: "+err.message)
    }
    $('#text').html(isCorrect + "/" + total + " Corrects");
    $('#startBtn').prop('diabled', false);
    $('#playBtn').html("Back to home screen");
    $('#playBtn').on('click', function(){
      $(window).off('beforeunload');
      location.replace('home.html');
    })
  }
}
