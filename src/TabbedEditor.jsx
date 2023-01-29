import * as React from 'react';
import { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

import Editor from "@monaco-editor/react";

export function TabbedEditor(props) {
  const [fileName, setFileName] = useState(props.files[0].name)

  const files = props.files;

  console.log('files: ', files)
  const file = files.filter(f => f.name === fileName)[0];

  const fileNames = props.files.map(file => file.name)

  const tabs = fileNames.map(name => <Tab key={name} label={name} onChange={() => setFileName(name)} />)

  return (
      <>
          <Box>
            { tabs }
          </Box>
          <Editor 
              height="40vh"
              theme="vs-dark"
              path={file.name}
              defaultLanguage={file.language}
              defaultValue={file.src}
              onChange={file.changeHandler}
          />
      </>
  )
}

// function a11yProps(index) {
//     return {
//       id: `simple-tab-${index}`,
//       'aria-controls': `simple-tabpanel-${index}`,
//     };
//   }

// function TabPanel(props) {
//     const { children, value, index, ...other } = props;
  
//     return (
//       <div
//         role="tabpanel"
//         hidden={value !== index}
//         id={`editor-tabpanel-${index}`}
//         aria-labelledby={`simple-tab-${index}`}
//         {...other}
//       >
//         {value === index && (
//           <Box sx={{height:'100%'}}>
//             {children}
//           </Box>
//         )}
//       </div>
//     );
//   }


// function TabbedEditor(props) {
//   const [value, setValue] = useState(0);
//   const [fileName, setFileName] = useState("script.js");

//   const handleChange = (event, newValue) => {
//     setValue(newValue);
//   };

//   const files = props.files;
//   const file = files[fileName]

//   const tabs = props.files.map(file => <Tab label={file.filename} {...a11yProps(0)}/>)
  
//   return (
//     <>
//       <Box sx={{display:'flex', flexDirection:'column', height:'100%'}}>
//         <Box sx={{flex: '0 0 auto'}}>
//           <Tabs value={value} onChange={handleChange} aria-label="editor file tabs">
//             { tabs }
//           </Tabs>
//         </Box>
//       </Box>
//       <Box sx={{flex: 1}}>
//         <Editor
//         height="100%"
//         defaultLanguage={file.language}
//         defaultValue={file.initialSrc}
//         theme="vs-dark"
//         />
//       </Box>
      
//     </>
    
//   )
      
// }

// function TabbedEditor(props) {
//     const [value, setValue] = React.useState(0);
    
//     const handleChange = (event, newValue) => {
//       setValue(newValue);
//     };

//     const tabs = props.tabs.map(tab => <Tab label={tab.filename} {...a11yProps(0)}/>)
//     const editors = props.tabs.map((tab, i) => <>
//       <TabPanel value={value} index={i} className="editor-tab">
//         <Editor
//           height="100%"
//           defaultLanguage={tab.language}
//           defaultValue={tab.initialSrc}
//           theme="vs-dark"
//           onChange={tab.changeHandler}
//         />
//       </TabPanel>
//     </>)

//     return (
//       <>
//         <Box sx={{display:'flex', flexDirection:'column', height:'100%'}}>
//           <Box sx={{flex: '0 0 auto'}}>
//             <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
//                 { tabs }
//             </Tabs>
//           </Box>
//           <Box sx={{flex: 1}}>
//             { editors }
//           </Box>
//         </Box>
//         </>
//     );     
// }

export default TabbedEditor;