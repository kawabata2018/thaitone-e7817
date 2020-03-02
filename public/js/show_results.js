let resultsFiles;
const crt1 = document.getElementById('chart1').getContext('2d');
const crt2 = document.getElementById('chart2').getContext('2d');
const crt3 = document.getElementById('chart3').getContext('2d');
const crt4 = document.getElementById('chart4').getContext('2d');
const crt5 = document.getElementById('chart5').getContext('2d');
const crt6 = document.getElementById('chart6').getContext('2d');
const crt7 = document.getElementById('chart7').getContext('2d');

let w = $('.col').width();
let h = $('.col').height();
$('.chart').attr('width', w*0.8);
$('.chart').attr('height', h*0.8);


$('#selectFile').on('change', () => {
    let selectedFiles = $('#selectFile').prop('files');
    resultsFiles = [].slice.call(selectedFiles)
    resultsFiles.sort(function(a,b){
        if (a.name > b.name) {
            return 1;
        } else {
            return -1;
        }
    })
    console.log(resultsFiles);
})

function show(){
    if (resultsFiles == null) {
        alert("ファイルを選択してください");
    } else {
        let fileNameList = [];
        let errataArrayList = [];
        let pctList = [];
        let resultsArray = [["Filename", 
                        "1>1", "1>2", "1>3", "1>4", "1>5",
                        "2>1", "2>2", "2>3", "2>4", "2>5",
                        "3>1", "3>2", "3>3", "3>4", "3>5",
                        "4>1", "4>2", "4>3", "4>4", "4>5",
                        "5>1", "5>2", "5>3", "5>4", "5>5",
                        "Percentage"]];
        let myPromise = new Promise((res, rej) => {
            async function loop(i){
                let count = await new Promise((resolve, reject) => {
                    // storing fileNames
                    let fileName = resultsFiles[i].name.slice(0, -4);
                    let resultArray = [str2date(fileName)];
                    fileNameList.push(fileName);
                    // storing fileData
                    let reader = new FileReader();
                    reader.onload = function (e) {
                        let analResults = analyzer(e.target.result);
                        let errataArray = analResults[0];
                        let pct = analResults[1];
                        console.log(errataArray);
                        console.log(pct);
                        errataArrayList.push(errataArray);
                        pctList.push(pct);
                        // resultsArray
                        resultArray = resultArray.concat(errataArray, pct+"%");
                        console.log(resultArray);
                        resultsArray.push(resultArray);
                        // count
                        console.log(i, fileName);
                        resolve(i+1);
                        
                    };
                    reader.readAsText(resultsFiles[i]);
                });
                if (count < resultsFiles.length) {
                    setTimeout(() => {
                        loop(count);
                    }, 100)
                } else {
                    setTimeout(() => {
                        res();
                    }, 100)
                }
            }
            // start
            loop(0);
        })
        myPromise.then(() => {
            console.log(fileNameList);
            console.log(errataArrayList);
            console.log(pctList);
            let totalErrataArray = sumArray(errataArrayList);
            let resultCSV = array2CSV(resultsArray);
            array2Charts(totalErrataArray);
            list2Graph(fileNameList, pctList);
            downloadCSV(resultCSV, "results.csv");
        })
    }
}

function analyzer(csvTxt){
    let correctNum = 0;
    let errataArray = new Array(25).fill(0);
    const lines = csvTxt.split("\r\n").slice(1,-1);
    const totalNum = lines.length;
    for (let line of lines){
        let cols = line.split(",");
        let ref = Number(cols[2]);
        let your = Number(cols[3]);
        let isCorrect = Number(cols[4]);
        let idx = (ref-1)*5 + (your-1);
        errataArray[idx] += 1;
        correctNum += isCorrect;
    }
    return Array(errataArray, 100*correctNum/totalNum);
}

function sumArray(arrays){
    let d = arrays[0].length;
    let sum = new Array(d).fill(0);
    for (let array of arrays){
        for (let i=0; i<d; ++i){
            sum[i] += array[i]
        }
    }
    return sum;
}

function str2date(str){
    return str.slice(0,2)+"/"+str.slice(2,4)+" "+str.slice(4,6)+":"+str.slice(6,8);
}

function array2CSV(array){
    let csv = "";
    for (let line of array){
      csv += line.join(",");
      csv += "\r\n";
    }
    return csv;
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


// drawing Charts
function array2Charts(theArray){
    let tone1 = theArray.slice(0,5);
    let tone2 = theArray.slice(5,10);
    let tone3 = theArray.slice(10,15);
    let tone4 = theArray.slice(15,20);
    let tone5 = theArray.slice(20,25);
    let pct1 = 100 * tone1[0]/tone1.reduce((a,x) => a+=x,0);
    let pct2 = 100 * tone2[1]/tone2.reduce((a,x) => a+=x,0);
    let pct3 = 100 * tone3[2]/tone3.reduce((a,x) => a+=x,0);
    let pct4 = 100 * tone4[3]/tone4.reduce((a,x) => a+=x,0);
    let pct5 = 100 * tone5[4]/tone5.reduce((a,x) => a+=x,0);

    let myPieChart1 = new Chart(crt1, {
        type: 'pie',
        data: {
            labels: ["1>1", "1>2", "1>3", "1>4", "1>5"],
            datasets: [{
                data: tone1,
                borderWidth: 1,
                backgroundColor: [
                    'deepskyblue',
                    '#aaa',
                    '#eee',                
                    '#bbb',
                    '#ddd',
                ],
            }]
        },
        options: {
            cutoutPercentage: 0,
            title: {
                display: true,
                fontColor: 'black',
                fontSize: 20,
                padding: 0,
                text: '1st Tone'
            },
            legend: {
                display: true,
                labels: {
                    boxWidth: 10
                }
            }
        }
    });
    let myPieChart2 = new Chart(crt2, {
        type: 'pie',
        data: {
            labels: ["2>1", "2>2", "2>3", "2>4", "2>5"],
            datasets: [{
                data: tone2,
                borderWidth: 1,
                backgroundColor: [
                    '#ccc',
                    'deepskyblue',
                    '#eee',                
                    '#bbb',
                    '#ddd',
                ],
            }]
        },
        options: {
            cutoutPercentage: 0,
            title: {
                display: true,
                fontColor: 'black',
                fontSize: 20,
                padding: 0,
                text: '2nd Tone'
            },
            legend: {
                display: true,
                labels: {
                    boxWidth: 10
                }
            }
        }
    });
    let myPieChart3 = new Chart(crt3, {
        type: 'pie',
        data: {
            labels: ["3>1", "3>2", "3>3", "3>4", "3>5"],
            datasets: [{
                data: tone3,
                borderWidth: 1,
                backgroundColor: [
                    '#ccc',
                    '#aaa',
                    'deepskyblue',                
                    '#bbb',
                    '#ddd',
                ],
            }]
        },
        options: {
            cutoutPercentage: 0,
            title: {
                display: true,
                fontColor: 'black',
                fontSize: 20,
                padding: 0,
                text: '3rd Tone'
            },
            legend: {
                display: true,
                labels: {
                    boxWidth: 10
                }
            }
        }
    });
    let myPieChart4 = new Chart(crt4, {
        type: 'pie',
        data: {
            labels: ["4>1", "4>2", "4>3", "4>4", "4>5"],
            datasets: [{
                data: tone4,
                borderWidth: 1,
                backgroundColor: [
                    '#ccc',
                    '#aaa',
                    '#eee',                
                    'deepskyblue',
                    '#ddd',
                ],
            }]
        },
        options: {
            cutoutPercentage: 0,
            title: {
                display: true,
                fontColor: 'black',
                fontSize: 20,
                padding: 0,
                text: '4th Tone'
            },
            legend: {
                display: true,
                labels: {
                    boxWidth: 10
                }
            }
        }
    });
    let myPieChart5 = new Chart(crt5, {
        type: 'pie',
        data: {
            labels: ["5>1", "5>2", "5>3", "5>4", "5>5"],
            datasets: [{
                data: tone5,
                borderWidth: 1,
                backgroundColor: [
                    '#ccc',
                    '#aaa',
                    '#eee',                
                    '#bbb',
                    'deepskyblue',
                ],
            }]
        },
        options: {
            cutoutPercentage: 0,
            title: {
                display: true,
                fontColor: 'black',
                fontSize: 20,
                padding: 0,
                text: '5th Tone'
            },
            legend: {
                display: true,
                labels: {
                    boxWidth: 10
                }
            }
        }
    });
    var myRadarChart6 = new Chart(crt6, {
        type: 'radar', 
        data: { 
            labels: ["1", "2", "3", "4", "5"],
            datasets: [{
                label: "TOTAL",
                data: Array(pct1, pct2, pct3, pct4, pct5),
                borderColor: 'cyan',
                borderWidth: 3,
            }]
        },
        options: {
            scale:{
                ticks:{
                    suggestedMin: 0,
                    suggestedMax: 100,
                    stepSize: 20,
                    callback: function(value, index, values){
                        return  value + '%'
                    }
                }
            }
        }
    });
}

function list2Graph(fileNames, pcts){
    let myLineChart7 = new Chart(crt7, {
        type: 'line',
        data: {
            labels: fileNames,
            datasets: [{
                label: '正答率',
                data: pcts,
                borderColor: 'deepskyblue',
            }]
        },
        options: {
            scales: {
              yAxes: [{
                ticks: {
                  suggestedMax: 100,
                  suggestedMin: 0,
                  stepSize: 10,
                  callback: function(value, index, values){
                    return  value + '%'
                  }
                }
              }]
            },
          }
    })
}
