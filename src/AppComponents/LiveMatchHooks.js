import React from 'react';
import {useEffect, useState} from "react";
import {sendApiGetRequest} from "./Response";

const LiveMatchHooks = () => {
    const [liveGames, setLiveGames] = useState([]);

    useEffect( ()=>{
        sendApiGetRequest("http://localhost:8989/get-live-games" , (response)=>{
            setLiveGames(response.data)
        })
    })

    const  colorTeam1 = (game) => {
        let colorStyle = "";
        if (game.team1Goals > game.team2Goals) {
            colorStyle = "green";
        } else
            colorStyle = "red";

        if (game.team1Goals === game.team2Goals)
            colorStyle = "#f5d12e";
        return colorStyle;

    };
    const  colorTeam2 = (game) => {
        let colorStyle = "";

        if (game.team2Goals > game.team1Goals) {
            colorStyle = "green";
        } else {
            colorStyle = "red";
        }

        if (game.team1Goals === game.team2Goals)
            colorStyle = "#f5d12e";

        return colorStyle;

    };
    const  renderLiveMatches = () => {
        return (
            <div>
                <table>
                    <tr >
                        <th>HOME</th>
                        <th>T1G</th>
                        <th>T2G</th>
                        <th>AWAY</th>
                    </tr>

                    {
                        liveGames.map((game) => {
                            return (
                                <tr className={"wpos"}>

                                    <td style={{color: colorTeam1(game)}}>{game.team1}</td>
                                    <td style={{color: colorTeam1(game)}}>{game.team1Goals}</td>


                                    <td style={{color: colorTeam2(game)}}>{game.team2Goals}</td>
                                    <td style={{color: colorTeam2(game)}}>{game.team2}</td>
                                </tr>
                            );
                        })
                    }
                </table>

            </div>
        )

    };
    const  renderNoMatches = () => {
        return (
            <div>
                <div className="content">
                    <h2 style={{marginRight:"500px",marginTop:"-70px"}}>NO LIVE GAMES</h2>
                </div>

            </div>
        );

    };

    return (
        <div className={ "liveMatches"}>
            {
                liveGames.length>0 ?
                    renderLiveMatches() : renderNoMatches()
            }

        </div>
    );
};

export default LiveMatchHooks;