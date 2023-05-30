"use client"
import { Alert, Button, TextField } from "@mui/material";
import { useState } from "react";
import Snackbar from '@mui/material/Snackbar';


export default function IndexerPage() {
	const [state, setState] = useState({
		userID: "",
		projectID: "",
		language: "",
		title: "",
		body: "",
	});
	const [openSuccess, setOpenSuccess] = useState(false)
	const [openError, setOpenError] = useState(false)
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setState((prevState) => ({
			...prevState,
			[name]: value
		}));
	};

	const handleIndex = async () => {
		const body = {
			userID: state.userID,
			projectID: state.projectID,
			language: state.language,
			title: state.title,
			body: state.body
		};

		try {
			const response = await fetch("https://api.webscout.cc/index", {
				method: "POST",
				mode: "cors",
				headers: {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*",
				},
				body: JSON.stringify(body)
			});
			console.log(response.status)
			console.log(body)
			if (response.status == 200) {
				setOpenError(false)
				setOpenSuccess(true)
			} else {
				setOpenSuccess(false)
				setOpenError(true)
			}
		} catch (error) {
			setOpenSuccess(false)
			setOpenError(true)
		}
	};

	return (
		<div className="w-full flex flex-col gap-2 p-3">
			<div>Indexer page</div>
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
				label="Title"
				variant="outlined"
				name="title"
				value={state.title}
				onChange={handleChange}
			/>
			<TextField
				label="Body"
				variant="outlined"
				name="body"
				value={state.body}
				onChange={handleChange}

			/>
			<Button className="my-1" variant="outlined" onClick={handleIndex}>
				Search
			</Button>
			<Snackbar open={openSuccess} autoHideDuration={2000}>
				<Alert severity="success">Document Indexed Successfully</Alert>
			</Snackbar>
			<Snackbar open={openError} autoHideDuration={2000}>
				<Alert severity="error">Error: Indexing Document Failed !</Alert>
			</Snackbar>
		</div>
	);
}