import React from "react";

import "./ButtonList.css"

export default function ButtonList({ state, setState }) {
    return (
        <div className="button_wrapper">
            <div className="buttons">
                <div className="button-block">
                    <div type="button" onClick={() => setState(0)}>
                        <i className="fa-solid fa-house"></i> Room
                    </div>
                </div>
            </div>
        </div>
    )
}