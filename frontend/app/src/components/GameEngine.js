import React from 'react';
import Webcam from "react-webcam";
import Countdown from 'react-countdown-now';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase';
import Timer from 'react-compound-timer';
import A from '../sign_language_icons/A.svg';
import B from '../sign_language_icons/B.svg';
import C from '../sign_language_icons/C.svg';
const classNames = require('classnames');

const apiUrl = 'https://southcentralus.api.cognitive.microsoft.com/customvision/v3.0/Prediction/90b7006d-2927-4348-86c4-e91a79e154d9/classify/iterations/sign-language-recognition/image';
const predictionKey = '2d4ae585659b490dae3b3a53bf022562';

// Configure Firebase.
const config = require('../config/config.json').firebaseConfig;
firebase.initializeApp(config);

// Configure FirebaseUI.
let uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: 'popup',
  // We will display Google as an auth provider.
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID
  ]
};

class GameEngine extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            signedIn: false
        };
        // POSSIBLE STATUSES: DISPLAY_MENU, DISPLAYING_HAND_SIGN, DISPLAY_RESULT
        this.state.currentStatus = "DISPLAY_MENU"
        // this.state.handSignOptions = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L",
        //                               "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
        
        // target: A B C D E K I    
        this.state.handSignOptions = ["A", "B", "C"];
        this.state.handSignImages = [A, B, C];
        this.state.currentHandSign = "A";
        this.state.currentHandSignImage = A;
        this.state.result = "CORRECT";
        this.state.transitioningToGame = false;

        uiConfig.callbacks = {};
        uiConfig.callbacks.signInSuccess = () => {
          console.log('Signed in');
          this.setState({signedIn: true});
          return true;
        }

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
        var options = [true, false];
        var result = options[Math.floor(Math.random() * 2)];
        if(result) {
            this.setState({
                result: "CORRECT"
            });
        } else {
            this.setState({
                result: "FAILURE"
            });
        }
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
                <div className="time">
                    <Timer 
                        initialTime={4100}
                        direction="backward">
                        <Timer.Seconds />
                    </Timer>
                </div>
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
            }, 1500);
            this.setState({
                timeoutSet: true
            })
        }
        if(this.state.result === "CORRECT") {
            return (
                <div className="result result-success">
                    <h1>You got it! </h1>
                    <img src={this.state.currentHandSignImage} />
                </div>
            )
        } else {
            return (
                <div className="result result-failure">
                    <h1>Wrong</h1>
                    <img src={this.state.currentHandSignImage} />
                </div>
            )
        }
    }

    transitionToGame() {
        this.setState({
            transitioningToGame: true
        });
        setTimeout(() => {
            this.setNewRandomHandSign();
            this.setState({
                currentStatus: "DISPLAY_HAND_SIGN",
                timeoutSet: false
            });
        }, 700);
        this.setState({
            timeoutSet: true
        })
    }

    displayMenu() {
        return (
            <div className="menu">
                <h1>Sign Together</h1>
                {
                    !this.state.signedIn ? 
                        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()}/>
                    :
                    <a className={classNames({"expandButton": this.state.transitioningToGame, "button": true})} 
                    onClick={() => this.transitionToGame()} href="#">
                        <span className={classNames({"hide": this.state.transitioningToGame})}>Start</span>
                    </a>
                }
                <div></div>
            </div>
        )
    }


    render() {
        const currentStatus =  this.state.currentStatus;
        const videoConstraints = { facingMode: 'user'};
        return (
            <>
                {
                    (currentStatus === "DISPLAY_HAND_SIGN" && this.displayHandSignPrompt()) ||
                    (currentStatus === "DISPLAY_RESULT" && this.displayResult()) ||
                    (currentStatus === "DISPLAY_MENU" && this.displayMenu()) ||
                    <div/>
                }
                <Webcam className="webcam" videoConstraints={videoConstraints} ref={this.webcamRef}/>
            </>
        );
    }
  }

  export default GameEngine;