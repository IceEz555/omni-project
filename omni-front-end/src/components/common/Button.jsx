import React from 'react';
import './common.css'; // We'll create a single CSS file for common components or individual ones. Let's assume common.css for now or just inline styles if simple, but better to have classNames.
// Actually, looking at the plan, I didn't specify CSS files. 
// I should probably check if there is a global css I can reuse or create specific ones. 
// The user previously asked to extract styles to CSS. I should probably follow that pattern.
// Let's create `src/components/common/common.css` for these components.

export const Button = ({
    children,
    onClick,
    variant = '',
    className = '',
    disabled = false,
    type = 'button',
    style = {}
}) => {
    return (
        <button
            type={type}
            className={className}
            onClick={onClick}
            disabled={disabled}
            style={style}
        >
            {children}
        </button>
    );
};
