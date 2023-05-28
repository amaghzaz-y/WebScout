import { Button, Stack, TextField, Typography } from "@suid/material"
import { createResource, createSignal } from "solid-js"

interface SearchRequest {
	userID: string
	projectID: string
	language: string
	query: string
	limit: number
}

const Search = () => {
	let userID: string, projectID: string, language: string
	const [query, setQuery] = createSignal('');
	const [result, setResult] = createSignal('')
	const submit = async () => {
		const req: SearchRequest = {
			userID: userID,
			projectID: projectID,
			language: language,
			query: query(),
			limit: 100
		}
		const res = await fetch('http://127.0.0.1:3400/api/search', {
			method: 'POST',
			mode: 'no-cors',
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(req)
		})
		const data = await res.text()
		console.log(data)
		return data
	}
	const [data] = createResource(query, submit)
	return (
		<Stack gap={1}>
			<Typography variant="h4">Search</Typography>

			<Stack gap={1}>
				<TextField label="User ID" onChange={(e) => (userID = e.target.value)} />
				<TextField label="Project ID" onChange={(e) => (projectID = e.target.value)} />
				<TextField label="Language" placeholder="en" onChange={(e) => (language = e.target.value)} />
				<TextField label="Query" value={query()} onChange={(e) => setQuery(e.target.value)} />
				<TextField type="number" label="Limit" value={20} />
			</Stack>
			{/* <Button onClick={submit} variant="contained" >Search</Button> */}
			<TextField
				id="outlined-textarea"
				disabled
				multiline
				variant="outlined"
				rows={10}
				value={data()}
			/>
		</Stack>
	)
}

export default Search