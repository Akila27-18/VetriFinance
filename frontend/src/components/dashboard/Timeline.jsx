import React from 'react';
import { motion } from 'framer-motion';


export default function Timeline({ events=[] }){
return (
<div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
<div className="font-semibold mb-3">Recent Activity</div>
<div className="space-y-3">
{events.map((ev,i)=> (
<motion.div key={i} initial={{opacity:0,x:10}} animate={{opacity:1,x:0}} className="flex items-start gap-3">
<div className="w-2 h-2 rounded-full bg-[#FF6A00] mt-2" />
<div>
<div className="text-sm font-medium">{ev.title}</div>
<div className="text-xs text-gray-500 dark:text-gray-400">{ev.time}</div>
</div>
</motion.div>
))}
</div>
</div>
);
}