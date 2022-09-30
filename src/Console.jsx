import * as React from 'react';
import styled from '@emotion/styled';

const Pre = styled('pre')`
background-color: #222;
color: #fff;
font-family: Monaco, Monospace;
min-height: 100%;
margin:0;
`

function Console() {
    const [content, setContent] = React.useState("");

    const appendOutput = (output) => {
        const currentContent = content;
        setContent(currentContent + output);
    }

    return <Pre>console</Pre>

}

export default Console;