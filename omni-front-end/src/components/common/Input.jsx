import React from 'react';
import './common.css';

export const Input = ({
    label,
    name,
    type = 'text',
    placeholder = '',
    value,
    onChange,
    disabled = false,
    className = '',
    style = {},
    rows, // For textarea
    required = false
}) => {
    return (
        <div className={`common-input-group ${className}`} style={style}>
            {label && <label className="common-input-label">{label} {required && <span className="required">*</span>}</label>}
            {type === 'textarea' ? (
                <textarea
                    name={name}
                    className="common-input-field"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    rows={rows || 3}
                />
            ) : (
                <input
                    type={type}
                    name={name}
                    className="common-input-field"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                />
            )}
        </div>
    );
};

export const Select = ({
    label,
    name,
    value,
    onChange,
    options = [],
    disabled = false,
    className = '',
    children // allow custom options
}) => {
    return (
        <div className={`common-input-group ${className}`}>
            {label && <label className="common-input-label">{label}</label>}
            <select
                name={name}
                className="common-input-field"
                value={value}
                onChange={onChange}
                disabled={disabled}
            >
                {options.length > 0 ? options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                )) : children}
            </select>
        </div>
    )
}
