import { useEffect, useRef, useState } from "react";
import "./App.css";
import { url } from "./constants";

import RecentSearch from "./components/RecentSearch";
import QuestionAnswer from "./components/QuestionAnswer";

export default function App() {
  const [question, setQuestion] = useState("");

  const [result, setResult] = useState([]);
  const [recentHistory, setRecentHistory] = useState(
    JSON.parse(localStorage.getItem("history")) || []
  );
  
  const [selectedHistory,setSelectedHistory]=useState('');

  const scrollToAns= useRef();

  const [loader, setLoader]=useState(false);

  const [showSidebar, setShowSidebar] = useState(false);

const askQuestion = async () => {
  const query = (question || selectedHistory || "").trim();

  if (query.length < 2) {
    setResult((prev) => [
      ...prev,
      { type: "q", text: query || "[Empty]" },
      { type: "a", text: ["Please enter a longer question."] },
    ]);
    return;
  }

  // if (question) {
  //   let history = JSON.parse(localStorage.getItem("history") || "[]");
  //   history = [query, ...history.filter((item) => item !== query)];
  //   history = history.slice(0, 20).map(
  //     (item) => item.charAt(0).toUpperCase() + item.slice(1).trim()
  //   );
  //   localStorage.setItem("history", JSON.stringify(history));
  //   setRecentHistory(history);
  // }

  if (question) {
  let history = JSON.parse(localStorage.getItem("history") || "[]");

 
  const normalizedQuery = query.trim().toLowerCase();


  history = history.filter(
    (item) => item.trim().toLowerCase() !== normalizedQuery
  );

  history = [query, ...history]
    .slice(0, 20)
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1).trim());

  localStorage.setItem("history", JSON.stringify(history));
  setRecentHistory(history);
}


  const payload = {
    contents: [
      {
        role: "user", 
        parts: [{ text: query }],
      },
    ],
  };

  setLoader(true);

  try {
    let response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error(`API request failed: ${response.status}`);

    const data = await response.json();

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "[No answer returned by API]";

    setResult((prev) => [
      ...prev,
      { type: "q", text: query },
      { type: "a", text: text.split("* ").map((item) => item.trim()) },
    ]);

    setQuestion("");
    setTimeout(() => {
      scrollToAns.current.scrollTop = scrollToAns.current.scrollHeight;
    }, 300);
  } catch (err) {
    setResult((prev) => [
      ...prev,
      { type: "q", text: query },
      { type: "a", text: [`Error: ${err.message}`] },
    ]);
  } finally {
    setLoader(false);
  }
};



  const isEnter=(event)=>{
   
    if(event.key=='Enter'){
      askQuestion();
    }
    
  }

  

  useEffect(() => {
  if (selectedHistory.trim()) {
    askQuestion();
  }
}, [selectedHistory]);



  const [darkmode, setDarkMode]=useState('dark');

  useEffect(()=>{
   
    if(darkmode=='dark'){
      document.documentElement.classList.add('dark')
    }
    else{
      document.documentElement.classList.remove('dark')

    }

  },[darkmode])
  useEffect(() => {
  localStorage.setItem("history", JSON.stringify(recentHistory));
}, [recentHistory]);

  return (
  <div className={darkmode=='dark'?'dark':'light'}>
  <div className="flex flex-col md:grid md:grid-cols-5 h-screen text-center">
    
    <div className="md:hidden p-2 flex items-center justify-between gap-3">
      <button
        onClick={() => setShowSidebar(!showSidebar)}
        className="px-4 py-2 rounded-lg dark:bg-zinc-800 dark:text-white bg-red-100 text-zinc-700"
      >
        {showSidebar ? "Hide Recent Searches" : "Show Recent Searches"}
      </button>

      <div className="rounded-full shadow border border-red-100 dark:border-zinc-700 bg-red-100 dark:bg-zinc-800">
        <select
          value={darkmode}
          onChange={(e) => setDarkMode(e.target.value)}
          className="appearance-none bg-transparent px-3 py-2 pl-4 pr-4 rounded-full text-sm font-medium text-zinc-700 dark:text-zinc-100 focus:outline-none"
        >
          <option className="text-zinc-800" value="dark">Dark</option>
          <option className="text-zinc-800"value="light">Light</option>
        </select>
      </div>
    </div>

    
    <select 
      value={darkmode}
      onChange={(event)=>setDarkMode(event.target.value)} 
      className="hidden md:block fixed dark:text-white text-zinc-800 bottom-0 p-5 border-none outline-none"
    >
      <option className="text-zinc-800" value="dark">Dark</option>
      <option className="text-zinc-800" value="light">Light</option>
    </select>

    {showSidebar && (
      <div className="md:hidden">
        <RecentSearch 
          recentHistory={recentHistory} 
          setRecentHistory={setRecentHistory} 
          setSelectedHistory={setSelectedHistory}
        />
      </div>
    )}

    <div className="hidden md:block">
      <RecentSearch 
        recentHistory={recentHistory} 
        setRecentHistory={setRecentHistory} 
        setSelectedHistory={setSelectedHistory}
      />
    </div>

    <div className="flex-1 md:col-span-4 p-4 md:p-10">
      <h1 className="text-2xl md:text-4xl p-2 bg-clip-text text-transparent bg-gradient-to-r from-pink-700 to-violet-700">
        Hello User, Ask me Anything!
      </h1>
      
      {loader ? (
        <div role="status">
          <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-purple-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C0 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      ) : null}
       
      <div ref={scrollToAns} className="container h-130 overflow-scroll hide-scrollbar">
        <div className="dark:text-zinc-300 text-zinc-800">
          <ul>
            {result.map((item, idx) => (
              <QuestionAnswer key={idx} item={item} idx={idx}/>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="dark:bg-zinc-800 bg-red-100 w-full md:w-1/2 p-1 pr-6 pl-3 dark:text-white text-zinc-800 m-auto rounded-4xl border border-zinc-600 flex h-16 mt-1">
        <input
          type="text"
          value={question}
          onKeyDown={isEnter}
          onChange={(event) => setQuestion(event.target.value)}
          className="w-full h-full p-3 outline-none"
          placeholder="Ask me anything"
        />
        <button onClick={askQuestion}>Ask</button>
      </div>
    </div>
  </div>
</div>



    
  );
}
