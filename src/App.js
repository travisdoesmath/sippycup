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
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import MockBrowser from "./MockBrowser";
import { Message, SettingsRemoteOutlined } from "@mui/icons-material";
import { createWorkerFactory, useWorker } from "@shopify/react-web-worker";

// output window
// import PublicIcon from '@mui/icons-material/Public';
// import Tab from '@mui/material/Tab';
// import Typography from "@mui/material/Typography";
// import TextField from '@mui/material/TextField';
// import Input from '@mui/material/Input';
// import RefreshIcon from '@mui/icons-material/Refresh';


//const sippycup = new Worker(new URL('./sippycup.js', import.meta.url));

const createWorker = createWorkerFactory(() => import('./sippycup.js'));


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
    // sippycup.postMessage({command:"updateFile", filename:"index.html", content:htmlSrc})
    // sippycup.postMessage({command:"updateFile", filename:"style.css", content:cssSrc})
    // sippycup.postMessage({command:"run", src: pythonSrc})
    let _output = ''
    sippycup.updateFile('index.html', htmlSrc)
      .then(() => sippycup.updateFile('style.css', cssSrc))
      .then(() => sippycup.run(pythonSrc))
      .then((output) => _output += output)
      .then(() => request('GET', '/'))
      .then(([response, output]) => {
        const textDecoder = new TextDecoder()
        console.log(response)
        console.log(textDecoder.decode(response.body))
        updateHtmlOutput(textDecoder.decode(response.body).replace(/\\n/g, '\n').replace(/\\'/g, "'"))
        _output += output
      })
      .then(() => updateStdout(stdout + _output))
  }
  
  async function request(method, route) {
    // if (serverRunning) {
    //   sippycup.postMessage({command:"request", method:method, route:route})
    // }
    let response = await sippycup.request(method, route)
    console.log('app.js response', response)
    let _stdout = response.stdout;
    response = response.value

    if (response.status.slice(0, 3) == '308') {
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
        updateStdout(stdout + res)
        setServerRunning(true)
      })
    })();
  }, [sippycup])
  // const channel = new MessageChannel()

  // sippycup.postMessage({command:"connect"}, [channel.port1])

  // sippycup.addEventListener("message", function handleMessage(msg) {
  //   if (msg.data.command === "ready") {

  //   }
  //   if (msg.data.command === "response") {
  //     updateHtmlOutput(msg.data.data.replace(/\\n/g, '\n').replace(/\\'/g, "'"))
  //     console.log(msg.data.status.slice(0,3))
  //     if (msg.data.status.slice(0, 3) == '308') {
  //       let newUrl = msg.data.headers.Location.replace('http:///', '/')
        
  //       request('GET', newUrl)
  //     }
  //   }
  
  //   if (msg.data.command === "stdout") {
  //     updateStdout(stdout + msg.data.message)
  //   }

  //   if (msg.data.command === "appReady") {
  //     setServerRunning(true)
  //   }
  // })


  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Grid container height="100vh">
        <Grid item xs={6} sx={{display:'flex', flexDirection:'column', padding: '15px 0 15px 15px', height: '100vh'}}>
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
            {/* <Grid container justifyContent="flex-end">
              <Button onClick={runCode}><PlayArrowIcon />Run</Button>
            </Grid> */}
            <Box sx={{height:'45vh', borderTop: "solid 1px #444"}}>
              <Console content={ stdout }></Console>
            </Box>
          </Stack>
          
        </Grid>        
        <Grid item xs={6} sx={{display:'flex', flexDirection:'column', padding: '15px', height: '100vh'}}>
          <MockBrowser src={ htmlOutput } pageRequestMethod={ requestAndUpdate } requestMethod={ request } ></MockBrowser>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default App;
