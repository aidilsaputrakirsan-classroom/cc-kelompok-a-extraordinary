from pydantic import BaseModel, ConfigDict

class MasterDataCreate(BaseModel):
    name: str

class MasterDataResponse(BaseModel):
    id: str
    name: str
    
    model_config = ConfigDict(from_attributes=True)
