import React from "react";
import Grid from '@mui/material/Grid';
import TabbedEditor from "./TabbedEditor";



function App() {
  return (
      <Grid container>
        <Grid item xs={6}>
          <TabbedEditor
          height="90vh"
          defaultLanguage="javascript"
          defaultValue="// some comment"
        />
        </Grid>
        <Grid item xs={6}>
          <iframe id="output"></iframe>
        </Grid>
      </Grid>
  );
}

export default App;
