import React from 'react';
import Webcam from "react-webcam";

// Import sign language icons
import A from '../sign_language_icons/A.svg';
import B from '../sign_language_icons/B.svg';
import C from '../sign_language_icons/C.svg';

const apiUrl = 'https://southcentralus.api.cognitive.microsoft.com/customvision/v3.0/Prediction/90b7006d-2927-4348-86c4-e91a79e154d9/classify/iterations/sign-language-recognition/image';
const predictionKey = '2d4ae585659b490dae3b3a53bf022562';

class GameEngine extends React.Component {
    /*

    */

    constructor(props) {
        super(props);
        this.state = {}
        // POSSIBLE STATUSES: DISPLAYING_HAND_SIGN, DISPLAY_RESULT
        this.state.currentStatus = "DISPLAY_HAND_SIGN"
        // this.state.handSignOptions = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L",
        //                               "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
        
        // target: A B C D E K I    
        this.state.handSignOptions = ["A", "B", "C"];
        this.state.handSignImages = [A, B, C];
        this.state.currentHandSign = "A";
        this.state.currentHandSignImage = A;
        this.state.result = "CORRECT";

        this.state.timeoutSet = false;
        
        this.setNewRandomHandSign();

        this.webcamRef = React.createRef();
    }

    setNewRandomHandSign() {
        var randomIndex = Math.floor(Math.random() * this.state.handSignOptions.length);
        this.setState({
            currentHandSign: this.state.handSignOptions[randomIndex],
            currentHandSignImage: this.state.handSignImages[randomIndex],
        });
    }

    getResult() {
        this.setState({
            result: "CORRECT"
        });
        return true
    }

    captureAndCheckImage() {
        const imageBase64 = this.webcamRef.current.getScreenshot();
        let image = new Image();
        image.src = imageBase64;    // image is now an image
    }

    displayHandSignPrompt() {
        if(!this.state.timeoutSet) {
            setTimeout(() => {
                this.getResult();
                this.setState({
                    currentStatus: "DISPLAY_RESULT",
                    timeoutSet: false
                });
                this.captureAndCheckImage();
            }, 4000);
            this.setState({
                timeoutSet: true
            });
        }
        return (
            <div className="handSignPrompt">
                <h1 className="label">Hand sign for</h1>
                <h1 className="prompt">"{this.state.currentHandSign}"</h1>
            </div>
        )
    }

    displayResult() {
        if(!this.state.timeoutSet) {
            setTimeout(() => {
                this.setNewRandomHandSign();
                this.setState({
                    currentStatus: "DISPLAY_HAND_SIGN",
                    timeoutSet: false
                });
            }, 1000);
            this.setState({
                timeoutSet: true
            })
        }
        if(this.state.result === "CORRECT") {
            return (
                <div className="result">
                    <h1>You got it! </h1>
                    <img src={this.state.currentHandSignImage} />
                </div>
            )
        } else {
            return (
                <div className="result">
                    <h1>Better next time</h1>
                    <img src={this.state.currentHandSignImage} />
                </div>
            )
        }
    }


    render() {
        const currentStatus =  this.state.currentStatus;
        const videoConstraints = { facingMode: 'user'};
        return (
            <>
                {
                    (currentStatus === "DISPLAY_HAND_SIGN" && this.displayHandSignPrompt()) ||
                    (currentStatus === "DISPLAY_RESULT" && this.displayResult()) ||
                    <div/>
                }
                <Webcam className="webcam" videoConstraints={videoConstraints} ref={this.webcamRef}/>
            </>
        );
    }
  }

  export default GameEngine;