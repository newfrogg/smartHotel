from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import router as hotelRouter
app = FastAPI()
origins = ['http://localhost:5173']
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Add "OPTIONS" here
    allow_headers=["*"],
)

# @app.get("/")
# def read_root():
#     return {"Hello": "World"}


# @app.get("/items/{item_id}")
# def read_item(item_id: int, q: Union[str, None] = None):
#     return {"item_id": item_id, "q": q}

# class FoodEnum(str, Enum):
#     fruits = 'fruits'
#     vegetables = 'vegetables'
#     fastfood = 'fastfood'

# @app.get("/food/{food_name}")
# async def get_food(food_name: FoodEnum):
#     if food_name == FoodEnum.vegetables:
#         return {
#             'food_name': food_name,
#             'message': 'You are good'
#             }

#     if food_name.value =='fruits':
#         return {
#             'food_name':food_name, 
#             'message': 'You are good but like too sweet'
#             }

#     return {
#         'food_name':food_name, 
#         'message': 'You are not good at all'
#         }

# @app.get('/user/{user_id}')
# async def get_user_money(user_id: int, assets: list[str]= Query(['food', 'cake']), short: bool = False):
#     user_details = dict(user_id = user_id)
#     if assets:
#         user_details.update({'assets': assets})
#     if not short:
#         user_details.update({'description': 'Here is this man property'})
#     return user_details

# class User(BaseModel):
#     name: str
#     age: float
#     address: str|None = None
# @app.post('/user')
# async def create_user_id(user_id: int):


app.include_router(hotelRouter, tags=["hotel"], prefix="/hotel")


@app.get("/", tags=["Root"])
async def read_root():
    return {"message": "Welcome to DADN"}
