const util = require('util');

const { PredictionAPIClient } = require("@azure/cognitiveservices-customvision-prediction");

const predictionKey = "2d4ae585659b490dae3b3a53bf022562";

const sampleData = "atestimage.jpg";

const endPoint = "https://southcentralus.api.cognitive.microsoft.com/customvision/v3.0/Prediction/90b7006d-2927-4348-86c4-e91a79e154d9/classify/iterations/sign-language-recognition/url"
// const predictor = new PredictionAPIClient(predictionKey, endPoint);

const publishIterationName = "sign-language-recognition";
const projectId = "79ced5f2-36ce-48e2-911f-cb4ed1619d88";

async function getSign(firebaseStorageRef, uid, image) {
    console.log("Creating project...");

    const uidRef = firebaseStorageRef.child(`${uid}.jpg`);
    let downloadURL = 'https://firebasestorage.googleapis.com/v0/b/hackthenorth2019-324cc.appspot.com/o/';

    await fetch(image).then(res => res.blob()).then((blob) => {
        uidRef.put(new File([blob], `${uid}.jpg`)).then(async (snapshot) => {
            downloadURL = `${downloadURL}${uid}.jpg?alt=media`;
            let xhr = new XMLHttpRequest();
            xhr.open("POST", endPoint , true);
            xhr.setRequestHeader("Prediction-Key", predictionKey);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.onreadystatechange = (res) => {
                if(xhr.readyState === 4 && xhr.status === 200) {
                    const results = JSON.parse(xhr.responseText);
                    let curMax = null;
                    let curMaxProbability = 0;  
                    results.predictions.forEach(predictedResult => {
                        const curOne = (predictedResult.probability * 100.0).toFixed(2)
                        if (curOne > curMaxProbability){
                            curMax = predictedResult.tagName
                            curMaxProbability = curOne
                        }
                        console.log(`\t ${predictedResult.tagName}: ${(predictedResult.probability * 100.0).toFixed(2)}%`);
                    });
                    console.log(curMax);
                    return curMax;
                }
            }
            xhr.send(JSON.stringify({"url": downloadURL}));
        })
    });
}

export default getSign;