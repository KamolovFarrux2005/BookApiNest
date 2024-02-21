import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Book } from './schemas/book.schema';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { CreateBookDto } from './dto/createBook.dto';
import { UpdateBookDto } from './dto/updateBook.dto';
import { Query } from 'express-serve-static-core';
import { User } from '../auth/schemas/user.schema';

@Injectable()
export class BookService {
    constructor(
        @InjectModel(Book.name)
        private bookModel: mongoose.Model<Book>
    ) { }


    async getAllBook(query: Query): Promise<Book[]> {
        const resPerPage = Number(query.limit) || 2;
        const currentPage = Number(query.page) || 1;
        const skip = resPerPage * (currentPage - 1);

        const keyword = query.keyword ? {
            title: {
                $regex: query.keyword,
                $options: 'i'
            }
        } : {}

        const books = await this.bookModel
            .find({ ...keyword })
            .limit(resPerPage)
            .skip(skip);
        return books;
    }

    async createBook(bookdata: CreateBookDto, user: User): Promise<Book> {
        const data = Object.assign(bookdata, {
            user: user._id
        })
        const book = await this.bookModel.create(data);
        await book.save()
        return book;
    }

    async getByIdBook(id: string): Promise<Book> {

        const isValidId = mongoose.isValidObjectId(id)
        if (!isValidId) throw new BadRequestException(`Please enter correct id.`)

        const book = await this.bookModel.findOne({ _id: id })

        if (!book) throw new NotFoundException(`Not found Book id: ${id}`);

        return book;
    }

    async updateById(id: string, updateBook: UpdateBookDto): Promise<Book> {
        const book = await this.bookModel.findByIdAndUpdate({ _id: id }, updateBook, {
            new: true,
            runValidators: true
        });

        if (!book) {
            throw new NotFoundException(`Not found Book id: ${id}`);
        }

        return book;
    }

    async deleteById(id: string): Promise<String> {
        const book = this.getByIdBook(id);
        if (!book) {
            throw new NotFoundException(`Not found book id: ${id}`);
        }
        await this.bookModel.findByIdAndDelete({ _id: id });
        return `Deleted book id: ${id}`
    }

}
