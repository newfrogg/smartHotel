import React from "react";

import Form from 'react-bootstrap/Form';
import Button from "react-bootstrap/esm/Button";

import FeatureCardCreation from "../FeatureCardCreation/FeatureCardCreation";

import addRoom from "../../api/addRoom";

import './RoomCreation.css'
export default function ({ roomDetail, setRoomDetail }) {
    const roomType=["Standard","Suite","Deluxe"];
    const roomStatus = ["Vacant","Occupied"];
    const [formItem,setFormItem]=React.useState({
        "roomNumber": 0,
        "roomType": "Standard",
        "roomCapacity": 0,
        "roomStatus": "Vacant",
        "roomPrice": 0,
        "features": []
    });
    const [newFeature,setNewFeature] = React.useState("");
    return (
        <div className="room">
            <div className="room-display-wrapper">
                <div className="room-display-bar">
                    <div type='button' className="room-back" onClick={() => setRoomDetail(undefined)}>
                        <i className="fa-solid fa-arrow-left"></i> Back
                    </div>
                    <div className="room-number">
                        Room Creation
                    </div>
                    <div className="room-refresh">

                    </div>
                </div>
            </div>
            <div className="room-creation-form">
                <Form onSubmit={async event => {
                    event.preventDefault();
                    await addRoom(formItem);
                    setRoomDetail(undefined);
                }}>
                    <Form.Group className="mb-3" controlId="formRoomNumber">
                        <Form.Label>Room Number</Form.Label>
                        <Form.Control 
                            type="number" 
                            placeholder="Enter new room number" 
                            onChange={event=>{
                                setFormItem(prev=>{
                                    return {
                                        ...prev,
                                        roomNumber: parseInt(event.target.value)
                                    }
                                })
                            }}
                            value = {formItem.roomNumber}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formRoomType">
                        <Form.Label>Room Type</Form.Label>
                        <div className="room-creation-type">
                            {roomType.map(el => (
                                <Form.Check
                                    inline
                                    checked={(formItem.roomType===el)}
                                    key={el}
                                    type="radio"
                                    id={`roomType${el}`}
                                    label={el}
                                    onChange={event => {
                                        if(event.target.checked){
                                            setFormItem(prev=>{
                                                return {
                                                    ...prev,
                                                    roomType: el
                                                }
                                            })
                                        }
                                    }}
                                />
                            ))}
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formRoomCapacity">
                        <Form.Label>Room Capacity</Form.Label>
                        <Form.Control 
                            type="number" 
                            placeholder="Enter room capacity" 
                            onChange={event=>{
                                setFormItem(prev=>{
                                    return {
                                        ...prev,
                                        roomCapacity: parseInt(event.target.value)
                                    }
                                })
                            }}
                            value = {formItem.roomCapacity}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formRoomStatus">
                        <Form.Label>Room Status</Form.Label>
                        <div className="room-creation-status">
                            {roomStatus.map(el => (
                                <Form.Check
                                    inline
                                    checked={(formItem.roomStatus===el)}
                                    key={el}
                                    type="radio"
                                    id={`roomStatus${el}`}
                                    label={el}
                                    onChange={event => {
                                        if(event.target.checked){
                                            setFormItem(prev=>{
                                                return {
                                                    ...prev,
                                                    roomStatus: el
                                                }
                                            })
                                        }
                                    }}
                                />
                            ))}
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formRoomPrice">
                        <Form.Label>Room Price</Form.Label>
                        <Form.Control 
                            type="number" 
                            placeholder="Enter room price" 
                            onChange={event=>{
                                setFormItem(prev=>{
                                    return {
                                        ...prev,
                                        roomPrice: parseInt(event.target.value)
                                    }
                                })
                            }}
                            value = {formItem.roomPrice}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formRoomFeatures">
                        <Form.Label>Room Features</Form.Label>
                        <div className="features-list">
                            {formItem.features.map(el=> <FeatureCardCreation key={el} feature={el} setForm={setFormItem}/>)}
                            <div className="input-wrapper">
                                <input 
                                    type="text" 
                                    className="new-feature" 
                                    onKeyDown={e=>{
                                        if(e.key==="Enter"){
                                            e.preventDefault();
                                            setFormItem(prev=>{
                                                return {
                                                    ...prev,
                                                    features: [...prev.features,newFeature]
                                                }
                                            })
                                            setNewFeature("");
                                        }
                                    }}
                                    onChange={e=>setNewFeature(e.target.value)}
                                    value={newFeature}
                                />
                            </div>
                        </div>
                        
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </div>
        </div>
    )
}