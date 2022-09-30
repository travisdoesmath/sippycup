import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

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

const pythonStarterSrc = `from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")
`


function TabbedEditor(props) {
    const [value, setValue] = React.useState(0);
    const [pythonSrc, setPythonSrc] = React.useState(pythonStarterSrc)

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    return (
      <>
        <Box sx={{display:'flex', flexDirection:'column', height:'100%'}}>
          <Box sx={{flex: '0 0 auto'}}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab label="app.py" {...a11yProps(0)}/>
                <Tab label="index.html" {...a11yProps(0)}/>
                <Tab label="style.css" {...a11yProps(0)}/>
            </Tabs>
          </Box>
          <Box sx={{flex: 1}}>
            <TabPanel value={value} index={0} className="editor-tab">
                <Editor
                height="100%"
                defaultLanguage="python"
                defaultValue={ pythonSrc }
                theme='vs-dark'
                />
            </TabPanel>
            <TabPanel value={value} index={1} className="editor-tab">
                <Editor
                height="100%"
                defaultLanguage="html"
                defaultValue="// html template"
                theme='vs-dark'
                />
            </TabPanel>
            <TabPanel value={value} index={2} className="editor-tab">
              <Editor
                  height="100%"
                  defaultLanguage="css"
                  defaultValue="/* css */"
                  theme='vs-dark'
                  />
            </TabPanel>
          </Box>
        </Box>
        </>
    );     
}

export default TabbedEditor;