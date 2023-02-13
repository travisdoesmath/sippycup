/** @jsxImportSource @emotion/react */
import { React, useState, useEffect } from "react";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TabbedEditor from "./TabbedEditor";
import Console from "./Console";
import { src } from './init';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from "@mui/material/CssBaseline";
import MockBrowser from "./MockBrowser";
import { createWorkerFactory, useWorker } from "@shopify/react-web-worker";

const createWorker = createWorkerFactory(() => import('./sippycup.js'));

const paddingValue = 15

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  const sippycup = useWorker(createWorker);
  const [stdout, updateStdout] = useState('Python loading...\n');
  const [pythonSrc, updatePythonSrc] = useState(src.python);
  const [htmlSrc, updateHtmlSrc] = useState(src.html);
  const [cssSrc, updateCssSrc] = useState(src.css);
  const [htmlOutput, updateHtmlOutput] = useState('');
  const [serverRunning, setServerRunning] = useState(false);
  
  async function runCode() {
    let _output = ''
    sippycup.updateFile('index.html', htmlSrc)
      .then(() => sippycup.updateFile('style.css', cssSrc))
      .then(() => sippycup.run(pythonSrc))
      .then((output) => _output += output)
      .then(() => request('GET', '/'))
      .then(([response, output]) => {
        const textDecoder = new TextDecoder()
        updateHtmlOutput(textDecoder.decode(response.body).replace(/\\n/g, '\n').replace(/\\'/g, "'"))
        _output += output
      })
      .then(() => updateStdout(stdout + _output))
  }
  
  async function request(method, route) {
    let response = await sippycup.request(method, route)
    let _stdout = response.stdout;
    response = response.value

    if (response.status.slice(0, 3) === '308') {
      let newUrl = response.headers.Location.replace('http:///', '/')
      
      return request('GET', newUrl)
    }

    updateStdout(stdout + _stdout)

    return [response, _stdout];
  }

  async function requestAndUpdate(method, route) {
    let _output = ''
    request(method, route)
    .then(([response, output]) => {
      const decoder = new TextDecoder()
      updateHtmlOutput(decoder.decode(response.body).replace(/\\n/g, '\n').replace(/\\'/g, "'"))
      _output += output
    })
    .then(() => updateStdout(stdout + _output))
  }

  useEffect(() => {
    (async () => {
      sippycup.start().then(res => {
        updateStdout(s => s + res)
        setServerRunning(true)
      })
    })();
  }, [sippycup])

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Grid container height="100vh">
        <Grid item xs={12} md={6} sx={{display:'flex', flexDirection:'column', padding: `${paddingValue}px ${paddingValue/2}px ${paddingValue}px ${paddingValue}px`, height: '100vh'}}>
          <Stack sx={{border: 'solid 1px #444', borderRadius: '15px', maxHeight: '100%'}}>
            <Box>
              <TabbedEditor 
                runHandler = { runCode }
                isReady = { serverRunning }
                files={[
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
            <Box sx={{height:'45vh', borderTop: "solid 1px #444"}}>
              <Console content={ stdout }></Console>
            </Box>
          </Stack>
          
        </Grid>        
        <Grid item xs={12} md={6} sx={{display:'flex', flexDirection:'column', padding: `${paddingValue}px ${paddingValue}px ${paddingValue}px ${paddingValue/2}px`, height: '100vh'}}>
          <MockBrowser src={ htmlOutput } pageRequestMethod={ requestAndUpdate } requestMethod={ request } ></MockBrowser>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default App;
