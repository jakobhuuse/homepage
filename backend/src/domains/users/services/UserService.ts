import { UserRepository } from '../repositories/UserRepository';
import { CreateUserDto } from '../dto/CreateUserDto';
import { UpdateUserDto } from '../dto/UpdateUserDto';
import { User } from '../models/User';
import bcrypt from 'bcrypt';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async getUserById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    
    return this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    return this.userRepository.update(id, updateUserDto);
  }

  async deleteUser(id: string): Promise<void> {
    return this.userRepository.delete(id);
  }
}