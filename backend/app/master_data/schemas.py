from pydantic import BaseModel

class MasterDataCreate(BaseModel):
    name: str

class MasterDataResponse(BaseModel):
    id: str
    name: str
    
    class Config:
        from_attributes = True
