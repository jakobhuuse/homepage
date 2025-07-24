import { CreateUserDto, UpdateUserDto } from '../types';
import { User } from '../models/User';
import bcrypt from 'bcrypt';
import { AppDataSource } from '../../../config/data-source';
import { Repository } from 'typeorm';

export class UserService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async getUserById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return this.userRepository.save(user)
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    await this.userRepository.update(id, updateUserDto);
    return this.getUserById(id);
  }

  async deleteUser(id: string): Promise<void> {
    await this.userRepository.delete(id);;
  }
}