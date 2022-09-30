/** @jsxImportSource @emotion/react */
import { React, useState } from "react";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import TabbedEditor from "./TabbedEditor";
import Console from "./Console";
import { css } from '@emotion/react'




function App() {
  const [stdout, updateStdout] = useState('');
  const sippycup = new Worker(new URL('./sippycup.js', import.meta.url));

  sippycup.addEventListener("message", function handleMessage(msg) {
    if (msg.data.command === "ready") {
        let runButton = document.querySelector('#run')
        runButton.innerText = "Run";
        runButton.removeAttribute('disabled')
  
        let codeArea = document.querySelector('#code-input')
        
  
        runButton.addEventListener('click', function(event) {
            console.log('click')
            console.log(codeArea.value)
            sippycup.postMessage({'src':codeArea.value})
        })
    }
    if (msg.data.command === "response") {
        let iframe = document.querySelector('iframe')
        console.log(msg.data.data)
        const blob = new Blob([msg.data.data.replace(/\\n/g, '\n')], {type: 'text/html'});
        iframe.src = window.URL.createObjectURL(blob);
    }
  
    if (msg.data.command === "stdout") {
      
    }
  })


  return (
    
      <Grid container height="100vh">
        <Grid item xs={6} sx={{display:'flex', flexDirection:'column'}}>
          <TabbedEditor />
        </Grid>
        <Grid item xs={6} height="50vh">
          <iframe css={css`border:none`} title="Output" id="output"></iframe>
        </Grid>
        <Grid item xs={6} height="50vh">
          <Console></Console>
        </Grid>
      </Grid>
    
  );
}

export default App;
