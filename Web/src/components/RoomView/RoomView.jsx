import React from "react";

import './RoomView.css'

import FeatureCard from "../FeatureCard/FeatureCard";
import StatusCard from "../StatusCard/StatusCard";
import ControlCard from "../ControlCard/ControlCard";
import DetailCard from "../DetailCard/DetailCard";
import NotificationCard from "../NotificationCard/NotificationCard";
import Chart from "../Chart/Chart";

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import { formatSensorList } from "../../api/sensorList";
import delRoom from "../../api/deleteRoom";

export default function RoomView({ roomDetail, setRoomDetail }) {
    const [show, setShow] = React.useState(false);

    const detailKey = ["roomType", "roomPrice", "roomCapacity", "roomStatus"]
    const statusKey = ["temperature", "moisture", "lightLevel"]
    const controlKey = ["lightStatus", "fanStatus", "rotorStatus"]
    const chartKey = [
        {
            key: "temperature",
            color: "#a80000",
            fill: "#ff0000"
        },
        {
            key: "moisture",
            color: "rgb(0, 156, 156)",
            fill: "rgb(0, 218, 218)"
        },
        {
            key: "lightLevel",
            color: "rgb(184, 110, 0)",
            fill: "rgb(202, 202, 0)"
        },
    ]
    const [sensorDataList, setSensorDataList] = React.useState([]);
    React.useEffect(() => {
        const intervalId = setInterval(()=>{
            formatSensorList(roomDetail.roomNumber).then(
                setSensorDataList
            )
        },1000)
        
        return () => clearInterval(intervalId)
        //setSensorDataList(sensor.filter(el => (el.roomNumber == Number(roomDetail.roomNumber))));
    }, [])
    
    console.log(sensorDataList)
    return (
        <div className="room">
            <Modal show={show} onHide={() => {
                setShow(false);
            }}>
                <Modal.Header closeButton>
                    <Modal.Title>Deleting Room {roomDetail.roomNumber}</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this room?</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={async () => {
                        await delRoom(roomDetail.roomNumber);
                        setShow(false);
                        setRoomDetail(undefined);
                    }}>
                        Yes
                    </Button>
                    <Button variant="secondary" onClick={() => {
                        setShow(false);
                    }}>
                        No
                    </Button>
                </Modal.Footer>
            </Modal>
            <div className="room-display-wrapper">
                <div className="room-display-bar">
                    <div type='button' className="room-back" onClick={() => setRoomDetail(undefined)}>
                        <i className="fa-solid fa-arrow-left"></i> Back
                    </div>
                    <div className="room-number">
                        Room {roomDetail.roomNumber}
                    </div>
                    <div type='button' className="room-refresh">
                        Refresh <i className="fa-solid fa-arrows-rotate"></i>
                    </div>
                </div>
            </div>
            <div className="delete-btn">
                <Button
                    variant="danger"
                    onClick={async () => {
                        setShow(true);
                    }}
                >Delete</Button>
            </div>
            <div className="room-sensor-data">
                <div className="room-info room-line">
                    <div className="room-title">Room Information</div>
                    <hr />
                    <div className="detail-list listing">
                        {detailKey.map(el => (
                            <DetailCard keyStatus={el} valueStatus={roomDetail[el]} />
                        ))}
                    </div>
                    <div className="feature-list">
                        {roomDetail.features.map(el => (
                            <div className="room-feature">
                                {<FeatureCard detail={el} />}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="room-sensor-status room-line">
                    <div className="room-title">Status</div>
                    <hr />
                    <div className="status-list listing">
                        {(sensorDataList.length !== 0 && sensorDataList[0].temperature !== undefined)
                            && statusKey.map(key => {
                                return (
                                    <StatusCard valueStatus={sensorDataList[sensorDataList.length - 1][key]} keyStatus={key} />
                                )
                            }
                            )}
                    </div>
                    <div className="status-chart">
                        {(sensorDataList.length !== 0 && sensorDataList[0].temperature !== undefined)
                            &&
                            chartKey.map(el => {
                                return <Chart data={sensorDataList} label={el.key} color={el.color} fill={el.fill} />
                            })
                        }
                    </div>
                </div>
                <div className="room-sensor-control room-line">
                    <div className="room-title">Control</div>
                    <hr />
                    <div className="control-list listing">
                        {(sensorDataList.length !== 0 && sensorDataList[0].fanStatus !== undefined)
                            && controlKey.map(key => {
                                return (
                                    <ControlCard
                                        valueStatus={sensorDataList[sensorDataList.length - 1][key]}
                                        keyStatus={key}
                                        room={roomDetail.roomNumber}
                                        setSensorDataList={setSensorDataList}
                                    />
                                )
                            }
                            )}
                        <NotificationCard />
                    </div>
                </div>
            </div>
        </div>
    )
}

