/** @jsxImportSource @emotion/react */
import { React, useState } from "react";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TabbedEditor from "./TabbedEditor";
import Console from "./Console";
import { css } from '@emotion/react'
import { src } from './init';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from "@mui/material/CssBaseline";

const sippycup = new Worker(new URL('./sippycup.js', import.meta.url));

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  const [stdout, updateStdout] = useState('');
  const [pythonSrc, updatePythonSrc] = useState(src.python);
  const [htmlSrc, updateHtmlSrc] = useState(src.html);
  const [cssSrc, updateCssSrc] = useState(src.css);
  const [htmlOutput, updateHtmlOutput] = useState('');
  
  function runCode(code) {
    console.log('runCode called')
    sippycup.postMessage({command:"updateFile", filename:"index.html", content:htmlSrc})
    sippycup.postMessage({command:"updateFile", filename:"style.css", content:cssSrc})
    sippycup.postMessage({command:"run", src: pythonSrc})
  }

  

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
      updateHtmlOutput(msg.data.data.replace(/\\n/g, '\n'))
    }
  
    if (msg.data.command === "stdout") {
      
    }

    if (msg.data.command === "appReady") {

    }
  })


  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Grid container height="100vh">
        <Grid item xs={6} sx={{display:'flex', flexDirection:'column'}}>
          <Stack>
            <Box>
              <TabbedEditor files={[
                {
                  name:'app.py',
                  language:'python',
                  src: pythonSrc,
                  changeHandler: updatePythonSrc
                },
                {
                  name:'index.html',
                  language:'html',
                  src: htmlSrc,
                  changeHandler: updateHtmlSrc
                },
                {
                  name:'style.css',
                  language:'css',
                  src: cssSrc,
                  changeHandler: updateCssSrc
                },
                
              ]}/>
            </Box>
            <Box>
              <Button onClick={runCode}>Run</Button>
            </Box>
            <Box sx={{height:'40vh'}}>
              <Console></Console>
            </Box>
          </Stack>
          
        </Grid>        
        <Grid item xs={6} height="95vh">
          <iframe css={css`border:none; height:95%`} title="Output" id="output" srcDoc={ htmlOutput }></iframe>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default App;
