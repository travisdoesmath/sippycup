import * as React from 'react';
import styled from '@emotion/styled';

const Pre = styled('pre')`
background-color: #222;
color: #fff;
font-family: Monaco, Monospace;
min-height: 100%;
margin:0;
`

function Console(props) {
    console.log(props)

    return <Pre style={{padding: "5px 15px", fontSize: "14px"}}>{ props.content }</Pre>

}

export default Console;