import React from 'react';

class GameEngine extends React.Component {
    /*

    */

    constructor(props) {
        super(props);
        this.state = {}
        // POSSIBLE STATUSES: DISPLAYING_HAND_SIGN, DISPLAY_RESULT
        this.state.currentStatus = "DISPLAY_HAND_SIGN"
        this.state.handSignOptions = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L",
                                      "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
        this.state.currentHandSign = "A";
        this.state.result = "CORRECT";

        this.state.timeoutSet = false;
        
        this.setNewRandomHandSign();
    }

    setNewRandomHandSign() {
        this.setState({
            currentHandSign: this.state.handSignOptions[Math.floor(Math.random() * this.state.handSignOptions.length)]
        });
    }

    getResult() {
        this.setState({
            result: "CORRECT"
        });
        return true
    }

    displayHandSignPrompt() {
        if(!this.state.timeoutSet) {
            setTimeout(() => {
                this.getResult();
                this.setState({
                    currentStatus: "DISPLAY_RESULT",
                    timeoutSet: false
                });
            }, 2000);
            this.setState({
                timeoutSet: true
            })
        }
        return (
            <div>
                {this.state.currentHandSign}
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
                <div>
                    You are correct
                </div>
            )
        } else {
            return (
                <div>
                    You are incorrect
                </div>
            )
        }
    }


    render() {
      if(this.state.currentStatus === "DISPLAY_HAND_SIGN") {
        return this.displayHandSignPrompt();
      } else if(this.state.currentStatus === "DISPLAY_RESULT") {
        return this.displayResult();
      } else {
          return <div></div>;
      }
    }
  }

  export default GameEngine;