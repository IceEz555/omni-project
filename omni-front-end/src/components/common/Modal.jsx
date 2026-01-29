import React from 'react';
import './common.css';

export const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    className = '',
    footer
}) => {
    if (!isOpen) return null;

    return (
        <div className="common-modal-overlay" onClick={onClose}>
            <div className={`common-modal-content ${className}`} onClick={e => e.stopPropagation()}>
                <div className="common-modal-header">
                    <h3 className="common-modal-title">{title}</h3>
                    <button className="common-modal-close" onClick={onClose}>&times;</button>
                </div>
                <div className="common-modal-body">
                    {children}
                </div>
                {footer && (
                    <div className="common-modal-footer">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};
