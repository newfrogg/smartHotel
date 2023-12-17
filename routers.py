from fastapi import APIRouter, Body
from fastapi.encoders import jsonable_encoder
from enum import Enum
import copy
from fastapi import Query, Path, Body
from pydantic import BaseModel, Field, EmailStr, field_validator, model_validator
from datetime import datetime
from typing import Any, List
import json
from database import (
    add_room,
    delete_room,
    retrieve_room,
    retrieve_rooms,
    update_room,
    retrieve_sensorData_room,
    retrieve_sensorData_ID,
    update_sensorData,
    delete_sensorData,
    add_sensorData,
    retrieve_staff,
    add_currentRoom,
    update_currentRoom,
    delete_currentRoom,
    retrieve_currentRoom_ID,
    retrieve_sensorData_room_top_10,
    retrieve_room_occupied,
    retrieve_room_vacant
)

router = APIRouter()

class roomType(str, Enum):
    low = 'Standard'
    mid = 'Suite'
    high = 'Deluxe'
    
class roomStatus(str, Enum):
    vacant = 'Vacant'
    occupied = 'Occupied'

    
class Room(BaseModel):
    roomNumber: int = Field(...,gt = 100)
    roomType: roomType 
    roomCapacity: int = Field(..., gt = 0, description = 'maximum number of guest')
    roomStatus: roomStatus
    features: list[str] = []
    roomPrice: int = Field(..., gt = 100)

class SensorData(BaseModel):
    roomNumber: int = Field(..., gt = 100)
    temperature: float = Field(..., description = 'C degree')
    moisture: float = Field(..., gt = 0)
    lightStatus: bool
    fanStatus: bool
    time: datetime
    rotorStatus: bool
    lightLevel: float = Field(..., gt = 0, lt = 6)

class SensorData_IoT(BaseModel):
    temperature: float #= Field(..., description = 'C degree')
    moisture: float #= Field(..., gt = 0)
    lightLevel: float #= Field(..., gt = 0, lt = 6)
    lightStatus: bool
    fanStatus: bool
    rotorStatus: bool

class Contact(BaseModel):
    phone: str = Field(..., min_length = 10, max_length = 10)
    email: EmailStr
    password: str = Field(..., min_length = 1)
    
class staff(BaseModel):
    firstName: str = Field(..., min_length = 1)
    lastName: str = Field(..., min_length = 1)
    position: str = Field(..., min_length = 1)
    contact: Contact

class CurrentRoom(BaseModel):
    totalRoom: int = Field(6, gt = 0)
    roomOccupied: int = Field(3, ge = 0)
    roomEmpty: int = Field(3, ge = 0)
    time: datetime
    
    @model_validator(mode = 'before')
    @classmethod
    def room_occupied_must_be_smaller_than_total_room(cls, v: Any)-> Any:
        if isinstance(v, dict):
            if v['roomOccupied']> v['totalRoom']:
                raise ValueError('roomOccupied must be smaller than totalRoom')
        # return {
        #     'roomOccupied': v,
        #     'totalRoom': values['totalRoom']
        # }
        return v
    
    @model_validator(mode = 'before')
    @classmethod
    def room_empty_must_be_smaller_than_total_room(cls, v: Any)->Any:
        if isinstance(v, dict):
            if v['roomEmpty']> v['totalRoom']:
                raise ValueError('roomEmpty must be smaller than totalRoom')
        # return {
        #     'roomEmpty': v,
        #     'totalRoom': values['totalRoom']
        # }
        return v

    @model_validator(mode = 'before')
    def room_occupied_must_be_equal_to_room_empty(cls, v: Any)->Any:
        if isinstance(v, dict):
            if v['roomOccupied']+ v['roomEmpty'] != v['totalRoom']:
                 raise ValueError('roomOccupied + roomEmpty must be equal to totalRoom')
        return v

class CustomEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime):
            return obj.isoformat()  # Serialize datetime as ISO 8601 format
        return json.JSONEncoder.default(self, obj)


@router.post("/room", response_description="room data added into the database")
async def add_room_data(room: Room):
    adjust_room = copy.copy(room)
    adjust_room = jsonable_encoder(adjust_room)
    new_room = await add_room(adjust_room)
    room_occupied = await retrieve_room_occupied()
    room_empty = await retrieve_room_vacant()
    current_room = CurrentRoom(
        totalRoom = room_occupied + room_empty,
        roomOccupied = room_occupied,
        roomEmpty = room_empty,
        time = datetime.now()
        
    )
    current_room = jsonable_encoder(current_room)
    new_currentRoom = await add_currentRoom(current_room)
    if new_room:
        return {
            'status': True,
            'data': new_room
        }
    return False
    # return {'msg': adjust_room}


@router.get("/room", response_description="rooms retrieved")
async def get_rooms():
    rooms = await retrieve_rooms()
    if rooms:
        return {
            'status': True,
            'data': rooms
        }
    return False


@router.get("/room/{roomNumber}", response_description="room data retrieved")
async def get_room_data(roomNumber: int = Path(..., gt = 100, description = 'retrieve room information')):
    room = await retrieve_room(roomNumber)
    if room:
        return {
            'status': True,
            'data': room
        }
    return False


@router.put("/room/{roomNumber}")
async def update_room_data(
    *,
    roomNumber: int = Path(..., gt = 100),
    data : Room, 
    ):
    # req = {k: v for k, v in req.items() if v is not None}
    data = jsonable_encoder(data)
    updated_room = await update_room(roomNumber, data)
    return updated_room


@router.delete("/room/{roomNumber}", response_description="room data deleted from the database")
async def delete_room_data(roomNumber: int = Path(..., gt = 100)):
    room = await retrieve_room(roomNumber)
    deleted_room = await delete_room(roomNumber)
    if room:
        if deleted_room:
            return {
                "room number {} removed".format(roomNumber), "room deleted successfully"
            }
        return {
            "An error occurred", 404, "room number {} doesn't exist".format(roomNumber)
        }
    return {
        'You enter the wrong room roomNumber', 'please try again'
    }
    
############################################
class sensorType(str, Enum):
    light = 'lightStatus'
    fan = 'fanStatus'
    curtain = 'rotorStatus'

@router.post('/control', response_description = 'control sensorData')
async def control_sensor(roomNumber: int, type: sensorType, status: bool):
    sensorData = await retrieve_sensorData_room(roomNumber)
    newest_sensor = sensorData[0]
    # if newest_sensor[type.value]==status:
    #     return {
    #         'message': '{} already {}'.format(type.value, status)
    #     }
    new_sensor = copy.deepcopy(newest_sensor)
    del new_sensor['id']
    new_sensor[type.value] = status
    new_sensor['time'] = datetime.now()
    new_sensorData = await add_sensorData(new_sensor)
    if new_sensorData:
        return {
            'status': True,
            'data': new_sensorData
        }
    return False
    
    
    
@router.post("/sensor", response_description="sensorData data added into the database")
async def add_sensor(sensorData: SensorData):
    # sensorData = json.loads(json.dumps(sensorData, cls=CustomEncoder))
    sensorData = jsonable_encoder(sensorData)
    new_sensorData = await add_sensorData(sensorData)
    if new_sensorData:
        return {
            'status': True,
            'data': new_sensorData
        }
    return False



@router.get("/sensor/{roomNumber}", response_description="sensorData data retrieved")
async def get_sensorData(roomNumber: int):
    sensorData = await retrieve_sensorData_room(roomNumber)
    if sensorData:
        return {
            'status': True,
            'data': sensorData
        }
    return False


@router.put("/sensor/{id}")
async def update_sensorData_data(id: str, data: SensorData):
    data = jsonable_encoder(data)
    updated_sensorData = await update_sensorData(id, data)
    return updated_sensorData


@router.delete("/sensor/{id}", response_description="sensorData data deleted from the database")
async def delete_sensorData_data(id: str):
    sensorData = await retrieve_sensorData_ID(id)
    deleted_sensorData = await delete_sensorData(id)
    if sensorData:
        if deleted_sensorData:
            return {
                "sensorData number {} removed".format(sensorData['id']), "sensorData deleted successfully"
            }
        return {
            "An error occurred", 404, "sensorData number {} doesn't exist".format(sensorData['id'])
        }
    return {
        'You enter the wrong sensorData ID', 'please try again'
    }
    
@router.post('/login/{email}')
async def staff_login(email: EmailStr, password : str = Body(...)):
        data = await retrieve_staff(email, password)
        if data:
            return {
                'status': True,
                'data': data
            }
        return {
            'status': False,
            'data': 'Login Failed'
        }

######### CurrentRoomStatus CRUD

@router.post("/currentRoom", response_description="currentRoom data added into the database")
async def add_currentRoom_data(currentRoom: CurrentRoom):
    currentRoom = jsonable_encoder(currentRoom)
    new_currentRoom = await add_currentRoom(currentRoom)
    if new_currentRoom:
        return {
            'status': True,
            'data': new_currentRoom
        }
    return False


@router.get("/currentRoom", response_description="currentRooms retrieved")
async def get_currentRooms():
    currentRoom = await retrieve_currentRoom_ID()
    if currentRoom:
        return {
            'status': True,
            'data': currentRoom
        }
    return {
        'status': False,
        'msg': 'ID not match!'
    }


# @router.get("/currentRoom/{currentRoomNumber}", response_description="currentRoom data retrieved")
# async def get_currentRoom_data(currentRoomNumber: int = Path(..., gt = 100, description = 'retrieve currentRoom information')):
#     currentRoom = await retrieve_currentRoom(currentRoomNumber)
#     if currentRoom:
#         return {
#             'status': True,
#             'data': currentRoom
#         }
#     return False


@router.put("/currentRoom/{id}")
async def update_currentRoom_data(
    *,
    id: str,
    data : CurrentRoom, 
    ):
    # req = {k: v for k, v in req.items() if v is not None}
    data = jsonable_encoder(data)
    updated_currentRoom = await update_currentRoom(id, data)
    return updated_currentRoom


@router.delete("/currentRoom/{id}", response_description="currentRoom data deleted from the database")
async def delete_currentRoom_data(id: str):
    currentRoom = await retrieve_currentRoom_ID()
    deleted_currentRoom = await delete_currentRoom(id)
    if currentRoom:
        if deleted_currentRoom:
            return {
                "currentRoom number {} removed".format(id), "currentRoom deleted successfully"
            }
        return {
            "An error occurred", 404, "currentRoom number {} doesn't exist".format(id)
        }
    return {
        'You enter the wrong currentRoom id', 'please try again'
    }
    
    
@router.get('/RecentSensorData')
async def get_recent_room_sensor_data():
    # currentRoom = await retrieve_currentRoom_ID()
    # if currentRoom:
    sensorData = await retrieve_sensorData_room_top_10(101)
    if sensorData:
        return [{
            'temp': s['temperature'],
            'humid': s['moisture'],
            'lighting': s['lightLevel'],
        } for s in sensorData]
        
@router.post('/bidirectionalSensorData/{roomNumber}')
async def BDSensorData(
    # *,
    roomNumber: int = Path(...), #=  Path(..., gt = 100),
    # temperature: float, 
    # moisture: float, 
    # lightLevel: float,
    # lightStatus: bool = True,
    # fanStatus: bool = True,
    # rotorStatus: bool = True,
    request: SensorData_IoT = Body(...)
    ):
    # sensorData = {
    #     'roomNumber': roomNumber,
    #     'temperature': temperature,
    #     'moisture': moisture,
    #     'lightStatus': lightStatus,
    #     'rotorStatus': rotorStatus,
    #     'fanStatus': fanStatus,
    #     'lightLevel': lightLevel,
    #     'time': datetime.now(),
    # }
    

    sensorData = await retrieve_sensorData_room_top_10(roomNumber)

    request_sensorData = jsonable_encoder(request)
    request_sensorData["time"] = datetime.now()
    request_sensorData["roomNumber"] = roomNumber
    request_sensorData["lightStatus"] = sensorData[0]['lightStatus']
    request_sensorData["fanStatus"] = sensorData[0]['fanStatus']
    request_sensorData["rotorStatus"] = sensorData[0]['rotorStatus']

    returnRes = {
        'status': True,
        'lightStatus': sensorData[0]['lightStatus'],
        'fanStatus': sensorData[0]['fanStatus'],
        'rotorStatus': sensorData[0]['rotorStatus'],
    }

    new_sensorData = await add_sensorData(request_sensorData)
    if new_sensorData:
        return returnRes
    return False
    
    
    
    