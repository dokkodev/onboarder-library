getOnboardingsByUrl = function(url) {
    $.ajax({
        type: "GET",
        url: "onboarder/OnboardingSet",
        contentType: "application/json",
        data: {url: url}
    }).then(function (data) {
        console.log(data);
        res = JSON.parse(data);
        return res;
    });
};

saveOnboardingsByUrl = function(json) {
    $.ajax({
        type: "POST",
        url: "onboarder/OnboardingSet",
        contentType: "application/json",
        data: JSON.stringify(json)
    }).then(function (data) {
        console.log("Saved Successfully!");
    });
};

$('.file_input').on("change", function() {

    var $files = $(this).get(0).files;

    if ($files.length) {

        // Reject big files
        if ($files[0].size > $(this).data("max-size") * 1024) {
            console.log("Please select a smaller file");
            return false;
        }

        // Begin file upload
        console.log("Uploading file to Imgur..");

        // Replace ctrlq with your own API key
        var apiUrl = 'https://api.imgur.com/3/image';
        var apiKey = 'eb13703ce2f6c42';

        var settings = {
            async: false,
            crossDomain: true,
            processData: false,
            contentType: false,
            type: 'POST',
            url: apiUrl,
            headers: {
                Authorization: 'Client-ID ' + apiKey,
                Accept: 'application/json'
            },
            mimeType: 'multipart/form-data'
        };

        var formData = new FormData();
        formData.append("image", $files[0]);
        settings.data = formData;

        // Response contains stringified JSON
        // Image URL available at response.data.link
        $.ajax(settings).done(function(response) {
            console.log(response.data.link);
        });

    }
});

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
