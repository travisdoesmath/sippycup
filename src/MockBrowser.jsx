import { React, useState } from "react";
import Box from '@mui/material/Box';
import PublicIcon from '@mui/icons-material/Public';
import Tab from '@mui/material/Tab';
import Input from '@mui/material/Input';
import RefreshIcon from '@mui/icons-material/Refresh';
import Button from '@mui/material/Button';
// import { css } from '@emotion/react'
import styled from '@emotion/styled';
import Stack from '@mui/material/Stack';
import InputAdornment from '@mui/material/InputAdornment';
import { Typography } from "@mui/material";

const Iframe = styled('iframe')`
border:none; 
background: white; 
border-radius:0px 0px 15px 15px;
height: 85vh;
width: 100%;
`



export default function MockBrowser(props) {
    const [url, setUrl] = useState('')
    let title = 'localhost'
    if (props.src && props.src.match(/(?:<title>)(.*)(?:<\/title>)/)) {
        title = props.src.match(/(?:<title>)(.*)(?:<\/title>)/)[1]
    }

    function requestPage(event) {
        event.preventDefault()
        props.requestMethod('GET', '/' + url)
    }

    return (
        <>
        <Box sx={{padding:"15px", maxHeight:"100vh", height:"100vh"}}>
            
            {/* <Box sx={{background: "#202124", borderRadius:"15px 15px 0 0 "}}> */}
            <Box>
                <Stack alignItems='flex-end' sx={{background: '#202124', minHeight: '50px', borderRadius: '15px 15px 0 0'}} direction="row">
                    <svg style={{width:'60px', height:'50px'}}>
                        <circle cx={25} cy={25} r={7.5} fill='rgb(56, 202, 75)'></circle>
                    </svg>
                    <div style={{background: '#35363a', height: '50px', width: '10px', borderRadius: '15px 0 0 0'}}>
                        <div style={{height: '100%', width: '10px', background: '#202124', borderRadius: '15px 0 10px 0'}}></div>
                    </div>
                    <Tab sx={{textTransform: 'none', minHeight: "40px", height: '40px', background: "#35363a", color:"#DDD", opacity:1, borderRadius:"15px 15px 0 0"}} icon={<PublicIcon fontSize="small" />} iconPosition="start" label={ title }></Tab>
                    <div style={{background: '#35363a', height: '50px', width: '10px'}}>
                        <div style={{height: '100%', width: '10px', background: '#202124', borderRadius: '0 0 0 10px'}}></div>
                    </div>
                </Stack>
                
            </Box>
            <Box sx={{width: "100%", background: "#35363a"}}>
              <form onSubmit={requestPage}>
                <Button size="small" sx={{ minWidth: 0, marginLeft:"10px", marginBottom:"2.5px"}} onClick={requestPage}><RefreshIcon></RefreshIcon></Button>
                <Input sx={{ margin: "5px 0 5px 5px",
                            border: "solid 2px #4AF", 
                            borderRadius: "50px",
                            padding: "0px 20px",
                            width: "90%",
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
            <Iframe title="Output" id="output" sandbox="allow-scripts" srcDoc={ props.src }></Iframe>
          </Box>
          </>
    )
}