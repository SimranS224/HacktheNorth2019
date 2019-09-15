const util = require('util');
const fs = require('fs');

const { PredictionAPIClient } = require("@azure/cognitiveservices-customvision-prediction");

const setTimeoutPromise = util.promisify(setTimeout);
const predictionKey = "2d4ae585659b490dae3b3a53bf022562";

const sampleData = "atestimage.jpg";

const endPoint = "https://southcentralus.api.cognitive.microsoft.com/customvision/v3.0/Prediction/90b7006d-2927-4348-86c4-e91a79e154d9/classify/iterations/sign-language-recognition/image"
const predictor = new PredictionAPIClient(predictionKey, endPoint);

const publishIterationName = "sign-language-recognition";
const projectId = "79ced5f2-36ce-48e2-911f-cb4ed1619d88";

(async () => {
    console.log("Creating project...");
    
    const testFile = fs.readFileSync(`${sampleData}`);
    
    const results = await predictor.classifyImage(projectId,publishIterationName, testFile);

    // Step 6. Show results
    console.log("Results:");
    results.predictions.forEach(predictedResult => {
        console.log(`\t ${predictedResult.tagName}: ${(predictedResult.probability * 100.0).toFixed(2)}%`);
    });
})()

// $.ajax({
//     type: "POST",
//     url: url,
//     data: imageBytes,
//     processData: false,
//     headers: {
//         "Prediction-Key": "2d4ae585659b490dae3b3a53bf022562",
//         "Content-Type": "multipart/form-data"
//     }
// }).done(function (data) {
//     var predictions = data.predictions;
//     var artists = [predictions.find(o => o.tagName === 'Picasso'), predictions.find(o => o.tagName === 'Rembrandt'), predictions.find(o => o.tagName === 'Pollock')];
//     var sortedArtists = _.sortBy(artists, 'probability').reverse();
//     var possibleArtist = sortedArtists[0];

//     if (possibleArtist.probability > 0.9) {
//         $('#analysisResults').html('<div class="matchLabel">' + possibleArtist.tagName + ' (' + (possibleArtist.probability * 100).toFixed(0) + '%)' + '</div>');
//     }
//     else {
//         $('#analysisResults').html('<div class="noMatchLabel">Unknown artist</div>');
//     }

// }).fail(function (xhr, status, err) {
//     alert(err);
// });