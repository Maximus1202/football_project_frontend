import {useEffect, useState} from "react";
import axios from "axios";
import GameRender from "./GameRender";
import {sendApiGetRequest, sendApiPostRequest} from "./Response";
function LoginHooks(){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [userSignIn, setUserSignIn] = useState(false);
    const [clubs, setClubs] = useState([]);
    const [option1, setOption1] = useState ("");
    const [option2, setOption2] = useState ("");
    const [liveMatches, setLiveMatches] = useState ([]);
    const [saveButton, setSaveButton] = useState(false);
    const [isGoalsChange, setIsGoalsChange] = useState(false);

    const addGoals = (goalsA, team1,goalsB, team2)=> {
        let array = liveMatches
        array.map(team => {
            if (team.team1 === team1) {
                team.team1Goals
                    += 1;
                setIsGoalsChange(true);
                sendApiPostRequest("http://localhost:8989/update-goals", {
                    team1: team1,
                    team1Goals: goalsA,
                    team2: team2,
                    team2Goals: goalsB
                }, (response) => {
                    if (response.data) {
                        alert("goal Added!");
                    }
                })

            } else if (team.team2 === team2) {
                team.team2Goals
                    += 1
                setIsGoalsChange(true);
                sendApiPostRequest("http://localhost:8989/update-goals", {
                    team1: team1,
                    team1Goals: goalsA,
                    team2: team2,
                    team2Goals: goalsB
                }, (response) => {
                    if (response.data) {
                        alert("goal Added!");
                    }
                })

            }
        })
    }


    const onSignIn = () => {
        axios.post("http://localhost:8989/sign-in",null,{
            params:{
                username: username,
                password: password,

            }
        }).then((res=>{
            if (res.data.errorCode==null){
                setUserSignIn(true);
                alert("sign-in successfully!");
            }else {
                alert(res.data.errorCode);
                // setResponseByCodeError(res.data.errorCode);
            }
        }));
    }
    useEffect(()=>{
        axios.get("http://localhost:8989/get-groups").then(res =>{
            setClubs(res.data)
        })
    },[])
    useEffect ( ()=>{
        axios.get("http://localhost:8989/get-live-games").then(res => {
            setLiveMatches(res.data)
        })
    },[liveMatches])
    const saveMatch = () => {
        sendApiPostRequest("http://localhost:8989/save-match", {
            team1: option1,
            team2: option2,
            isLive: true,
        }, (response) => {
            if (response.data.success) {
                setSaveButton(true)
                alert("Game saved!");
            }
        });
        sendApiGetRequest("http://localhost:8989/get-live-games" , (res)=>{
            setLiveMatches(res.data);
        })
    }
    const finishMatch = (team1,isAlive) =>{
        sendApiPostRequest("http://localhost:8989/finish-match",
            {
                team1: team1,
                isLive: isAlive,
            }, (response) => {
                if (response.data.isLive === false) {
                    alert("match finished");
                }
            });
    }
    let updateTeamsNotPlaying = () => {
        const teamsNotPlaying = clubs;  // will check/
        return teamsNotPlaying.filter(filterByLiveMatches);
    }
    let filterByLiveMatches = (team) => {
        const liveMatchesToFilter = liveMatches;
        let notPlaying = true;
        liveMatchesToFilter.forEach ((live) => {
            if(team.name === live.team1 || team.name === live.team2){
                notPlaying = false;
            }
        });
        return notPlaying;
    }
    useEffect(()=> {

    },[isGoalsChange])
    return(
        <div>

            {
                !userSignIn ?
                    <div className={"login"}>

                        <input type="text" placeholder={"Enter your username"} value={username} onChange={ (e)=> setUsername(e.target.value)}/> <br/>
                        <input type="password" placeholder={"Enter your password"} value={password} onChange={ (e)=> setPassword(e.target.value)}/> <br/>
                        <button type="login" onClick={onSignIn}>Login</button>

                    </div>
                    :
                    <div>
                        <div id={"selection"}>
                            <div id={"group1"} style={{fontWeight: "bold"}}>
                                Group1 <br/>
                                <select id={"option1"} onChange={e =>  setOption1(e.target.value)} value={option1}>
                                    <option value="">please select a group</option>
                                    {
                                        updateTeamsNotPlaying().map((team, i) => {
                                            let disabled = team.name===option2;
                                            return (
                                                <option  value={team.name} disabled={disabled}>{team.name}</option>
                                            )
                                        })
                                    }
                                </select>


                            </div>

                            <div id={"group2"} style={{fontWeight: "bold"}}>
                                Group2 <br/>
                                <select id={"option2"} onChange={e => setOption2(e.target.value)} value={option2}>

                                    <option  value="">please select a group</option>
                                    {
                                        updateTeamsNotPlaying().map((team, i) => {
                                            let disabled = team.name===option1;
                                            return (
                                                <option value={team.name} disabled={disabled}>{team.name}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                            <button id={"saveButton"} onClick={saveMatch} disabled={option1==="" || option2===""}>save</button>
                        </div>
                        <div>
                            {
                                saveButton &&

                                liveMatches.map((match) => {
                                    return(
                                        <div className={"renderLiveGames"}>
                                            <GameRender match ={match} addGoal={addGoals}
                                                        finish = {finishMatch}/>
                                        </div>
                                    )

                                })
                            }
                        </div>

                    </div>
            }

        </div>
    )
}
export default LoginHooks;