import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
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
          <Box>
            <Typography>{children}</Typography>
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


function TabbedEditor() {
    const [value, setValue] = React.useState(0);
    const [pythonSrc, setPythonSrc] = React.useState(pythonStarterSrc)

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    return (
        <>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="app.py" {...a11yProps(0)}/>
                    <Tab label="index.html" {...a11yProps(0)}/>
                    <Tab label="style.css" {...a11yProps(0)}/>
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <Editor
                height="50vh"
                defaultLanguage="python"
                defaultValue={ pythonSrc }
                theme='vs-dark'
                />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <Editor
                height="50vh"
                defaultLanguage="html"
                defaultValue="// html template"
                theme='vs-dark'
                />
            </TabPanel>
            <TabPanel value={value} index={2}>
            <Editor
                height="50vh"
                defaultLanguage="css"
                defaultValue="// css"
                theme='vs-dark'
                />
            </TabPanel>
        
            <Tab name="app.py"></Tab>
            <Tab name="index.html"></Tab>
            <Tab name="style.css"></Tab>
        </>
    );     
}

export default TabbedEditor;