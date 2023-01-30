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

// output window
import PublicIcon from '@mui/icons-material/Public';
import Tab from '@mui/material/Tab';
import Typography from "@mui/material/Typography";
import TextField from '@mui/material/TextField';
import Input from '@mui/material/Input';
import RefreshIcon from '@mui/icons-material/Refresh';


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
      console.log("STDOUT: ", msg.data.message)
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
          <Box sx={{background: "#222", "border-radius":"15px 15px 0 0 "}}><Tab sx={{"min-height": "40px", height: '40px', background: "#333", "border-radius":"15px 15px 0 0"}} icon={<PublicIcon />} iconPosition="start" label={"My Flask App"}></Tab></Box>
          <Box sx={{width: "100%", background: "#333"}}>
            <Button size="small" sx={{"min-width": 0, "margin-left":"10px", "margin-bottom":"2.5px"}}><RefreshIcon></RefreshIcon></Button>
            <Input sx={{ margin: "5px 0 5px 5px",
                         border: "solid 2px #4AF", 
                         "border-radius": "50px",
                         padding: "0px 20px",
                         width: "80%",
                         "& .MuiInput-input": {
                            padding: 0
                         }
                        }} 
                   size="small"  
                   disableUnderline
                   defaultValue="http://localhost:5000/"></Input>
          </Box>
          <iframe css={css`border:none; height:95%; background: white`} title="Output" id="output" srcDoc={ htmlOutput }></iframe>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default App;
