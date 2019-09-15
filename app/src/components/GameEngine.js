import React from 'react';

// Import sign language icons
import A from '../sign_language_icons/A.svg';
import B from '../sign_language_icons/B.svg';
import C from '../sign_language_icons/C.svg';

var classNames = require('classnames');

class GameEngine extends React.Component {

    constructor(props) {
        super(props);
        this.state = {}
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

        this.state.timeoutSet = false;
        
        this.setNewRandomHandSign();
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

    displayHandSignPrompt() {
        if(!this.state.timeoutSet) {
            setTimeout(() => {
                this.getResult();
                this.setState({
                    currentStatus: "DISPLAY_RESULT",
                    timeoutSet: false
                });
            }, 4000);
            this.setState({
                timeoutSet: true
            })
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
            }, 2000);
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
                <h1> Sign with me</h1>
                <a className={classNames({"expandButton": this.state.transitioningToGame, "button": true})} 
                onClick={() => this.transitionToGame()} href="#">
                    <span className={classNames({"hide": this.state.transitioningToGame})}>Start</span>
                </a>
                <div></div>
            </div>
        )
    }


    render() {
      if(this.state.currentStatus === "DISPLAY_MENU") {
        return this.displayMenu();
      } else if(this.state.currentStatus === "DISPLAY_HAND_SIGN") {
        return this.displayHandSignPrompt();
      } else if(this.state.currentStatus === "DISPLAY_RESULT") {
        return this.displayResult();
      } else {
          return <div></div>;
      }
    }
  }

  export default GameEngine;