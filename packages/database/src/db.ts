import { PrismaClient, Project, User } from '@prisma/client'
export default class DB {
	private prisma: PrismaClient
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
	async findAllProjectByUserID(userID: string): Promise<Project[]> {
		const projects = await this.prisma.project.findMany({
			where: {
				userId: userID
			}
		})
		return projects
	}
}