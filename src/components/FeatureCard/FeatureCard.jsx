import React from "react";

import './FeatureCard.css'
export default function FeatureCard({detail}){
    return (
        <div className="feature-wrapper">
            <div className="feature">
                {detail}
            </div>
        </div>
    )
}