from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Annotated
import models
from database import engine, SessionLocal
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List

app = FastAPI()
models.Base.metadata.create_all(bind=engine)

class UserBase (BaseModel):
    UserID: str
    Username: str
    Email: str
    Password: str
    RegistrationDate:str = None
    LastLoginDate:str = None
    DeliveryAddress:str = None

class ProductBase (BaseModel):
    ProductID: str  
    Title: str
    Description: str
    Price:str = None
    Conditionn:str = None
    CategoryID:str = None
    SellerID:str = None
    ShippingAddress:str = None

class TransactionBase (BaseModel):
    TransactionID: str
    BuyerID: str
    SellerID: str
    ProductID:str = None
    TransactionDate:str = None
    Quantity:str = None
    EstimatedDeliveryDate:str = None
    Delivered:str = None
    DeliveryAddress:str = None
    ShippingAddress:str = None

class BidBase (BaseModel):
    BidID: str
    ProductID: str
    UserID: str
    BidAmount:str = None
    BidTime:str = None

class CategoryBase (BaseModel):
    CategoryID: str
    CategoryName: str

class ReviewBase (BaseModel):
    ProductID: str
    UserID: str
    Rating: str
    Comment:str = None
    ReviewDate:str = None

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]
#C - Create
@app.post("/user/", status_code=status.HTTP_201_CREATED)
async def create_user(user: UserBase, db: db_dependency):
    db_user = models.User(**user.model_dump())
    db.add(db_user)
    db.commit()
    return user
@app.post("/product/", status_code=status.HTTP_201_CREATED)
async def create_product(prod: ProductBase, db: db_dependency):
    db_prods = models.Product(**prod.model_dump())
    db.add(db_prods)
    db.commit()
    return prod
@app.post("/transaction/", status_code=status.HTTP_201_CREATED)
async def create_trans(trans: TransactionBase, db: db_dependency):
    db_trans = models.Transaction(**trans.model_dump())
    db.add(db_trans)
    db.commit()
    return trans
@app.post("/bid/", status_code=status.HTTP_201_CREATED)
async def create_bid(bid: BidBase, db: db_dependency):
    db_bids = models.Bid(**bid.model_dump())
    db.add(db_bids)
    db.commit()
    return bid
@app.post("/category/", status_code=status.HTTP_201_CREATED)
async def create_category(category: CategoryBase, db: db_dependency):
    db_categories = models.Category(**category.model_dump())
    db.add(db_categories)
    db.commit()
    return category

@app.post("/review/", status_code=status.HTTP_201_CREATED)
async def create_review(review: ReviewBase, db: db_dependency):
    db_reviews = models.Review(**review.model_dump())
    db.add(db_reviews)
    db.commit()
    return review
#R - Read
@app.get("/user/", status_code=status.HTTP_200_OK)
async def read_users(db: db_dependency):
     users = db.query(models.User).all()
     return users
@app.get("/product/", status_code=status.HTTP_200_OK)
async def read_products(db: db_dependency):
     products = db.query(models.Product).all()
     return products
@app.get("/transaction/", status_code=status.HTTP_200_OK)
async def read_transactions(db: db_dependency):
     transactions = db.query(models.Transaction).all()
     return transactions
@app.get("/bid/", status_code=status.HTTP_200_OK)
async def read_bids(db: db_dependency):
     bids = db.query(models.Bid).all()
     return bids
@app.get("/category/", status_code=status.HTTP_200_OK)
async def read_categories(db: db_dependency):
     categories = db.query(models.Category).all()
     return categories
@app.get("/review/", status_code=status.HTTP_200_OK)
async def read_reviews(db: db_dependency):
     reviews = db.query(models.Review).all()
     return reviews

app.add_middleware(
  CORSMiddleware,
  allow_origins=["http://localhost:3000"],
  allow_credentials=True,
  allow_methods=["GET", "POST", "PUT", "DELETE"],
  allow_headers=["*"],
)
