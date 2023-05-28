import { Button, Stack, TextField, Typography } from "@suid/material"
import { ofetch } from "ofetch"
import { createSignal } from "solid-js"
import { number } from "zod"

interface SearchRequest {
	userID: string
	projectID: string
	language: string
	query: string
	limit: number
}

const Search = () => {
	let userID: string, projectID: string, language: string, query: string
	const [result, setResult] = createSignal('')
	const submit = (e: Event) => {
		const req: SearchRequest = {
			userID: userID,
			projectID: projectID,
			language: language,
			query: query,
			limit: 100
		}
		console.log()
		ofetch('http://127.0.0.1:8787/api/search', {
			method: 'POST',
			body: req,
			mode: 'no-cors',
			responseType: 'text'
		}).then((v) => {
			console.log(v)
			setResult(v)
		}).catch(e => { console.log(e) })
	}
	return (
		<Stack gap={1}>
			<Typography variant="h4">Search</Typography>

			<Stack gap={1}>
				<TextField label="User ID" onChange={(e) => (userID = e.target.value)} />
				<TextField label="Project ID" onChange={(e) => (projectID = e.target.value)} />
				<TextField label="Language" placeholder="en" onChange={(e) => (language = e.target.value)} />
				<TextField label="Query" onChange={(e) => (query = e.target.value)} />
				<TextField type="number" label="Limit" value={20} />
			</Stack>
			<Button onClick={submit} variant="contained" >Search</Button>
			<TextField
				id="outlined-textarea"
				disabled
				multiline
				variant="outlined"
				rows={10}
				value={result()}
			/>
		</Stack>
	)
}

export default Search