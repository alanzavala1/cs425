from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import MetaData, Table, Column, Integer, String, Text, PrimaryKeyConstraint
import databases
from contextlib import asynccontextmanager
from pydantic import BaseModel

DATABASE_URL = "mysql+aiomysql://root:password@localhost/ebay"
database = databases.Database(DATABASE_URL)
metadata = MetaData()

# Define your tables
users = Table(
    "user", metadata,
    Column("UserID", String, primary_key=True),
    Column("Username", String),
    Column("Email", String),
    Column("Password", String),
    Column("RegistrationDate", String),
    Column("LastLoginDate", String),
    Column("DeliveryAddress", String),
)

product = Table(
    "product", metadata,
    Column("ProductID", String, primary_key=True),
    Column("Title", String),
    Column("Description", String),
    Column("Price", String),
    Column("Conditionn", String),
    Column("CategoryID", String),
    Column("SellerID", String),
    Column("ShippingAddress", String),
)

transaction = Table(
    "transaction", metadata,
    Column("BuyerID", String, primary_key=True),
    Column("SellerID", String),
    Column("ProductID", String),
    Column("TransactionDate", String),
    Column("Quantity", String),
    Column("EstimatedDeliveryDate", String),
    Column("Delivered", String),
    Column("DeliveryAddress", String),
    Column("ShippingAddress", String),
)

bid = Table(
    "bid", metadata,
    Column("BidID", String, primary_key=True),
    Column("ProductID", String),
    Column("UserID", String),
    Column("BidAmount", String),
    Column("BidTime", String),
)

category = Table(
    "category", metadata,
    Column("CategoryID", String, primary_key=True),
    Column("CategoryName", String),
)

review = Table( 
    "review", metadata,
    Column("ProductID", String, primary_key=True),
    Column("UserID", String),
    Column("Rating", Integer),
    Column("Comment", Text),
    Column("ReviewDate", String),
    PrimaryKeyConstraint("ProductID", "UserID"),
)

# Define Pydantic models
class User(BaseModel):
    UserID: str
    Username: str
    Email: str
    Password: str
    RegistrationDate: str
    LastLoginDate: str
    DeliveryAddress: str

class Product(BaseModel):
    ProductID: str
    Title: str
    Description: str
    Price: str
    Conditionn: str
    CategoryID: str
    SellerID: str
    ShippingAddress: str

class Bid(BaseModel):
    BidID: str
    ProductID: str
    UserID: str
    BidAmount: str
    BidTime: str

class Transaction(BaseModel):
    TransactionID: str
    BuyerID: str
    SellerID: str
    ProductID: str 
    TransactionDate: str 
    Quantity: str
    EstimatedDeliveryDate: str
    Delivered: str
    DeliveryAddress: str
    ShippingAddress: str

class Category(BaseModel):
    CategoryID: str
    CategoryName: str

class ReviewModel(BaseModel):  # Renamed from Review
    ProductID: str
    UserID: str
    Rating: int
    Comment: str
    ReviewDate: str 

    class Config:
        orm_mode = True

# Define app lifespan context manager
@asynccontextmanager
async def app_lifespan(app):
    await database.connect()
    yield
    await database.disconnect()

# Create FastAPI app
app = FastAPI(lifespan=app_lifespan)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Define routes
@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/user/")
async def read_users():
    query = users.select()
    return await database.fetch_all(query=query)

@app.get("/product/")
async def read_products():
    query = product.select()
    return await database.fetch_all(query=query)

@app.get("/bid/")
async def read_bids():
    query = bid.select()
    return await database.fetch_all(query=query)

@app.get("/transaction/")
async def read_transactions():
    query = transaction.select()
    return await database.fetch_all(query=query)

@app.get("/category/")
async def read_category():
    query = category.select()
    return await database.fetch_all(query=query)

@app.get("/review/")
async def read_reviews():
    query = review.select()
    return await database.fetch_all(query=query)
