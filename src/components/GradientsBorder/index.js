import React from 'react';
import cls from './index.less'

export const GradientsBorder = (props) => {
    return (
        <div className={cls.border}>
            <div className={cls.background}>
                { props.children }
            </div>
        </div>
    );
}

