import {
	ConflictException,
	Injectable,
	InternalServerErrorException,
	NotFoundException
} from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UsersService {
	constructor(private _prismaService: PrismaService) {}

	async getAllUsers(): Promise<CreateUserDto[]> {
		return await this._prismaService.usuario.findMany()
	}

	async getUserById(userId: number): Promise<CreateUserDto> {
		const user = await this._prismaService.usuario.findFirst({
			where: {
				id: userId
			}
		})

		if (!user) throw new NotFoundException('User not found')
		return user
	}

	async createUser(userData: CreateUserDto): Promise<CreateUserDto> {
		try {
			const userCreated = await this._prismaService.usuario.create({
				data: userData
			})

			return userCreated
		} catch (error) {
			if (error.code && error.code == 'P2002') {
				throw new ConflictException('Field email already is in use')
			}

			// console.log(error)
			throw new InternalServerErrorException()
		}
	}

	async updateUser(
		userId: number,
		userData: UpdateUserDto
	): Promise<UpdateUserDto> {
		try {
			const updatedUser = await this._prismaService.usuario.update({
				where: { id: userId },
				data: userData
			})

			return updatedUser
		} catch (error) {
			if (error.code == 'P2025') {
				throw new NotFoundException('User not found')
			}

			throw new InternalServerErrorException()
		}
	}

	async deleteUser(userId: number): Promise<CreateUserDto> {
		try {
			const deletedUser = await this._prismaService.usuario.delete({
				where: { id: userId }
			})

			return deletedUser
		} catch (error) {
			if (error.code == 'P2025') {
				throw new NotFoundException('User not found')
			}

			throw new InternalServerErrorException()
		}
	}
}
