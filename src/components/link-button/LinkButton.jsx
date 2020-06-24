import React from 'react';

function LinkButton(props){
    return (
        <button {...props} style={{
            backgroundColor:'transparent',
            border:'none',
            outline:'none',
            cursor:'pointer',
            color:'#1890ff'
        }}></button>
    )
}
 
export default LinkButton;