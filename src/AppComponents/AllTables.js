import React, {useEffect, useState} from "react";
import '../AppCSS/AllTables.css'



function AllTables(props) {

    const [table, setTable] = useState([
        {id: 0, club: "", Points: 0, Won: 0, Drawn: 0, Lost: 0, GF: 0, GA: 0, GD: 0},
        {id: 0, club: "", Points: 0, Won: 0, Drawn: 0, Lost: 0, GF: 0, GA: 0, GD: 0},
        {id: 0, club: "", Points: 0, Won: 0, Drawn: 0, Lost: 0, GF: 0, GA: 0, GD: 0},
        {id: 0, club: "", Points: 0, Won: 0, Drawn: 0, Lost: 0, GF: 0, GA: 0, GD: 0},
        {id: 0, club: "", Points: 0, Won: 0, Drawn: 0, Lost: 0, GF: 0, GA: 0, GD: 0},
        {id: 0, club: "", Points: 0, Won: 0, Drawn: 0, Lost: 0, GF: 0, GA: 0, GD: 0},
        {id: 0, club: "", Points: 0, Won: 0, Drawn: 0, Lost: 0, GF: 0, GA: 0, GD: 0},
        {id: 0, club: "", Points: 0, Won: 0, Drawn: 0, Lost: 0, GF: 0, GA: 0, GD: 0},
        {id: 0, club: "", Points: 0, Won: 0, Drawn: 0, Lost: 0, GF: 0, GA: 0, GD: 0},
        {id: 0, club: "", Points: 0, Won: 0, Drawn: 0, Lost: 0, GF: 0, GA: 0, GD: 0},
        {id: 0, club: "", Points: 0, Won: 0, Drawn: 0, Lost: 0, GF: 0, GA: 0, GD: 0},
        {id: 0, club: "", Points: 0, Won: 0, Drawn: 0, Lost: 0, GF: 0, GA: 0, GD: 0}]
    )

    const updateTable = () => {
        let updateTable = table;
        updateTable.map((currentClub , i)=>{
            currentClub.club = props.league[i].name;
            currentClub.id =  props.league[i].id;
        })
        setTable(updateTable);
    }


    useEffect(()=>{
        let updateTable = table;
        updateTable.map((currentClub , i)=>{
            currentClub.club = props.league[i].name;
            currentClub.id =  props.league[i].id;
        })
        setTable(updateTable);
        calc(props.games);
    },[props.games])

    const  calc = (gamesList) => {
        updateTable();
        table.map(i=>{
            i.Points=0;
            i.GD=0;
            i.GA=0;
            i.Drawn=0;
            i.Won=0;
            i.Lost=0;
            i.GF=0;
        })

        let tableTemp = table;
        gamesList.forEach(game => {
            let team1Index = tableTemp.findIndex(league => league.club === game.team1);
            let team2Index = tableTemp.findIndex(league => league.club === game.team2);
            //add goals gf

            tableTemp[team1Index].GF += game.team1Goals;
            tableTemp[team2Index].GF += game.team2Goals;

            //add goals Against
            tableTemp[team1Index].GA += game.team2Goals;
            tableTemp[team2Index].GA += game.team1Goals;
            //calc diffG
            tableTemp[team1Index].GD += game.team1Goals - game.team2Goals;
            tableTemp[team2Index].GD += game.team2Goals - game.team1Goals;
            //
            if (game.team1Goals > game.team2Goals) {
                tableTemp[team1Index].Won += 1;
                tableTemp[team2Index].Lost++;
                tableTemp[team1Index].Points += 3;
            } else if (game.team1Goals < game.team2Goals) {
                tableTemp[team2Index].Won += 1;
                tableTemp[team1Index].Lost++;
                tableTemp[team2Index].Points += 3;
            } else {
                tableTemp[team1Index].Drawn += 1;
                tableTemp[team2Index].Drawn += 1;
                tableTemp[team1Index].Points += 1;
                tableTemp[team2Index].Points += 1;
            }
        });
        setTable(sort(tableTemp))
    };

    const sort = (leagueTable) => {
        leagueTable.sort((team1, team2) => {
                if (team1.Points > team2.Points)
                    return -1;
                if (team1.Points < team2.Points)
                    return 1;
                if (team1.GD > team2.GD)
                    return -1;
                if (team1.GD < team2.GD)
                    return 1;


                if (team1.club.toUpperCase() < team2.club.toUpperCase())
                    return -1;
                if (team1.club.toUpperCase() > team2.club.toUpperCase())
                    return 1;

                return 0;
            }
        );

        return leagueTable;
    }


    return (
        <div className={"tables"}>

            <table>
                <tr className={"col"}>
                    <th scope={"coll"}>#</th>
                    <th className={"left"} >TEAM</th>
                    <th scope={"coll"}>PTS</th>
                    <th scope={"coll"}>W</th>
                    <th scope={"coll"}>D</th>
                    <th scope={"coll"}>L</th>
                    <th scope={"coll"}> GF</th>
                    <th scope={"coll"}>GA</th>
                    <th scope={"coll"}>GD</th>

                </tr>

                {

                    table.map((team,i) => {
                        return (
                            <tr className={"wpos"}>
                                <td>{i+1}</td>
                                <td className={"left"} scope={"row"}>{team.club}</td>
                                <td>{team.Points}</td>
                                <td>{team.Won}</td>
                                <td>{team.Drawn}</td>
                                <td>{team.Lost}</td>
                                <td>{team.GF}</td>
                                <td> {team.GA}</td>
                                <td>{team.GD}</td>
                                <td>{team.position}</td>
                            </tr>
                        );


                    })
                }
            </table>


        </div>
    );








}

export default AllTables;