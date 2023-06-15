"use client"
import { Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, styled } from "@mui/material"


const Item = styled(Paper)(({ theme }) => ({
	backgroundColor: '#1A2027',
	...theme.typography.body2,
	padding: theme.spacing(1),
	textAlign: 'center',
	color: theme.palette.text.secondary,
}));

export default function SearchResult() {
	return (
		<>
			<Item variant="elevation">
				<Grid container>
					<Grid item xs={5} className="text-center">
						Title
					</Grid>
					<Grid item xs={5} className="text-center">
						Resource
					</Grid>
					<Grid item xs={2} className="text-center">
						Score
					</Grid>
				</Grid>
			</Item>
		</>
	)
}

export interface ISearchResult {
	name: string
	score: string
}