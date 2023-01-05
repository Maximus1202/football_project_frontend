import {sendApiGetRequest, sendApiPostRequest} from "./Response";

import React from "react";
import GameRender from "./GameRender";

class Login extends  React.Component {
    state= {
        username: "",
        password: "",
        responseFromGetRequest: "",
        responseFromPostRequest: "",
        errorMessage: "",
        userExist: false,
        clubs: [],
        renderOption: false,
        option1: "",
        option2: "",
        groupOneGoals: 0,
        groupTwoGoals: 0,
        isClicked: false,
        liveMatches: [],
        defaultOption: "select club"
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.state !== prevState.state) {
            this.renderSelectTeams()
            this.updateTeamsNotPlaying();
            this.renderLiveGamesForEdit()
            this.updateClicked();
        }


    }

    addUserName = (e) => {
        this.setState({
            username: e.target.value
        })
    }
    addUserPassword = (e) => {
        this.setState({
            password: e.target.value
        })
        console.log(this.state)

    }
    finishMatch = (team1,isAlive) =>{
        sendApiPostRequest("http://localhost:8989/finish-match",
            {
                team1: team1,
                isLive: isAlive,
            }, (response) => {
                if (response.data.isLive === false) {
                    alert("match finished");
                }
            });
        // rest goals:


    }
    componentDidMount() {
        sendApiGetRequest("http://localhost:8989/get-groups" , (res)=>{
            this.setState({
                clubs: res.data,
            })
        })
    };
    signInRequest=()=> {
        sendApiPostRequest("http://localhost:8989/sign-in", {
            username:this.state.username,
            password:this.state.password
        }, (response) => {
            if (response.data.success) {
                this.setState({
                    username: response.data.user.username,
                    userExist: true,
                    renderOption: true
                })
                alert("sign in successfully!");

            } else {
                if (response.data.errorCode === 1) {
                    this.setState({
                        errorMessage: "No Such User"
                    })
                } else if (response.data.errorCode === 2) {
                    this.setState({
                        errorMessage: "Password Incorrect"
                    })

                }
            }

        })
        if(this.state.errorMessage !== ""){
            alert(this.state.errorMessage)
        }
    }
    login = () => {
        return (
            <div>
                <div className={"login"}>
                    <input type="text" value={this.state.username} onChange={this.addUserName}
                           placeholder={"username"}/>
                    <br/>
                    <input type="password" value={this.state.password} onChange={this.addUserPassword}
                           placeholder={"password"}/>
                    <br/>
                </div>
                <button type="login" onClick={this.signInRequest} disabled={this.state.userExist}>Login</button>

            </div>

        )
    }
    selectedGroup1 = () => {
        let option1 = document.getElementById("option1");
        let text1 = option1.options[option1.selectedIndex].text;
        this.setState({
            option1: text1,
        })
    }
    selectedGroup2 = () => {
        let option2 = document.getElementById("option2");
        let text2 = option2.options[option2.selectedIndex].text;

        this.setState({
            option2: text2
        })
    }
    addScoredGoals = (goalsA, team1) =>  {
        let array=[...this.state.liveMatches]
        array.map(team=>{
            if (team.team1===team1){
                debugger
                team.team1Goals
                    +=1;
            }
        })
        this.setState({
            liveMatches:array
        })

        sendApiPostRequest("http://localhost:8989/update-team1-goals", {
            team1: team1,
            team1Goals: goalsA
        }, (response) => {
            if (response.data) {
                alert("goal Added!");
            }
        })
    }

    addGoalsGroupTwo = (goalsB,team2) => {
        let array=[...this.state.liveMatches]
        array.map(team=>{
            if (team.team2===team2){
                debugger
                team.team2Goals
                    +=1;
            }
        })
        this.setState({
            liveMatches:array
        })
        sendApiPostRequest("http://localhost:8989/update-team2-goals", {
            team2: team2,
            team2Goals: goalsB
        }, (response) => {

            if (response.data) {
                alert("goal Added!");
            }
        })
    }

    saveMatch = () => {
        sendApiPostRequest("http://localhost:8989/save-match", {
            team1: this.state.option1,
            team2: this.state.option2,
            isLive: true,
        }, (response) => {
            if (response.data.success) {
                this.setState({
                    isClicked: true
                })
                alert("Game saved!");
            }
        });
        sendApiGetRequest("http://localhost:8989/get-live-games" , (res)=>{
            this.setState({
                liveMatches: res.data,
            })
        })
        return  this.updateTeamsNotPlaying();
    }

    filterByLiveMatches = (club)=>{
        const liveMatches = this.state.liveMatches;
        let notPlaying = true;
        liveMatches.forEach((live) => {
            if (club.name === live.team1 || club.name === live.team2) {
                notPlaying = false;
            }
        });
        return notPlaying;

    }

    updateTeamsNotPlaying = ()=>{
        const teamsNotPlating = this.state.clubs;
        return teamsNotPlating.filter(this.filterByLiveMatches);
    }

    updateClicked =()=>{
        this.setState({
            isClicked: true,

        })
    }

    getData = () => {
        sendApiGetRequest("http://localhost:8989/get-live-games" , (response)=>{
            this.setState({
                liveMatches:response.data
            })
        })

    }

    renderLiveGamesForEdit = ()=>{
        setInterval(this.getData,5000);
        return (
            <div>
                {
                    this.state.isClicked ?
                        <div>
                            {
                                this.state.liveMatches.map((match) => {
                                    return (
                                        <div className={"league-table"}>
                                            <GameRender match={match} addGoals1={this.addScoredGoals}
                                                        addGoals2={this.addGoalsGroupTwo}
                                                        finish={this.finishMatch}/>
                                        </div>
                                    )
                                })
                            }

                        </div>
                        : ""
                }

            </div>
        )


    }
    renderSelectTeams = () => {
        return (
            <div>
                {
                    this.state.renderOption ?
                        <div>
                            <div className={"group1"}>
                                Group 1
                                <br/>
                                <select id={"option1"} onChange={this.selectedGroup1}>
                                    <option value="">-Please choose a group-</option>
                                    {
                                        this.updateTeamsNotPlaying().map((team, i) => {
                                            let disabled = team.name === this.state.option2;
                                            return (
                                                <option value={i} disabled={disabled}>{team.name}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                            <div className={"group2"}>

                                Group 2
                                <br/>
                                <select id={"option2"} onChange={this.selectedGroup2}>
                                    <option value="">-Please choose a group-</option>
                                    {
                                        this.updateTeamsNotPlaying().map((team, i) => {
                                            let disabled = team.name === this.state.option1
                                            return (
                                                <option value={i} disabled={disabled}>{team.name}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                            <button id={"saveButton"} onClick={this.saveMatch}
                                    disabled={this.state.groupOneGoals !== 0 || this.state.groupTwoGoals !== 0}>save
                            </button>
                            {
                                this.renderLiveGamesForEdit()
                            }
                            <br/>
                            {/*<button onClick={this.finishMatch}*/}
                            {/*    // end match = rest the goals and the selects options*/}
                            {/*        disabled={this.state.option1.selected && this.state.option2.selected}>End Game*/}
                            {/*</button>*/}

                        </div>
                        : this.login()

                }


            </div>
        );

    }

    render(){
        {
            return (
                this.renderSelectTeams()
            );
        }
    }
}

export default Login;