import React from "react";

export const Tooltip: React.FC<{ content: string; children: React.ReactNode; }> = ({ content, children }) => {
    return (
        <div className="p-0">
            <div className="group relative w-max">
                {children}
                <span className="bg-white rounded-lg shadow-md px-2 py-1 text-sm pointer-events-none absolute -bottom-8 right-0 w-max opacity-0 transition-opacity group-hover:opacity-100">{content}</span>
            </div>
        </div>
    );
};
