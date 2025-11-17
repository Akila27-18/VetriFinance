
import React, { createContext, useContext, useEffect, useState } from 'react';


const DarkModeContext = createContext();


export function DarkModeProvider({ children }) {
const [dark, setDark] = useState(() => {
try {
const v = localStorage.getItem('vetri-dark');
return v ? JSON.parse(v) : false;
} catch { return false; }
});


useEffect(() => {
localStorage.setItem('vetri-dark', JSON.stringify(dark));
if (dark) document.documentElement.classList.add('dark');
else document.documentElement.classList.remove('dark');
}, [dark]);


return (
<DarkModeContext.Provider value={{ dark, setDark }}>
{children}
</DarkModeContext.Provider>
);
}


export function useDarkMode() {
return useContext(DarkModeContext);
}