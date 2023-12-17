import setting
import motor.motor_asyncio
from typing import List, Dict
from bson.objectid import ObjectId
from decouple import config
from pymongo import MongoClient
from fastapi.encoders import jsonable_encoder
MONGO_DETAILS = config("MONGO_DETAILS")
client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)
import pymongo
from datetime import datetime, timedelta
from pydantic import EmailStr
database = client.hotel

room_collection = database.get_collection("room")
# room_collection.create_index([('roomNumber', pymongo.ASCENDING)], unique = True, background = True)
# room_collection.drop_index('roomNumber')
sensorData_collection = database.get_collection("sensorData")
staff_collection = database.get_collection('staff')
currentRoom_collection = database.get_collection('currectRoomStatus')
#helper

def room_helper(room)-> dict:
    return {
        'id': str(room['_id']),
        'roomNumber': room['roomNumber'],
        'roomType': room['roomType'],
        'roomCapacity': room['roomCapacity'],
        'roomStatus': room['roomStatus'],
        'features': room['features'],
        'roomPrice': room['roomPrice'],
         
    }

def sensorData_helper(sensorData)->dict:
    return {
        'id': str(sensorData['_id']),
        'roomNumber': sensorData['roomNumber'],
        'temperature': sensorData['temperature'],
        'moisture': sensorData['moisture'],
        'lightStatus': sensorData['lightStatus'],
        'rotorStatus': sensorData['rotorStatus'],
        'fanStatus': sensorData['fanStatus'],
        'lightLevel': sensorData['lightLevel'],
        'time': sensorData['time']

    }

def staff_helper(staff)-> dict:
    return{
        'id': str(staff['_id']),
        'firstName': staff['firstName'],
        'lastName': staff['lastName'],
        'position': staff['position'],
        'contact': staff['contact']
    }

def currentRoom_helper(currentRoom)->dict:
    return {
        'id': str(currentRoom['_id']),
        'roomOccupied': currentRoom['roomOccupied'],
        'roomEmpty': currentRoom['roomEmpty'],
        'totalRoom': currentRoom['totalRoom'],
        'time': currentRoom['time']
    }
# room crud operations


# Retrieve all rooms present in the database
async def retrieve_rooms():
    rooms = []
    async for room in room_collection.find():
        rooms.append(room_helper(room))
    return rooms


# Add a new room into to the database
async def add_room(room_data: dict) -> dict:
    room = await room_collection.insert_one(room_data)
    new_room = await room_collection.find_one({"_id": room.inserted_id})
    return room_helper(new_room)


# Retrieve a room with a matching roomNumber
async def retrieve_room(roomNumber: int) -> dict:
    room = await room_collection.find_one({"roomNumber": int(roomNumber)})
    if room:
        return room_helper(room)


# Update a room with a matching ID
async def update_room(roomNumber: int, data: dict):
    # Return false if an empty request body is sent.
    if len(data) < 1:
        return False
    #room = await room_collection.find_one({"_id": ObjectId(id)})
    room = await retrieve_room(roomNumber)
    id = room['id']
    if room:
        updated_room = await room_collection.update_one(
            {"_id": ObjectId(id)}, {"$set": data}
        )
        new_ud_room = await retrieve_room(roomNumber)
        #updated_room = jsonable_encoder(updated_room)
        if updated_room:
            return {
                'status': True,
                'data': new_ud_room
            }
        return {
            'status': False,
            'message': 'Cannot update room data'
        }
    return {
        'status': False,
        'message': 'Cannot find the room ID'
    }


# Delete a room from the database
async def delete_room(roomNumber: int):
    room = await retrieve_room(roomNumber)
    if room:
        await room_collection.delete_one({"roomNumber": roomNumber})
        return True

####################################################
# sensorData crud operations


# Add a new sensorData into to the database
async def add_sensorData(sensorData: dict) -> dict:
    if 'time' in sensorData and isinstance(sensorData['time'], str):
        sensorData['time'] = datetime.fromisoformat(sensorData['time'])
    sensorData = await sensorData_collection.insert_one(sensorData)
    new_sensorData = await sensorData_collection.find_one({"_id": sensorData.inserted_id})
    return sensorData_helper(new_sensorData)


# Retrieve a sensorData with a matching roomNumber
async def retrieve_sensorData_room_top_10(roomNumber: int) -> list[dict]:
    sensor_data = sensorData_collection.find({"roomNumber": roomNumber}).sort('time', -1)
    if sensor_data:
        top_10_sensor_data = await sensor_data.to_list(length = 10)
        sensor_result = [sensorData_helper(s) for s in top_10_sensor_data]
        return sensor_result
        

async def retrieve_sensorData_room(roomNumber: int) -> list[dict]:
    leastRecentDay = sensorData_collection.find({"roomNumber": roomNumber}).sort('time', -1)
    # leastRecentDay = sensorData_collection.find().sort("time", pymongo.DESCENDING)
    if leastRecentDay:
        leastRecentDay = await leastRecentDay.to_list(length = 1)
        LRD = leastRecentDay[0]['time']
    days_time = LRD - timedelta(days = 5)
    days_time = days_time.strftime("%Y-%m-%dT%H:%M:%S.%f")
    days_time = datetime.strptime(days_time, '%Y-%m-%dT%H:%M:%S.%f')         
    sensorCursor = sensorData_collection.find(
        {
           "roomNumber": roomNumber,
            "time": {"$gt": days_time}
            # 'time': '2023-10-28T15:31:50.053+00:00'
         },
        ).sort('time',-1)
    if sensorCursor:
        sensor = await sensorCursor.to_list(length = None)
        sensor_result = [sensorData_helper(s) for s in sensor]
        return sensor_result
    
# Retrieve a sensorData with a matching ID
async def retrieve_sensorData_ID(id: str) -> dict:
    sensorData = await sensorData_collection.find_one({"_id": ObjectId(id)})
    if sensorData:
        return sensorData_helper(sensorData)
# Update a sensorData with a matching ID
async def update_sensorData(id: str, data: dict):
    # Return false if an empty request body is sent.
    if len(data) < 1:
        return False
    #sensorData = await sensorData_collection.find_one({"_id": ObjectId(id)})
    sensorData = await retrieve_sensorData_ID(id)
    if sensorData:
        updated_sensorData = await sensorData_collection.update_one(
            {"_id": ObjectId(id)}, {"$set": data}
        )
        
        #updated_sensorData = jsonable_encoder(updated_sensorData)
        if updated_sensorData:
            udss = await retrieve_sensorData_ID(id)
            return {
                'status': True,
                'data': udss
            }
        return {
            'status': False,
            'message': 'Cannot update sensorData data'
        }
    return {
        'status': False,
        'message': 'Cannot find the sensorData ID'
    }



# Delete a sensorData from the database
async def delete_sensorData(id: str):
    sensorData = await sensorData_collection.find_one({"_id": ObjectId(id)})
    if sensorData:
        await sensorData_collection.delete_one({"_id": ObjectId(id)})
        return True

async def retrieve_staff(email: EmailStr, password: str):
    staff_info = await staff_collection.find_one({
        # 'firstName': 'Michael'
        # 'contact':{
        #     'email': email, 
        #     'password': password
        #     }
        'contact.email': email,
        'contact.password': password
        })
    if staff_info:
        return staff_helper(staff_info)

################################

async def add_currentRoom(currentRoom: dict) -> dict:
    if 'time' in currentRoom and isinstance(currentRoom['time'], str):
        currentRoom['time'] = datetime.fromisoformat(currentRoom['time'])
    currentRoom = await currentRoom_collection.insert_one(currentRoom)
    new_currentRoom = await currentRoom_collection.find_one({"_id": currentRoom.inserted_id})
    return currentRoom_helper(new_currentRoom)

async def retrieve_room_occupied()-> int:
    room_occupied = await room_collection.find({"roomStatus":"Occupied"}).to_list(length = None)
    return len(room_occupied)

async def retrieve_room_vacant()-> int:
    room_vacant = await room_collection.find({"roomStatus":"Vacant"}).to_list(length = None)
    return len(room_vacant)
    
# Retrieve a currentRoom with a matching ID
async def retrieve_currentRoom_ID() -> dict:
    currentRoom = await currentRoom_collection.find_one(sort = [{"time", pymongo.DESCENDING}])
    # currentRoom = await currentRoom_collection.find().sort("time", -1)
    if currentRoom:
        return currentRoom_helper(currentRoom)
# Update a currentRoom with a matching ID
async def update_currentRoom(id: str, data: dict):
    # Return false if an empty request body is sent.
    if len(data) < 1:
        return False
    #currentRoom = await currentRoom_collection.find_one({"_id": ObjectId(id)})
    currentRoom = await retrieve_currentRoom_ID()
    if currentRoom:
        updated_currentRoom = await currentRoom_collection.update_one(
            {"_id": ObjectId(id)}, {"$set": data}
        )
        
        #updated_currentRoom = jsonable_encoder(updated_currentRoom)
        if updated_currentRoom:
            udss = await retrieve_currentRoom_ID()
            return {
                'status': True,
                'data': udss
            }
        return {
            'status': False,
            'message': 'Cannot update currentRoom data'
        }
    return {
        'status': False,
        'message': 'Cannot find the currentRoom ID'
    }



# Delete a currentRoom from the database
async def delete_currentRoom(id: str):
    currentRoom = await currentRoom_collection.find_one({"_id": ObjectId(id)})
    if currentRoom:
        await currentRoom_collection.delete_one({"_id": ObjectId(id)})
        return True

