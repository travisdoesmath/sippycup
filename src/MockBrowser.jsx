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

const Iframe = styled('iframe')`
border:none; 
background: white; 
border-radius:0px 0px 15px 15px;
height: 85vh;
width: 100%;
`

export default function MockBrowser(props) {
    const extractedTitle = props.src ? props.src.match(/(?:<title>)(.*)(?:<\/title>)/)[1] : null;
    const title = extractedTitle ? extractedTitle : 'localhost'

    return (
        <>
        <Box sx={{padding:"15px", maxHeight:"100vh", height:"100vh"}}>
            
            {/* <Box sx={{background: "#202124", borderRadius:"15px 15px 0 0 "}}> */}
            <Box>
                <Stack alignItems='flex-end' sx={{background: '#202124', minHeight: '50px', borderRadius: '15px 15px 0 0'}} direction="row">
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
              <Button size="small" sx={{ minWidth: 0, marginLeft:"10px", marginBottom:"2.5px"}}><RefreshIcon></RefreshIcon></Button>
              <Input sx={{ margin: "5px 0 5px 5px",
                          border: "solid 2px #4AF", 
                          borderRadius: "50px",
                          padding: "0px 20px",
                          width: "80%",
                          "& .MuiInput-input": {
                              padding: 0
                          },
                          background: "#222"
                          }} 
                    size="small"  
                    disableUnderline
                    defaultValue="http://localhost:5000/"></Input>
            </Box>
            <Iframe title="Output" id="output" srcDoc={ props.src }></Iframe>
          </Box>
          </>
    )
}