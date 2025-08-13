
let url;

if (typeof window !== "undefined") {
 
  if (window.location.hostname === "localhost") {
    url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`;
  } else {
    url = "/api/generate";
  }
} else {
  url = "/api/generate";
}

export { url };
