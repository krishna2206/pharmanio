import React from 'react';
import { ThemedText } from './ThemedText';

interface SectionHeaderProps {
    title: string;
    className?: string;
}

export function SectionHeader({ title, className = '' }: SectionHeaderProps) {
    return (
        <ThemedText className={`text-xl font-semibold mb-2 text-left w-full max-w-md ${className}`}>
            {title}
        </ThemedText>
    );
}