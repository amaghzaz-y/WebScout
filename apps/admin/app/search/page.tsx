'use client';
import { Button, TextField } from "@mui/material"
import useSWR from "swr";

export default function Page() {
	const { result, isLoading, isError } = useSearch({
		userID: 'yassine',
		porjectID: 'duck',
		language: 'en',
		query: 'beauty',
		limit: 2
	})
	return (
		<div className="w-full flex flex-col gap-2 p-3">
			<div>
				Search page
			</div>
			<TextField label='User ID' variant='outlined' />
			<TextField label='Project ID' variant='outlined' />
			<TextField label='Language' variant='outlined' />
			<TextField label='Query' variant='outlined' />
			<TextField label='Limit' type="number" variant='outlined' />
			<Button className="my-1" variant="outlined">Search</Button>
			<TextField label="Results" value={result} rows={4} multiline />
		</div >
	)

}

interface searchQuery {
	userID: string
	porjectID: string
	language: string
	query: string
	limit: number
}

function useSearch(query: searchQuery) {
	const fetcher = () => fetch('localhost:3400/api/search', {
		method: 'POST',
		mode: 'no-cors',
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(query),
	}).then(res => res.text())

	const { data, error, isLoading } = useSWR('/api/search', fetcher)

	return {
		result: data,
		isLoading,
		isError: error
	}
}