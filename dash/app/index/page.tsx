"use client"
import { Alert, Button, TextField } from "@mui/material";
import { useState } from "react";
import Snackbar from '@mui/material/Snackbar';


export default function IndexerPage() {
	const [state, setState] = useState({
		projectID: "",
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
			projectID: state.projectID,
			title: state.title,
			body: state.body
		};

		try {
			const response = await fetch("https://api.webscout.cc/index", {
				method: "POST",
				mode: "cors",
				headers: {
					"Content-Type": "application/json",
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
				label="Project ID"
				variant="outlined"
				name="projectID"
				value={state.projectID}
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
				rows={5}
				multiline
				value={state.body}
				onChange={handleChange}

			/>
			<Button className="my-1" variant="outlined" onClick={handleIndex}>
				Submit
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