from sqlalchemy import Column, String, Text, Column, String, Numeric, Integer
from database import Base

class User(Base):
    __tablename__ = 'user'
    UserID = Column(String(255), primary_key=True, index=True)
    Username = Column(String(255), nullable=False, index=True)
    Email = Column(String(255), nullable=False)
    Password = Column(String(255), nullable=False)
    RegistrationDate = Column(String(255), nullable=False)
    LastLoginDate = Column(String(255), nullable=False)
    DeliveryAddress = Column(String(255), nullable=False)

class Product(Base):
    __tablename__ = 'product'
    ProductID = Column(String(255), primary_key=True, index=True)
    Title = Column(String(255), nullable=False)
    Description = Column(Text, nullable=False)
    Price = Column(Numeric(10, 2), nullable=False)  
    Conditionn = Column(String(255), nullable=False)  
    CategoryID = Column(String(255), nullable=True)
    SellerID = Column(String(255), nullable=True)
    ShippingAddress = Column(Text, nullable=True)

class Transaction(Base):
    __tablename__ = 'transaction'
    TransactionID = Column(String(255), primary_key=True, index=True)
    BuyerID = Column(String(255), nullable=False, index=True)
    SellerID = Column(String(255), nullable=True, index=True)
    ProductID = Column(String(255), nullable=True, index=True)  
    TransactionDate = Column(String(255), nullable=True) 
    Quantity = Column(Integer, nullable=True)
    EstimatedDeliveryDate = Column(String(255), nullable=True) 
    Delivered = Column(String(5), nullable=True)
    DeliveryAddress = Column(Text, nullable=True)
    ShippingAddress = Column(Text, nullable=True)

class Bid(Base):
    __tablename__ = 'bid'
    BidID = Column(String(255), primary_key=True, index=True)
    ProductID = Column(String(255), nullable=False, index=True)
    UserID = Column(String(255), nullable=False, index=True)
    BidAmount = Column(Numeric(10, 2), nullable=False)  
    BidTime = Column(String(255), nullable=False)

class Category(Base):
    __tablename__ = 'category'
    CategoryID = Column(String(255), primary_key=True, index=True)
    CategoryName = Column(String(255), nullable=False)

class Review(Base):
    __tablename__ = 'review'
    ProductID = Column(String(255), primary_key=True, index=True)
    UserID = Column(String(255), nullable=False, index=True)
    Rating = Column(Integer, nullable=False, index=True)
    Comment = Column(Numeric(10, 2), nullable=True)  
    ReviewDate = Column(String(255), nullable=True)  