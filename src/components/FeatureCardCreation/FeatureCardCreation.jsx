import React from "react";

import './FeatureCardCreation.css'
export default function FeatureCardCreation({feature,setForm}){
    const [item,setItem]=React.useState(feature);
    return (
        <div className="feature-card-creation-wrapper" type="button">
            <div 
                className="feature-card-creation" 
                onMouseEnter={()=>setItem("X")} 
                onMouseLeave={()=>setItem(feature)}
                onClick={()=>{
                    setForm(prev=>{
                        return{
                            ...prev,
                            features: prev.features.filter(item => item!==feature)
                        }
                    })
                }}
            >
                {item}
            </div>
        </div>
    )
}