from pydantic import BaseModel, ConfigDict, field_validator


class MasterDataCreate(BaseModel):
    name: str

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        if len(v.strip()) < 2 or len(v) > 200:
            raise ValueError("Nama master data harus berukuran 2 sampai 200 karakter")
        return v

class MasterDataResponse(BaseModel):
    id: str
    name: str

    model_config = ConfigDict(from_attributes=True)
