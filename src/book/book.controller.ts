import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './schemas/book.schema';
import { CreateBookDto } from './dto/createBook.dto';
import { UpdateBookDto } from './dto/updateBook.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { query } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('book')
export class BookController {
    constructor(private bookService: BookService){}
    @Get()
    async getAllBook(@Query() query: ExpressQuery): Promise<Book[]>{
        return  this.bookService.getAllBook(query)
    }

    @Get('/:id')
    async getByIdBook(@Param('id') id: string): Promise<Book>{
        return this.bookService.getByIdBook(id);
    }

    @Post()
    @UseGuards(AuthGuard())
    async createBook(
        @Body()
        bookData: CreateBookDto,
        @Req() req,
        ): Promise<Book>{
        return this.bookService.createBook(bookData, req.user);
    }
    @Patch('/:id')
    async updateByIdBook(@Param('id') id: string, @Body() updateData: UpdateBookDto): Promise<Book>{
        return this.bookService.updateById(id, updateData);
    }

    @Delete('/:id')
    async deleteByIdBook(@Param('id') id: string){
        return this.bookService.deleteById(id)
    }

    
}
