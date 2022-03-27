import React, { useState, useEffect } from 'react';
import { Row } from 'antd'

export const CircleDot = (props) => {
    const { fontSize, text, color, textStyle } = props
    
    const styles= {
        dot: {
            width: fontSize || 8,
            height: fontSize || 8,
            display: 'inline-block',
            borderRadius: fontSize || 8,
            marginRight: 8,
        }
    }

    return (
        <span>
            <Row align="middle">
                <span style={{...styles.dot, backgroundColor: color || '#ccc'}}></span>
                <span style={textStyle}>{ text }</span>
            </Row>
        </span>
    );
}

