import * as React from 'react';
import styled from '@emotion/styled';

const Pre = styled('pre')`
background-color: #1e1e1e;
color: #DDD;
font-family: Monaco, Monospace;
font-size: 14px;
min-height: 100%;
max-height: 100%;
margin:0;
padding: 10px 15px;
border-radius: 0 0 15px 15px;
overflow: auto;
`

function Console(props) {
    console.log(props)

    return (
        <>
            <div style={{borderRadius: '0 0 15px 15px', overflow: 'hidden', height: '100%'}}>
                <Pre>{ props.content }</Pre>
            </div>
        </>
    )

}

export default Console;