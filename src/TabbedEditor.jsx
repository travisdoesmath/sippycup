import * as React from 'react';
import { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

import Editor from "@monaco-editor/react";

export function TabbedEditor(props) {
  const [fileName, setFileName] = useState(props.files[0].name)
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setFileName(fileNames[newValue])
  };

  const files = props.files;

  const file = files.filter(f => f.name === fileName)[0];

  const fileNames = props.files.map(file => file.name)

  const tabs = fileNames.map((name, i) => <Tab key={name} value={i} label={name}  />)

  return (
      <>
          <Box>
            <Stack direction="row" justifyContent="space-between">
              <Tabs value={value} onChange={handleChange} >
                { tabs }
              </Tabs>
                <Button sx={{height: "28px", 
                             marginTop: "auto", 
                             marginBottom: "auto", 
                             marginRight: '10px'}} 
                        size="small" 
                        variant="contained"
                        disabled = { !props.isReady }
                        onClick={ props.runHandler }>
                          { props.isReady ? <>{ 'Run' }<PlayArrowIcon /></> : 'Initializing...' }
                        </Button>
            </Stack>
            
          </Box>
          <Editor 
              height="45vh"
              theme="vs-dark"
              path={file.name}
              defaultLanguage={file.language}
              defaultValue={file.src}
              onChange={file.changeHandler}
              options={{
                overviewRulerBorder: false,
                overviewRulerLanes: 0,
                scrollBeyondLastLine: false,
                scrollbar: {
                  horizontal: 'visible',
                  vertical: 'visible'
                },
                minimap: {
                  enabled: false
                }
              }}

          />
      </>
  )
}

export default TabbedEditor;