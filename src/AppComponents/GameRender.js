
function GameRender(props) {
    const match = props.match;



    return (

        <div>

            <table>

                <tr >
                    <td style={{paddingLeft: "20px"}}>
                        <button onClick={() => {
                            props.addGoal(match.team1Goals + 1, match.team1, match.team2Goals, match.team2)

                        }}>Add goal
                        </button>

                    </td>

                    <td style={{paddingLeft:"10px" , paddingRight:"20px"}}>{match.team1}</td>
                    <td style={{paddingRight:"10px" , paddingLeft:"20px" }}>{match.team2}</td>

                    <td style={{paddingLeft:"20px"}}>
                        <button onClick={() => {
                            props.addGoal(match.team1Goals , match.team1, match.team2Goals+ 1, match.team2)

                        }}>Add goal</button>
                    </td>

                    <td style={{paddingLeft:"40px"}}>
                        <button disabled={ match.team2.selected && match.team1.selected
                        } onClick={() => {
                            props.finish(match.team1,false)
                        }}
                        >Finish</button>
                    </td>

                </tr>


            </table>
        </div>
    )
}

export default GameRender;