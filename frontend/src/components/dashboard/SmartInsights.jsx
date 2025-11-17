import React from 'react';
import { motion } from 'framer-motion';


export default function SmartInsights({ summary=[], trend=[] }){
// Very light heuristics for demo
const top = summary[0];
const insight = top ? `Your ${top.name} spending is ${top.value}% of total this month.` : 'No spending data yet.';


return (
<motion.div initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
<div className="font-semibold mb-2">Smart Insights</div>
<div className="text-sm text-gray-600 dark:text-gray-300">{insight}</div>
<div className="mt-3 grid grid-cols-1 gap-2">
<div className="p-3 bg-[#FFF7F2] rounded">Try setting a budget for {top? top.name : 'categories'} to control spending.</div>
</div>
</motion.div>
);
}