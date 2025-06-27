"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import robot from "../../public/lottie/robot.json"; 
import MoodsPage from "../app/Moods/Moods"; 

const purples = ["#8b1ede", "#a472e2", "#a73ecd", "#bf69ce", "#9c8cf7", "#b421e6", "#8456dd"];
const pinks = ["#de6ca9", "#c660b7", "#c95aa2"];

function getRandomGradient() {
  const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
  return `linear-gradient(135deg, ${getRandom(purples)}, ${getRandom(pinks)}, ${getRandom(purples)})`;
}

export default function HomePage() {
  const [gradient, setGradient] = useState("");
  const [name, setName] = useState("");
  const moodRef = useRef(null);

  useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");

  if (token) {
    localStorage.setItem("spotify_token", token);
    window.history.replaceState({}, document.title, "/");
  }
}, []);


  useEffect(() => {
    setGradient(getRandomGradient());
  }, []);

  const scrollToMood = () => {
    if (name.trim()) {
      localStorage.setItem("magicMoodName", name);
      moodRef.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      alert("Please enter your name first ✨");
    }
  };

  return (
    <main className="w-full min-h-screen overflow-x-hidden" style={{ background: gradient }}>
      {/* Hero Section */}
      <section className="h-screen flex flex-col items-center justify-center relative z-10">
        {/* Magic Text Animation */}
        <motion.div
          className="text-white text-xl text-center mb-6 flex flex-wrap justify-center max-w-[90%]"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.05 },
            },
          }}
          initial="hidden"
          animate="visible"
        >
          {"Welcome to Magic Mood... Enter your name...".split("").map((c, i) => (
            <motion.span
              key={i}
              variants={{
                hidden: { opacity: 0, y: -20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { type: "spring", stiffness: 300, damping: 20 },
                },
              }}
              className="text-pink-200 font-semibold"
            >
              {c === " " ? "\u00A0" : c}
            </motion.span>
          ))}
        </motion.div>

        {/* Polaroid Box */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white/10 backdrop-blur-xl border border-white/30 p-4 w-72 rounded-xl shadow-2xl"
        >
          <div className="w-64 h-64 mx-auto">
            <Lottie animationData={robot} loop />
          </div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name..."
            className="mt-3 px-3 py-2 w-full bg-white/30 rounded focus:outline-none focus:ring-2 focus:ring-pink-400 text-black border border-white/30 placeholder-white/70"
          />
          <motion.button
            onClick={scrollToMood}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="mt-4 px-5 py-2 bg-pink-400 text-white rounded-lg text-lg font-bold shadow-md"
          >
            Enter
          </motion.button>
        </motion.div>
      </section>

      {/* Scroll Target: Moods Section */}
      <div ref={moodRef}>
        <MoodsPage name={name} />
      </div>
    </main>
  );
}
