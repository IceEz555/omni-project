import React from 'react';
import './common.css';

export const Card = ({
    children,
    title,
    className = '',
    titleClassName = '',
    style = {},
    headerAction
}) => {
    return (
        <div className={`common-card ${className}`} style={style}>
            {(title || headerAction) && (
                <div className="common-card-header">
                    {title && <h3 className={`common-card-title ${titleClassName}`}>{title}</h3>}
                    {headerAction && <div className="common-card-action">{headerAction}</div>}
                </div>
            )}
            <div className="common-card-body">
                {children}
            </div>
        </div>
    );
};
