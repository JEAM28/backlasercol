import { Injectable } from "@nestjs/common"
import { ApiProperty } from "@nestjs/swagger"
import { ArrayMinSize, IsArray, IsNotEmpty, IsUUID } from "class-validator"
import { Products } from "src/Products/products.entity"

export class CreateOrderDto{

    @IsNotEmpty()
    @IsUUID()
    @ApiProperty()
    userId:string

    @IsArray()
    @ArrayMinSize(1)
    @ApiProperty()
    products: Partial<Products[]>
}