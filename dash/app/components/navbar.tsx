import { ToggleButton, ToggleButtonGroup } from "@mui/material";

export default function NavBar() {
	return (
		<>
			<ToggleButtonGroup>
				<ToggleButton value={'Profile'}>Profile</ToggleButton>
				<ToggleButton value={'Projects'}>Projects</ToggleButton>
				<ToggleButton value={'Search'}>Search</ToggleButton>
				<ToggleButton value={'Index'}>Index</ToggleButton>
			</ToggleButtonGroup>
		</>
	)
}