import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

import Editor from "@monaco-editor/react";

function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`editor-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{height:'100%'}}>
            {children}
          </Box>
        )}
      </div>
    );
  }


function TabbedEditor(props) {
  console.log('props', props)
    const [value, setValue] = React.useState(0);
    
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    const tabs = props.tabs.map(tab => <Tab label={tab.filename} {...a11yProps(0)}/>)
    const editors = props.tabs.map((tab, i) => <>
      <TabPanel value={value} index={i} className="editor-tab">
        <Editor
          height="100%"
          defaultLanguage={tab.language}
          defaultValue={tab.initialSrc}
          theme="vs-dark"
        />
      </TabPanel>
    </>)

    return (
      <>
        <Box sx={{display:'flex', flexDirection:'column', height:'100%'}}>
          <Box sx={{flex: '0 0 auto'}}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                { tabs }
            </Tabs>
          </Box>
          <Box sx={{flex: 1}}>
            { editors }
          </Box>
        </Box>
        </>
    );     
}

export default TabbedEditor;