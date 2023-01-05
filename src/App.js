
import '../src/AppCSS/App.css';
import {BrowserRouter,NavLink,Route, Routes} from "react-router-dom";
import Table from "./AppComponents/Table";
import LiveTable from "./AppComponents/LiveTable";
import '../src/AppCSS/index.css';
import LoginHooks from "./AppComponents/LoginHooks";
import LiveMatchHooks from "./AppComponents/LiveMatchHooks";

function App() {
  const links=[

    {to:"LiveResults", text:"  LIVE MATCHES"},
    {to:"Table", text:"LEAGUE TABLE"},
    {to:"LiveTable", text:"LEAGUE LIVE "},
    {to:"/", text:"LOGIN"}
  ]


  return (

      <div className="App">
        <BrowserRouter>
          <ul>
            {
              links.map((link)=>{
                return(
                    <button className={"Buttons"}>
                      <NavLink to={link.to}>
                        {link.text}
                      </NavLink>
                    </button>
                )
              })
            }
          </ul>

          <Routes>
            <Route exact path={"/"} element ={<LoginHooks/>}/>
            <Route path={"/LiveResults"} element ={<LiveMatchHooks/>}/>
            <Route path={"/LiveTable"} element = {<LiveTable/>}/>
            <Route path={"/Table"}  element={<Table/>}/>

          </Routes>
        </BrowserRouter>


      </div>
  );
}

export default App;