import { PrismaClient, User } from '@prisma/client'
class DB {
	prisma: PrismaClient
	constructor() {
		this.prisma = new PrismaClient()
	}
	async findUserByID(id: string): Promise<User | null> {
		const user = await this.prisma.user.findUnique({
			where: {
				id: id
			}
		})
		return user
	}
	async findUserByEmail(email: string): Promise<User | null> {
		const user = await this.prisma.user.findUnique({
			where: {
				email: email
			}
		})
		return user
	}
}