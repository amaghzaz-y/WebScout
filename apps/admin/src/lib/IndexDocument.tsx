import { Button, Stack, TextField, Typography } from "@suid/material"
import { ofetch } from "ofetch"


interface indeRequest {
	userID: string
	projectID: string
	language: string
	title: string
	body: string
}

const IndexDocument = () => {
	let userID: string, projectID: string, language: string, title: string, body: string
	const submit = (e: Event) => {
		const req: indeRequest = {
			userID: userID,
			projectID: projectID,
			language: language,
			title: title,
			body: body
		}
		ofetch('http://127.0.0.1:8787/api/index', {
			method: 'POST',
			body: req,
			mode: "no-cors"
		}).catch((error) => console.log(error))
	}
	return (
		<Stack gap={1}>
			<Typography variant="h4">Index</Typography>
			<Stack gap={1}>
				<TextField label="User ID" onChange={(e) => (userID = e.target.value)} />
				<TextField label="Project ID" onChange={(e) => (projectID = e.target.value)} />
				<TextField label="Language" placeholder="en" onChange={(e) => (language = e.target.value)} />
				<TextField label="Title" onChange={(e) => (title = e.target.value)} />
			</Stack>
			<TextField
				id="outlined-textarea"
				label="Body"
				multiline
				rows={10}
				onChange={(e) => (body = e.target.value)}
			/>
			<Button variant="contained" onClick={submit} >submit</Button>
		</Stack>
	)
}
export default IndexDocument