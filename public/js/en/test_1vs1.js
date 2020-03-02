let selectedTones;

$(function(){
    $('input[name=tone]').on('change', function(){
        let vals = $('input[name=tone]:checked').map(function(){
            return $(this).val();
        }).get();
        console.log(vals);
        if (vals.length==2) {
            $("#selectBtn").prop("disabled", false);
            selectedTones = vals;
        } else {
            $("#selectBtn").prop("disabled", true);
        }
    });
});

function clickBtn() {
    console.log(selectedTones);
    let tone_a = selectedTones[0];
    let tone_b = selectedTones[1];
    let comment = "Make sure the selected tones are:\n"+"Tone"+tone_a+" & Tone"+tone_b;
    let new_url = "pair_test.html?query="+tone_a+tone_b;
    console.log(new_url);
    var result = window.confirm(comment);
    if (result) {
        location.replace(new_url);
    }
}