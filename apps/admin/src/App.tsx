import { Button, Grid, ToggleButton, ToggleButtonGroup } from "@suid/material";
import IndexDocument from "./lib/IndexDocument";
import { A, Route, Routes } from "@solidjs/router";
import Search from "./lib/Search";

export default function App() {
  return (
    <div class="flex flex-col p-3 justify-center ">
      <ToggleButtonGroup class="p-3">
        <ToggleButton value="Index" >
          <A href="/index">Index</A>
        </ToggleButton>
        <ToggleButton value="Search">
          <A href="/search">Search</A>
        </ToggleButton>
      </ToggleButtonGroup>
      <div class="max-w-xl w-3/4 self-center">
        <Routes>
          <Route path={"/index"} component={IndexDocument} />
          <Route path={"/search"} component={Search} />
        </Routes>
      </div>

    </div >
  )
}

