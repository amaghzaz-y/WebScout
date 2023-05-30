"use client"
import { Button, TextField } from "@mui/material";
import { useState } from "react";

export default function SearchPage() {
	const [state, setState] = useState({
		userID: "",
		projectID: "",
		language: "",
		query: "",
		limit: "",
		result: ""
	});

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setState((prevState) => ({
			...prevState,
			[name]: value
		}));
	};

	const handleSearch = async () => {
		const body = {
			userID: state.userID,
			projectID: state.projectID,
			language: state.language,
			query: state.query,
			limit: parseInt(state.limit)
		};

		try {
			const response = await fetch("https://api.webscout.cc/search", {
				method: "POST",
				mode: "cors",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(body)
			});
			const result = await response.text();

			if (result.length > 0) {
				setState((prevState) => ({
					...prevState,
					result: result
				}));
				console.log(body)
				console.log(result);
			} else {
				setState((prevState) => ({
					...prevState,
					result: "empty results"
				}));
				console.log(body)
				console.log("empty");
			}
		} catch (error) {
			setState((prevState) => ({
				...prevState,
				result: String(error)
			}));
		}
	};

	return (
		<div className="w-full flex flex-col gap-2 p-3">
			<div>Search page</div>
			<TextField
				label="User ID"
				variant="outlined"
				name="userID"
				value={state.userID}
				onChange={handleChange}

			/>
			<TextField
				label="Project ID"
				variant="outlined"
				name="projectID"
				value={state.projectID}
				onChange={handleChange}

			/>
			<TextField
				label="Language"
				variant="outlined"
				name="language"
				value={state.language}
				onChange={handleChange}

			/>
			<TextField
				label="Query"
				variant="outlined"
				name="query"
				value={state.query}
				onChange={handleChange}

			/>
			<TextField
				label="Limit"
				type="number"
				variant="outlined"
				name="limit"
				value={state.limit}
				onChange={handleChange}

			/>
			<Button className="my-1" variant="outlined" onClick={handleSearch}>
				Search
			</Button>
			<TextField
				label="Results"
				value={state.result}
				rows={4}
				multiline
				disabled
			/>
		</div>
	);
}