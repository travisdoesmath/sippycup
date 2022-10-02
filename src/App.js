/** @jsxImportSource @emotion/react */
import { React, useState } from "react";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TabbedEditor from "./TabbedEditor";
import Console from "./Console";
import { css } from '@emotion/react'
import { src } from './init';


const sippycup = new Worker(new URL('./sippycup.js', import.meta.url));

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
      <Grid container height="100vh">
        <Grid item xs={6} sx={{display:'flex', flexDirection:'column'}}>
          <TabbedEditor tabs={[
            {
              filename:'app.py',
              language:'python',
              initialSrc: pythonSrc,
              changeHandler: updatePythonSrc
            },
            {
              filename:'index.html',
              language:'html',
              initialSrc: htmlSrc,
              changeHandler: updateHtmlSrc
            },
            {
              filename:'index.css',
              language:'css',
              initialSrc: cssSrc,
              changeHandler: updateCssSrc
            },
            
          ]}/>
        </Grid>
        <Grid item xs={12} height="5vh">
          <Button onClick={runCode}>Run</Button>
        </Grid>
        <Grid item xs={6} height="40vh">
          <iframe css={css`border:none`} title="Output" id="output" srcDoc={ htmlOutput }></iframe>
        </Grid>
        <Grid item xs={6} height="40vh">
          <Console></Console>
        </Grid>
      </Grid>
  );
}

export default App;
