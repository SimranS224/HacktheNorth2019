const util = require('util');
const fs = require('fs');

const { PredictionAPIClient } = require("@azure/cognitiveservices-customvision-prediction");

const predictionKey = "2d4ae585659b490dae3b3a53bf022562";

const sampleData = "atestimage.jpg";

const endPoint = "https://southcentralus.api.cognitive.microsoft.com/customvision/v3.0/Prediction/90b7006d-2927-4348-86c4-e91a79e154d9/classify/iterations/sign-language-recognition/image"
const predictor = new PredictionAPIClient(predictionKey, endPoint);

const publishIterationName = "sign-language-recognition";
const projectId = "79ced5f2-36ce-48e2-911f-cb4ed1619d88";
 
export default getSign =  async () => {
    console.log("Creating project...");
    
    const testFile = fs.readFileSync(`${sampleData}`);
    
    const results = await predictor.classifyImage(projectId,publishIterationName, testFile);

    // Step 6. Show results
    console.log("Results:");
    let curMax = null;
    let curMaxProbability = 0
    
    results.predictions.forEach(predictedResult => {
        const curOne = (predictedResult.probability * 100.0).toFixed(2)
        if (curOne > curMaxProbability){
            curMax = predictedResult.tagName
            curMaxProbability = curOne
        }
        console.log(`\t ${predictedResult.tagName}: ${(predictedResult.probability * 100.0).toFixed(2)}%`);
    });
    console.log(curMax)
};
