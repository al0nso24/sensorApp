//Tokens de diseño compartidos por todos los componentes.
export const colors = {
    background: '#F4F6FA',
    surface: '#FFFFFF',
    primary: '#1E5EFF',
    primaryText: '#FFFFFF',
    text: '#1B1F2A',
    muted: '#6B7280',
    border: '#E3E7EF',
    success: '#12805C',
    danger: '#C62828',
    dangerSoft: '#FDECEC',
    warningSoft: '#FFF6E0',
    warning: '#8A5A00',
};

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 };
export const radius = { md: 12, lg: 16 };

export const typography = {
    title: { 
        fontSize: 24, 
        fontWeight: '700', 
        color: colors.text 
    },

    cardTitle: { 
        fontSize: 16, 
        fontWeight: '700', 
        color: colors.text 
    },

    label: { 
        fontSize: 14, 
        color: colors.muted 
    },

    value: { fontSize: 16, 
        fontWeight: '600', 
        color: colors.text, 
        fontVariant: ['tabular-nums'] 
    },

    caption: { fontSize: 12, 
        color: colors.muted 
    },
};