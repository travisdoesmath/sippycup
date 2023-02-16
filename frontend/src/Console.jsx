import * as React from 'react';
import styled from '@emotion/styled';

const Pre = styled('pre')`
display: flex;
flex-direction: column-reverse;
background-color: #1e1e1e;
color: #DDD;
font-family: Monaco, Monospace;
font-size: 14px;
min-height: 100%;
max-height: 0;
margin:0;
padding: 10px 15px;
border-radius: 0 0 15px 15px;
overflow: scroll;
`

function Console(props) {
    return (
        <>
            <div style={{borderRadius: '0 0 15px 15px', overflow: 'hidden', height: '100%'}}>
                <Pre>{ props.content }</Pre>
            </div>
        </>
    )
}

export default Console;