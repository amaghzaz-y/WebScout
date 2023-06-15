'use client'
import { Button, TextField } from "@mui/material";
import { useState } from "react";
import NavBar from "../components/NavBar";
import SearchResult from "../components/SearchResult";

export default function SearchPage() {
	const [state, setState] = useState({
		projectID: "",
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
			projectID: state.projectID,
			query: state.query,
			limit: state.limit
		};

		try {
			const response = await fetch(`https://api.webscout.cc/search?projectID=${body.projectID}&query=${body.query}`, {
				method: "GET",
				mode: "cors",
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
			<NavBar />
			<div className="p-3">Search page</div>
			<TextField
				label="Project ID"
				variant="outlined"
				name="projectID"
				value={state.projectID}
				onChange={handleChange}
				autoComplete="false"
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
			{/* <TextField
				label="Results"
				value={state.result}
				rows={4}
				multiline
				disabled
			/> */}
			<SearchResult />
		</div>
	);
}