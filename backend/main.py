from fastapi import FastAPI, HTTPException, status, Depends, Response
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi import HTTPException, Depends, status
from pydantic import BaseModel
from typing import Annotated
import models
from database import engine, SessionLocal
from sqlalchemy.orm import Session
from datetime import datetime
from sqlalchemy import text

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
    try:
        db_user = models.User(**user.model_dump())
        db.add(db_user)
        db.commit()
        return user
    except Exception as e:
        # Handle SQLAlchemy error and return error message to frontend
        error_message = str(e)
        return {"error": error_message}   
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

#U - Update
@app.put("/user/{UserID}", status_code=status.HTTP_200_OK)
async def update_user(UserID: str, user_update: UserBase, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.UserID == UserID).first()
    if not db_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    # Update fields if they are provided in the request
    update_fields = ['Username', 'Email', 'Password', 'RegistrationDate', 'LastLoginDate', 'DeliveryAddress']
    for field in update_fields:
        new_value = getattr(user_update, field, None)
        if new_value is not None:
            setattr(db_user, field, new_value)

    db.commit()
    db.refresh(db_user)
    return db_user

@app.put("/product/{ProductID}", status_code=status.HTTP_200_OK)
async def update_product(ProductID: str, product_update: ProductBase, db: Session = Depends(get_db)):
    db_product = db.query(models.Product).filter(models.Product.ProductID == ProductID).first()
    if not db_product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    update_fields = ['Title', 'Description', 'Price', 'Conditionn', 'CategoryID', 'SellerID', 'ShippingAddress']
    for field in update_fields:
        new_value = getattr(product_update, field, None)
        if new_value is not None:
            setattr(db_product, field, new_value)

    db.commit()
    db.refresh(db_product)
    return db_product

@app.put("/bid/{BidID}", status_code=status.HTTP_200_OK)
async def update_bid(BidID: str, bid_update: BidBase, db: Session = Depends(get_db)):
    db_bid = db.query(models.Bid).filter(models.Bid.BidID == BidID).first()
    if not db_bid:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Bid not found")

    update_fields = ['ProductID', 'UserID', 'BidAmount', 'BidTime']
    for field in update_fields:
        new_value = getattr(bid_update, field, None)
        if new_value is not None:
            setattr(db_bid, field, new_value)

    db.commit()
    db.refresh(db_bid)
    return db_bid

@app.put("/category/{CategoryID}", status_code=status.HTTP_200_OK)
async def update_category(CategoryID: str, category_update: CategoryBase, db: Session = Depends(get_db)):
    # Retrieve category from the database using the CategoryID
    db_category = db.query(models.Category).filter(models.Category.CategoryID == CategoryID).first()
    if not db_category:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
    # List of fields that are allowed to be updated
    update_fields = ['CategoryName']
    # Iterate over fields and update them if a new value has been provided
    for field in update_fields:
        new_value = getattr(category_update, field, None)  # Get the new value from the category_update object
        if new_value is not None:  # Check if the new value is provided
            setattr(db_category, field, new_value)  # Set the new value to the category object in the database
    # Commit the changes to database
    db.commit()
    # Refresh the instance from the database to ensure it returns the updated data
    db.refresh(db_category)
    # Return the updated category object
    return db_category


@app.put("/review/{ProductID}/{UserID}", status_code=status.HTTP_200_OK)
async def update_review(ProductID: str, UserID: str, review_update: ReviewBase, db: Session = Depends(get_db)):
    db_review = db.query(models.Review).filter(models.Review.ProductID == ProductID, models.Review.UserID == UserID).first()
    if not db_review:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Review not found")

    update_fields = ['Rating', 'Comment', 'ReviewDate']
    for field in update_fields:
        new_value = getattr(review_update, field, None)
        if new_value is not None:
            setattr(db_review, field, new_value)

    db.commit()
    db.refresh(db_review)
    return db_review

# D - Delete
@app.delete("/user/{UserID}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(UserID: str, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.UserID == UserID).first()
    if not db_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    db.delete(db_user)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)

@app.delete("/product/{ProductID}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(ProductID: str, db: Session = Depends(get_db)):
    db_product = db.query(models.Product).filter(models.Product.ProductID == ProductID).first()
    if not db_product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    db.delete(db_product)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)

@app.delete("/transaction/{TransactionID}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_trans(TransactionID: str, db: Session = Depends(get_db)):
    db_trans = db.query(models.Transaction).filter(models.Transaction.TransactionID == TransactionID).first()
    if not db_trans:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    db.delete(db_trans)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)

@app.delete("/category/{CategoryID}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_category(CategoryID: str, db: Session = Depends(get_db)):
    db_category = db.query(models.Category).filter(models.Category.CategoryID == CategoryID).first()
    if not db_category:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
    db.delete(db_category)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)

@app.delete("/bid/{BidID}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_bid(BidID: str, db: Session = Depends(get_db)):
    db_bid = db.query(models.Bid).filter(models.Bid.BidID == BidID).first()
    if not db_bid:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Bid not found")
    db.delete(db_bid)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)

# Complex Queries
#generate a cube of total sales amounts based on Category, Seller, and Month --Note cant explicitly use CUBE in mySql 
@app.get("/sales/cube", status_code=status.HTTP_200_OK)
async def get_sales_cube(db: Session = Depends(get_db)):
    sql_query = text("""
    SELECT p.CategoryID, p.SellerID, MONTH(t.TransactionDate) AS SaleMonth, SUM(p.Price * t.Quantity) AS TotalSales
    FROM Product p
    JOIN Transaction t ON p.ProductID = t.ProductID
    GROUP BY p.CategoryID, p.SellerID, MONTH(t.TransactionDate)

    UNION ALL

    SELECT p.CategoryID, p.SellerID, NULL AS SaleMonth, SUM(p.Price * t.Quantity) AS TotalSales
    FROM Product p
    JOIN Transaction t ON p.ProductID = t.ProductID
    GROUP BY p.CategoryID, p.SellerID

    UNION ALL

    SELECT p.CategoryID, NULL AS SellerID, MONTH(t.TransactionDate) AS SaleMonth, SUM(p.Price * t.Quantity) AS TotalSales
    FROM Product p
    JOIN Transaction t ON p.ProductID = t.ProductID
    GROUP BY p.CategoryID, MONTH(t.TransactionDate)

    UNION ALL

    SELECT NULL AS CategoryID, p.SellerID, MONTH(t.TransactionDate) AS SaleMonth, SUM(p.Price * t.Quantity) AS TotalSales
    FROM Product p
    JOIN Transaction t ON p.ProductID = t.ProductID
    GROUP BY p.SellerID, MONTH(t.TransactionDate)

    UNION ALL

    SELECT p.CategoryID, NULL AS SellerID, NULL AS SaleMonth, SUM(p.Price * t.Quantity) AS TotalSales
    FROM Product p
    JOIN Transaction t ON p.ProductID = t.ProductID
    GROUP BY p.CategoryID

    UNION ALL

    SELECT NULL AS CategoryID, p.SellerID, NULL AS SaleMonth, SUM(p.Price * t.Quantity) AS TotalSales
    FROM Product p
    JOIN Transaction t ON p.ProductID = t.ProductID
    GROUP BY p.SellerID

    UNION ALL

    SELECT NULL AS CategoryID, NULL AS SellerID, MONTH(t.TransactionDate) AS SaleMonth, SUM(p.Price * t.Quantity) AS TotalSales
    FROM Product p
    JOIN Transaction t ON p.ProductID = t.ProductID
    GROUP BY MONTH(t.TransactionDate)

    UNION ALL

    SELECT NULL AS CategoryID, NULL AS SellerID, NULL AS SaleMonth, SUM(p.Price * t.Quantity) AS TotalSales
    FROM Product p
    JOIN Transaction t ON p.ProductID = t.ProductID;
    """)
    result = db.execute(sql_query)
    # convert results to dictionaries
    results = result.mappings().all()
    return [{"CategoryID": row['CategoryID'], "SellerID": row['SellerID'], "SaleMonth": row['SaleMonth'], "TotalSales": row['TotalSales']} for row in results]

@app.get("/compare_price/", status_code=status.HTTP_200_OK)
async def comparePrice(db: Session = Depends(get_db)):
    sql_query = text("""
    SELECT ProductID, Title, Price,
    LAG(Price) OVER (ORDER BY Price) AS PrevPrice,
    LEAD(Price) OVER (ORDER BY Price) AS NextPrice
    FROM Product;
    """)
    result = db.execute(sql_query)
    results = result.mappings().all()
    return [{"ProductID": row['ProductID'], "Title": row['Title'], "Price": row['Price'], "PrevPrice": row['PrevPrice'], "NextPrice": row['NextPrice']} for row in results]

@app.get("/segmentation/", status_code=status.HTTP_200_OK)
async def segmenetation(db: Session = Depends(get_db)):
    sql_query = text("""
    WITH CustomerPurchases AS (
    SELECT 
        Transaction.BuyerID,
        COUNT(*) AS Total_Transactions,
        SUM(Product.Price * Transaction.Quantity) AS Total_Spent
    FROM Transaction
    JOIN Product ON Transaction.ProductID = Product.ProductID
    GROUP BY Transaction.BuyerID
    ),
    CustomerSegments AS (
        SELECT 
            BuyerID AS UserID,
            Total_Transactions,
            Total_Spent,
            CASE 
                WHEN Total_Transactions > 3 AND Total_Spent > 20 THEN 'High-Value'
                WHEN Total_Transactions BETWEEN 1 AND 3 AND Total_Spent BETWEEN 5 AND 19 THEN 'Medium-Value'
                ELSE 'Low-Value'
            END AS Customer_Segment
        FROM CustomerPurchases
    ),
    RankedProducts AS (
        SELECT 
            Customer_Segment,
            Product.ProductID,
            SUM(Transaction.Quantity) AS Total_Quantity_Sold,
            RANK() OVER (PARTITION BY Customer_Segment ORDER BY SUM(Transaction.Quantity) DESC) AS Rankl
        FROM Transaction
        JOIN CustomerSegments ON Transaction.BuyerID = CustomerSegments.UserID
        JOIN Product ON Transaction.ProductID = Product.ProductID
        GROUP BY Customer_Segment, Product.ProductID
    ),
    TopProducts AS (
        SELECT 
            Customer_Segment,
            ProductID,
            Total_Quantity_Sold
        FROM RankedProducts
        WHERE Rankl <= 3
    ),
    MonthlySalesTrend AS (
        SELECT 
            tp.Customer_Segment,
            tp.ProductID,
            DATE_FORMAT(Transaction.TransactionDate, '%Y-%m') AS Month,
            SUM(Transaction.Quantity) AS Monthly_Sales
        FROM Transaction
        JOIN TopProducts tp ON Transaction.ProductID = tp.ProductID
        GROUP BY tp.Customer_Segment, tp.ProductID, Month
        ORDER BY Month
    )
    
    SELECT 
        mst.Customer_Segment,
        mst.ProductID,
        Product.Title AS Product_Name,
        mst.Month,
        mst.Monthly_Sales
    FROM MonthlySalesTrend mst
    JOIN Product ON mst.ProductID = Product.ProductID
    ORDER BY mst.Customer_Segment, mst.ProductID, mst.Month;

    """)
    result = db.execute(sql_query)
    results = result.mappings().all()
    return [{"Customer_Segment": row['Customer_Segment'], "ProductID": row['ProductID'], "Product_Name": row['Product_Name'], "Month": row['Month'], "Monthly_Sales": row['Monthly_Sales']} for row in results]


app.add_middleware(
    CORSMiddleware,
    allow_origins="http://localhost:3000",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
