import React from 'react';
import Webcam from "react-webcam";
import Countdown from 'react-countdown-now';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase';
import logo from '../logo.png';
import Timer from 'react-compound-timer';
import A from '../sign_language_icons/A.svg';
import B from '../sign_language_icons/B.svg';
import C from '../sign_language_icons/C.svg';
import getSign from '../sign-recognition/uploadImage.js';
 
const classNames = require('classnames');

const apiUrl = 'https://southcentralus.api.cognitive.microsoft.com/customvision/v3.0/Prediction/90b7006d-2927-4348-86c4-e91a79e154d9/classify/iterations/sign-language-recognition/image';
const predictionKey = '2d4ae585659b490dae3b3a53bf022562';

// Configure Firebase.
//const config = require('../config/config.json').firebaseConfig;
firebase.initializeApp({
	    "apiKey": "AIzaSyCbHFUeb2ZLUmKEDq3yitz3rRvyrjgamOo",
	    "authDomain": "hackthenorth2019-324cc.firebaseapp.com",
	    "databaseURL": "https://hackthenorth2019-324cc.firebaseio.com",
	    "projectId": "hackthenorth2019-324cc",
	    "storageBucket": "hackthenorth2019-324cc.appspot.com",
	    "messagingSenderId": "236796623294",
	    "appId": "1:236796623294:web:ac2ec0646bd3b5b1e8e1ef"
});

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
        console.log('test')
        console.log(this);
        this.state.handSignOptions = ["A", "B", "C"];
        this.state.handSignImages = [A, B, C];
        this.state.currentHandSign = "A";
        this.state.currentHandSignImage = A;
        this.state.result = "CORRECT";
        this.state.transitioningToGame = false;

        uiConfig.callbacks = {};
        uiConfig.callbacks.signInSuccessWithAuthResult = () => {
          console.log('Signed in');
          this.setState({signedIn: true, uid: firebase.auth().currentUser.uid, displayName: firebase.auth().currentUser.displayName});
          return true;
        }

        this.state.timeoutSet = false;

        this.state.numCorrect = 0;
        this.state.numSeen = 0;
        this.state.showScore = false;

        this.state.maxSignsToShow = 5;
        
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
        let response;
        this.captureAndCheckImage()
            .then((response) => {
                var result = (response == this.state.currentHandSign)
                console.log("result: " + result);
                console.log(response);
                if(result) {
                    this.setState({
                        result: "CORRECT",
                        numCorrect: this.state.numCorrect + 1,
                        numSeen: this.state.numSeen + 1
                    });
                } else {
                    this.setState({
                        result: "FAILURE",
                        numSeen: this.state.numSeen + 1
                    });
                }
            }).catch((err) => console.log(err));
    }
    
    captureAndCheckImage() {
        const imageBase64 = this.webcamRef.current.getScreenshot();
        return getSign(firebase.storage().ref(), this.state.uid, imageBase64);
        // return fetch(imageBase64)
        // .then(res => res.blob())
        // .then(blob => getSign(blob))
         // image is now an image
    }

    displayHandSignPrompt() {
        if(!this.state.timeoutSet) {
            setTimeout(() => {
                this.getResult();
            }, 2000);
            setTimeout(() => {
                this.setState({
                    currentStatus: "DISPLAY_RESULT",
                    timeoutSet: false
                });
            }, 4000);
            this.setState({
                timeoutSet: true
            });
        }
        return (
            <div className="handSignPrompt">
                <img className="logo" src={logo}></img>
                <div className="score">{this.state.numCorrect}/{this.state.numSeen}</div>
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
                if(this.state.numSeen < this.state.maxSignsToShow) {
                    this.setNewRandomHandSign();
                    this.setState({
                        currentStatus: "DISPLAY_HAND_SIGN",
                        timeoutSet: false
                    });
                } else {
                    this.restartGame();
                }
            }, 1500);
            this.setState({
                timeoutSet: true
            })
        }
        if(this.state.result === "CORRECT") {
            return (
                <div className="result result-success">
                    <img className="logo" src={logo}></img>
                    <div className="score">{this.state.numCorrect}/{this.state.numSeen}</div>
                    <h1>You got it! </h1>
                    <img src={this.state.currentHandSignImage} />
                </div>
            )
        } else {
            return (
                <div className="result result-failure">
                    <img className="logo" src={logo}></img>
                    <div className="score">{this.state.numCorrect}/{this.state.numSeen}</div>
                    <h1>Wrong</h1>
                    <img src={this.state.currentHandSignImage} />
                </div>
            )
        }
    }

    transitionToGame() {
        this.setState({
            transitioningToGame: true,
        });
        setTimeout(() => {
            this.setNewRandomHandSign();
            this.setState({
                currentStatus: "DISPLAY_HAND_SIGN",
                timeoutSet: false,
                numSeen: 0,
                numCorrect: 0,
                transitioningToGame: false
            });
        }, 700);
        this.setState({
            timeoutSet: true
        })
    }

    restartGame() {
        this.setState({
            transitioningToGame: false,
            currentStatus: "DISPLAY_MENU",
            showScore: true,
        });
    }

    displayMenu() {
        var headerText = "Sign Together";
        var buttonText = "Start"
        if(this.state.showScore) {
            headerText = "Your got " + this.state.numCorrect + "/" + this.state.numSeen + " correct";
            buttonText = "Play again";
        }
        return (
            <div className="menu">

                <img className={classNames({"dimLogo": this.state.transitioningToGame, "logo": true})} 
                    src={logo}/>
                <div className="score">{this.state.numCorrect}/{this.state.numSeen}</div>
                <h1>{headerText}</h1>
                {
                    !true ? 
                        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()}/>
                    :
                    <a className={classNames({"expandButton": this.state.transitioningToGame, "button": true})} 
                    onClick={() => this.transitionToGame()} href="#">
                        <span className={classNames({"hide": this.state.transitioningToGame})}>{buttonText}</span>
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
                <Webcam className="webcam" screenshotFormat="image/png" videoConstraints={videoConstraints} ref={this.webcamRef}/>
            </>
        );
    }
  }








  

  export default GameEngine;