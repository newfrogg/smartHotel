import React from "react";

import ButtonList from "../../components/ButtonList/ButtonList";
import MainMenu from "../../components/MainMenu/MainMenu";

export default function Menu({context}){
    const [state,setState] = React.useState(0)
    return (
        <main className="content">
            <div className="left-side-bar">
                <ButtonList state={state} setState={setState}/>
            </div>
            <div className="right-side-bar">
                <MainMenu state={state} setState={setState}/>
            </div>
        </main>
    )
}