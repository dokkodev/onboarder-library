getOnboardingsByUrl = function(url) {
    $.ajax({
        type: "GET",
        url: "onboarder/OnboardingSet",
        contentType: "application/json",
        data: {url: url}
    }).then(function (data) {
        load_onboardings(JSON.parse(data));


    });
};

saveOnboardings = function() {
    $.ajax({
        type: "POST",
        url: "onboarder/OnboardingSet",
        contentType: "application/json",
        data: JSON.stringify(globalJSON)
    }).then(function (data) {
        console.log("Saved Successfully!");
    });
};


//
//
// saveOnboardings = function() {
//
//     console.log(onboardings);
//
//     onboardings.sequenceOnboardings[0].boxProperty = {};
//     onboardings.sequenceOnboardings[0].boxProperty.fontSize = 1;
//     onboardings.sequenceOnboardings[0].boxProperty.boxDirection = 1;
//
//     $.ajax({
//         type: "POST",
//         url: "onboarder/OnboardingSet",
//         contentType: "application/json",
//         data: JSON.stringify(onboardings)
//     }).then(function (data) {
//         console.log("Saved Successfully!");
//     });
// };
//
// deleteOnboardingById = function(id, type) {
//   console.log(onboardings);
//
//   type = "swipe";
//
//   $.ajax({
//       type: "DELETE",
//       utl: "onboarder/Onboarding",
//       contentType: "application/json",
//       data: {id: id, type: type}
//   }).then(function (data) {
//       console.log("Deleted Successfully!");
//   });
// };
//
// getOnboardingsByUrl = function() {
//     $.ajax({
//         type: "GET",
//         url: "onboarder/OnboardingSet",
//         contentType: "application/json",
//         data: {url : dummyWebsite}
//     }).then(function (data) {
//         console.log(data);
//         res = JSON.parse(data);
//         res.sequenceOnboardings[0].content;
//         res.sequenceOnboardings[0].selector;
//         res.sequenceOnboardings[0].order;
//         $('#iframe').contents().find(res.sequenceOnboardings[0]
//             .selector+':eq('+res.sequenceOnboardings[0].order+')').css('background-color','red');
//
//         console.log($('#iframe').contents().find(res.sequenceOnboardings[0]
//             .selector+':eq('+res.sequenceOnboardings[0].order+')'));
//     });
// };
//
// $(document).ready(function() {
//     setTimeout(function(){
//         console.log("THIS IS");
//         getOnboardingsByUrl();
//     }, 5000);
// });
