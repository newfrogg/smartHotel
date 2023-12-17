import React from "react";

import Login_Comp from "../../components/Login_Comp/Login_Comp";
import Dashboard from "../../components/Dashboard/Dashboard";

export default function Login(){
    return (
        <main className="content">
            <div className="left-side-bar">
                <Login_Comp/>
            </div>
            <div className="right-side-bar">
                <Dashboard/>
            </div>
        </main>
    )
}