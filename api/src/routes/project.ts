import { Context } from 'hono'
import { z } from "zod";
import KV from "../lib/kv"


const projectSchema = z.object(
	{
		projectID: z.string().min(4),
		name: z.string(),
		language: z.string().max(2)
	}
)

const projectHandler = async (c: Context) => {
	const kv = new KV(c.env.KV)
	const body = {
		projectID: c.req.query('projectID'),
		name: c.req.query('name'),
		language: c.req.query('language')
	};
	let content: z.infer<typeof projectSchema>
	try {
		content = projectSchema.parse(body)
	} catch (e) {
		return new Response('Malformed Request', {
			status: 400,
			headers: {
				'Content-Type': 'text/plain',
			},
		})
	}
	
	let project = await kv.getProject(content.projectID)
	if (project == null) {
		await kv.setProject(content.projectID, content)
		return c.text("SUCCESS: New Project Created")
	}
	
	return c.json(project)
}

export default projectHandler