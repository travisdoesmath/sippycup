import { React, useState, useEffect, useRef } from "react";
import Box from '@mui/material/Box';
import PublicIcon from '@mui/icons-material/Public';
import Tab from '@mui/material/Tab';
import Input from '@mui/material/Input';
import RefreshIcon from '@mui/icons-material/Refresh';
import Button from '@mui/material/Button';
import styled from '@emotion/styled';
import Stack from '@mui/material/Stack';
import InputAdornment from '@mui/material/InputAdornment';
import { Typography } from "@mui/material";

const tabBarHeight = 50
const urlBarHeight = 45

const Iframe = styled('iframe')`
border:none; 
background: white; 
border-radius:0px 0px 15px 15px;
height: calc(100% - ${tabBarHeight + urlBarHeight}px);
width: 100%;
`

function shimify(src) {
    const shimClass = String.raw`
    class Shim {
        constructor() {
            this.pendingRequests = [];
        }
       
        fetch(url) {
            let outerResolve, outerReject;
            let request = new Promise((resolve, reject) => {
                outerResolve = resolve
                outerReject = reject
            });
    
            window.top.postMessage({
                command: 'request',
                url: url
            }, '*')
    
            this.pendingRequests.push({
                url:url, 
                request:request,
                outerResolve: outerResolve,
                outerReject: outerReject
            })
    
            return request
        }
    
        handleMessage(msg) {
            let outerResolve;
            if (msg.data.command === 'response') {
                const translateResponse = (response) => {
                    const decoder = new TextDecoder()
                    return {
                        body: decoder.decode(response[0].body).replace('\\n', '\n'),
                        headers: response[0].headers,
                        status: response[0].status,
                        json() {
                            return JSON.parse(this.body)
                        }
                    }
                }
                this.pendingRequests.filter(req => req.url === msg.data.url).forEach(req => req.outerResolve(translateResponse(msg.data.response)))
                this.pendingRequests = this.pendingRequests.filter(req => req.url !== msg.data.url)
            }
        }
    }
    
    shim = new Shim()
    
    window.addEventListener("message", onMessage);
    
    function onMessage(e) {
        switch (e.data.command) {
            case 'response':
                shim.handleMessage(e)
                break;
            default:
        }
    }
    `

    return src
        .replace(/fetch\(/, 'shim.fetch(')
        .replace(/<\/body>/, '<script>' + shimClass + '</script></body>')
}


function CustomIframe(props) {
    const windowRef = useRef(null);

    useEffect(() => {
        if (windowRef?.current?.contentWindow) {
            
            const iframeWindow = windowRef.current.contentWindow
            const handler = (msg) => {
                switch (msg.data.command) {
                    case "request":
                        props.request(msg.data.method, msg.data.url).then(response => {
                            iframeWindow.postMessage({
                                command: 'response',
                                url: msg.data.url,
                                response: response
                            })    
                        })
                        break;
                    default:
                }
            }
    
            window.addEventListener("message", handler)

            return () => {
                window.removeEventListener("message", handler)
            }        
        }
    })

    return <Iframe title="Output" id="output" sandbox="allow-same-origin allow-scripts" srcDoc={props.srcDoc} ref={windowRef}></Iframe>
}

export default function MockBrowser(props) {
    const [url, setUrl] = useState('')
        
    let title = 'localhost'
    if (props.src && props.src.match(/(?:<title>)(.*)(?:<\/title>)/)) {
        title = props.src.match(/(?:<title>)(.*)(?:<\/title>)/)[1]
    }

    async function requestPage(event) {
        event.preventDefault()
        props.pageRequestMethod('GET', '/' + url)
    }

    async function request(method, url) {
        return props.requestMethod(method, url)
    }

    return (
        <>
        <Box sx={{maxHeight:"100%", height:"100%"}}>
            <Box>
                <Stack alignItems='flex-end' sx={{background: '#202124', minHeight: '50px', borderRadius: '15px 15px 0 0'}} direction="row">
                    <svg style={{width:'60px', height:'50px'}}>
                        <circle cx={25} cy={25} r={7.5} fill='rgb(56, 202, 75)'></circle>
                    </svg>
                    <div style={{background: '#35363a', height: `${tabBarHeight}px`, width: '10px', borderRadius: '15px 0 0 0'}}>
                        <div style={{height: '100%', width: '10px', background: '#202124', borderRadius: '15px 0 10px 0'}}></div>
                    </div>
                    <Tab sx={{textTransform: 'none', minHeight: "0px", background: "#35363a", color:"#DDD", opacity:1, borderRadius:"15px 15px 0 0"}} icon={<PublicIcon fontSize="small" />} iconPosition="start" label={ title }></Tab>
                    <div style={{background: '#35363a', height: `${tabBarHeight}px`, width: '10px'}}>
                        <div style={{height: '100%', width: '10px', background: '#202124', borderRadius: '0 0 0 10px'}}></div>
                    </div>
                </Stack>
                
            </Box>
            <Box sx={{width: "100%", background: "#35363a", height: `${urlBarHeight}px`}}>
              <form onSubmit={requestPage}>
                <Button size="small" sx={{ minWidth: 0, marginLeft:"10px", marginBottom:"2.5px"}} onClick={requestPage}><RefreshIcon></RefreshIcon></Button>
                <Input sx={{ margin: "5px 0 5px 5px",
                            border: "solid 2px #4AF", 
                            borderRadius: "50px",
                            padding: "0px 20px",
                            width: "85%",
                            "& .MuiInput-input": {
                                padding: "4px 0",
                                fontSize: '15px',
                            },
                            background: "#222"
                            }} 
                        startAdornment={
                            <InputAdornment sx={{marginRight: 0}} position="start" disablePointerEvents={true}>
                                <Typography sx={{fontWeight: 'bold', color:'#EEE'}}>localhost</Typography>
                                <Typography sx={{color:'#888'}}>:5000/</Typography>
                            </InputAdornment>}
                        size="small"  
                        disableUnderline
                        defaultValue={ url }
                        onChange={(e) => {
                            setUrl(e.target.value)}
                        }
                        ></Input>
              </form>
            </Box>
            <CustomIframe title="Output" id="output" srcDoc={shimify(props.src)} request={request}></CustomIframe>
          </Box>
          </>
    )
}