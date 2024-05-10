import { Breed } from './../breeds/entities/breed.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cat } from './entities/cat.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CatsService {
  constructor(
    @InjectRepository(Cat)
    private readonly catRepository: Repository<Cat>,
    @InjectRepository(Breed)
    private readonly breedRepository: Repository<Breed>,
  ) {}

  async create(createCatDto: CreateCatDto) {
    const breed = await this.breedRepository.findOneBy({
      name: createCatDto.breed,
    });
    if (!breed) {
      throw new BadRequestException('Breed not found');
    }
    return await this.catRepository.save({
      ...createCatDto,
      breed,
    });
  }

  async findAll() {
    return await this.catRepository.find();
  }

  async findOne(id: number) {
    return await this.catRepository.findOneBy({ id });
  }

  async update(id: number, updateCatDto: UpdateCatDto) {
    const cat = await this.catRepository.findOne({ where: { id } });
    if (!cat) {
      throw new NotFoundException(`Cat with id ${id} not found`);
    }

    if (updateCatDto.breed) {
      const breed = await this.breedRepository.findOne({
        where: { name: updateCatDto.breed },
      });
      if (!breed) {
        throw new BadRequestException('Breed not found');
      }
      cat.breed = breed;
    }

    Object.assign(cat, updateCatDto);

    return await this.catRepository.save(cat);
  }

  async remove(id: number) {
    return await this.catRepository.softDelete({ id });
  }
}
