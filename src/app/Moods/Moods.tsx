/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { fetchPexelsImage } from "../../../lib/pexels";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";


const moods = [
  "Romantic", "Sad", "Happy", "Dance", "Angry",
  "Desi Beats", "Item Songs", "Girly Pop", "Naughty"
];

const genres = [
  "Country", "Jazz", "Lo-fi", "Techno",
  "Chill", "EDM", "Classical", "Rock"
];


const Card = ({
  label,
  image,
  onClick,
}: {
  label: string;
  image: string;
  onClick: () => void;
}) => (
  <motion.div
    onClick={onClick}
    whileHover={{ scale: 1.05, rotateX: 3, rotateY: 3 }}
    className="relative w-full h-64 rounded-2xl overflow-hidden shadow-xl cursor-pointer backdrop-blur-lg bg-white/10 border border-white/20 transition-transform duration-300"
    style={{ perspective: 1000 }}
  >
    <img
      src={image}
      alt={label}
      className="absolute w-full h-full object-cover z-0 opacity-40"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-lg font-semibold z-20 drop-shadow-md text-center px-2">
      {label}
    </div>
  </motion.div>
);

export default function MoodsPage({ name }: { name: string }) {
  const router = useRouter();
  const [moodImages, setMoodImages] = useState<{ [key: string]: string }>({});
  const [genreImages, setGenreImages] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const moodResults: any = {};
      const genreResults: any = {};

      for (const mood of moods) {
        moodResults[mood] = await fetchPexelsImage(`${mood} music aesthetic`);
      }
      for (const genre of genres) {
        genreResults[genre] = await fetchPexelsImage(`${genre} music aesthetic`);
      }

      setMoodImages(moodResults);
      setGenreImages(genreResults);
      setLoading(false);
    };

    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white text-xl">
        Loading your magic mood... ✨
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 via-pink-700 to-purple-900 px-6 py-10 text-white">
      <h1 className="text-4xl font-bold text-center mb-10 drop-shadow-xl">
        Hi {name}, choose your vibe 🎧
      </h1>

      <section>
        
        <h2 className="text-2xl font-semibold mb-4">✨ Moods</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-12">
          {moods.map((mood) => (
            <Card
              key={mood}
              label={mood}
              image={moodImages[mood] || "/fallback.jpg"}
              onClick={() => router.push(`/player/mood/${encodeURIComponent(mood)}`)}
            />
          ))}
        </div>

       
        <h2 className="text-2xl font-semibold mb-4">🎼 Genres</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {genres.map((genre) => (
            <Card
              key={genre}
              label={genre}
              image={genreImages[genre] || "/fallback.jpg"}
              onClick={() => router.push(`/player/genre/${encodeURIComponent(genre)}`)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
