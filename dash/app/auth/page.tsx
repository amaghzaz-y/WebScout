'use client'

import { Button, TextField } from "@mui/material"

export default async function LoginPage() {
	return (
		<>
			<TextField label='Username' />
			<TextField label='Password' type="password" />
			<Button>
				Login
			</Button>
		</>
	)
}