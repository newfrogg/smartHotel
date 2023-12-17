import React from "react";

import { VictoryChart, VictoryArea, VictoryTheme, VictoryLegend, VictoryAxis } from 'victory';

import './Chart.css'

export default function Chart({data,label,color,fill}) {
    const domain = {
        "temperature":{
            "label": "Temperature",
            "max":50,
            "min":15
        },
        "moisture":{
            "label": "Moisture",
            "max":60,
            "min":20
        },
        "lightLevel":{
            "label": "Light Level",
            "max":10,
            "min":0
        }
    };
    return (
        <div className="chart">
            <VictoryChart
                theme={VictoryTheme.material}
                height={300}
                padding={40}
                style={{ display: "block" }}
                maxDomain={{y:domain[label].max}}
                minDomain={{y:domain[label].min}}
            >
                <VictoryAxis
                    tickCount={5}
                    dependentAxis
                    style={{
                        axis: {
                            stroke: 'black'  //CHANGE COLOR OF Y-AXIS
                        },
                        tickLabels: {
                            fill: 'black',
                            fontSize: 15, //CHANGE COLOR OF Y-AXIS LABELS
                        },
                        grid: {
                            stroke: 'black', //CHANGE COLOR OF Y-AXIS GRID LINES
                            strokeDasharray: '7',
                        }
                    }}
                />
                <VictoryAxis
                    style={{
                        axis: {
                            stroke: 'black'  //CHANGE COLOR OF Y-AXIS
                        },
                        tickLabels: {
                            fill: 'black',
                            fontSize: 15 //CHANGE COLOR OF Y-AXIS LABELS
                        },
                        grid: {
                            stroke: 'black', //CHANGE COLOR OF Y-AXIS GRID LINES
                            strokeDasharray: '7',
                        }
                    }}
                />
                <VictoryArea
                    interpolation="natural"
                    style={{
                        data: {stroke:color, fill:fill, fillOpacity:0.5, strokeWidth:3},
                        parent: { border: "1px solid #ccc" },
                        label: { fill: "black" }
                    }}
                    data={data}
                    x="time"
                    y={label}
                />
            </VictoryChart>
        </div>
    )
}