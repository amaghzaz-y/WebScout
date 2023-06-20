import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import Link from "next/link";

export default function NavBar() {
	return (
		<>
			<ToggleButtonGroup>
				<ToggleButton value={'Profile'}>
					<Link href={'/index'}>
						Profile
					</Link>
				</ToggleButton>
				<ToggleButton value={'Projects'}>
					<Link href={'/projects'}>
						Projects
					</Link>
				</ToggleButton>
				<ToggleButton value={'Search'}>
					<Link href={'/search'}>
						Search
					</Link>
				</ToggleButton>
				<ToggleButton value={'Index'}>
					<Link href={'/index'}>
						Index
					</Link>
				</ToggleButton>
			</ToggleButtonGroup>
		</>
	)
}