import { Injectable } from '@nestjs/common';
import { CreateBreedDto } from './dto/create-breed.dto';
import { UpdateBreedDto } from './dto/update-breed.dto';
import { Repository } from 'typeorm';
import { Breed } from './entities/breed.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BreedsService {
  constructor(
    @InjectRepository(Breed)
    private readonly breedRepository: Repository<Breed>,
  ) {}

  async create(crateBreedDto: CreateBreedDto) {
    return await this.breedRepository.save(crateBreedDto);
  }

  async findAll() {
    return await this.breedRepository.find();
  }

  async findOne(id: number) {
    return await this.breedRepository.findOneBy({ id });
  }

  async update(id: number, updateBreedDto: UpdateBreedDto) {
    return await this.breedRepository.update(id, updateBreedDto);
  }

  async remove(id: number) {
    return await this.breedRepository.softDelete({ id });
  }
}
