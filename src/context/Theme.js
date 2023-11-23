import { createContext, useState } from 'react';

const themeCss = {
	dark: {
		filter: 'brightness(.6)',
	},
	light: {
		filter: 'brightness(1)',
	},
};


export const ThemeContext = createContext();

export const ThemeProvider =({children})=>{
    const [isDark,setIsDark] = useState(false);

    const toggleTheme = ()=>{
        setIsDark(!isDark);
    }

    const theme = isDark ? themeCss.dark : themeCss.light;

    return (
        <>
           <ThemeContext.Provider value={[{isDark,theme},toggleTheme]}>
            {children}
           </ThemeContext.Provider>
        </>
    )
}