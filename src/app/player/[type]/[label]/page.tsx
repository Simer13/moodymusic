/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { fetchYoutubeVideoId } from "../../../../../lib/youtube";
import dynamic from "next/dynamic";
import { Canvas } from "@react-three/fiber";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Music,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const PolaroidCard = dynamic(() => import("@/components/ui/GlassPolaroidCard"), { ssr: false });

const moodKeywords: Record<string, string> = {
  Romantic: "romantic love ballads soft pop heartbreak",
  Sad: "emotional slow acoustic heartbreak",
  Happy: "feel good upbeat joyful sunshine pop",
  Dance: "dance party edm electro pop",
  Angry: "aggressive rock metal rage rap",
  "Desi Beats": "punjabi bollywood indian bhangra",
  "Item Songs": "bollywood item dance masala hits",
  "Girly Pop": "female pop anthems girl power kpop korean japanese chinese",
  Naughty: "sultry bold explicit sensual pop"
};

const genreKeywords: Record<string, string> = {
  Country: "country guitar americana folk",
  Jazz: "jazz instrumental smooth saxophone",
  "Lo-fi": "lofi chill beats study relax",
  Techno: "techno rave electronic club",
  Chill: "chill ambient relax downtempo",
  EDM: "edm electro dance house trap",
  Classical: "classical orchestra symphony instrumental",
  Rock: "rock alternative indie grunge"
};


export default function PlayerPage() {
  const params = useSearchParams();
  const label = params.get("label") || "";
const [searchQuery, setSearchQuery] = useState("");
  const [tracks, setTracks] = useState<any[]>([]);
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [ytId, setYtId] = useState<string>("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const polaroidRef = useRef<HTMLDivElement>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("spotify_token") : "";

  const fetchSpotifyTracks = async (query: string, offset = 0) => {
    const res = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=20&offset=${offset}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await res.json();
    return data.tracks?.items || [];
  };

  useEffect(() => {
    if (!token) {
      window.location.href = "/api/login";
      return;
    }

    if (label) {
    const keywords = moodKeywords[label] || genreKeywords[label] || label;
    const fullQuery = `${keywords} music`;
    setSearchQuery(fullQuery); // store for reuse

    fetchSpotifyTracks(fullQuery, 0).then(results => {
      setTracks(results);
      setOffset(results.length);
    });
  }
}, [label, token]);

  const loadMore = async () => {
    setIsLoading(true);
    const newTracks = await fetchSpotifyTracks(label + " music", offset);
    setTracks(prev => [...prev, ...newTracks]);
    setOffset(prev => prev + newTracks.length);
    setIsLoading(false);
  };

  const playTrack = async (track: any) => {
    setCurrentTrack(track);
    setIsPlaying(true);

    try {
      const videoId = await fetchYoutubeVideoId(track.name + " music video");
      setYtId(videoId);
    } catch (err) {
      console.error("YouTube fetch failed", err);
      setYtId("");
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(prev => !prev);
  };

  const skipTrack = async (direction: "next" | "prev") => {
    if (!currentTrack) return;
    const currentIndex = tracks.findIndex(t => t.uri === currentTrack.uri);
    let newIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;
    if (newIndex >= tracks.length) newIndex = 0;
    if (newIndex < 0) newIndex = tracks.length - 1;
    playTrack(tracks[newIndex]);
  };

  const handleMouseMove = (e: any) => {
    if (polaroidRef.current) {
      const rect = polaroidRef.current.getBoundingClientRect();
      const x = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
      const y = (e.clientY - (rect.top + rect.height / 2)) / rect.height;
      setMousePosition({ x: x * 2, y: -y * 2 });
    }
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background YouTube Video */}
      {ytId && (
        <div className="fixed inset-0 w-full h-full -z-10">
          <iframe
            className="absolute top-1/2 left-1/2 w-[130%] h-[130%] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=0&modestbranding=1&rel=0`}
            allow="autoplay; encrypted-media"
            style={{
              filter: "blur(1px) brightness(0.5)",
              opacity: 0.3,
            }}
          />
        </div>
      )}

      {/* Overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-black/40 via-gray-900/30 to-black/60 -z-5" />

      <div className="relative z-10 flex h-full p-6 gap-8">
        {/* Sidebar */}
        <Card className="w-96 bg-black/70 backdrop-blur-xl border-white/30 flex flex-col shadow-2xl">
          <div className="p-6 border-b border-white/30">
            <div className="flex items-center gap-3 mb-3">
              <Music className="w-6 h-6 text-white" />
              <h2 className="text-2xl text-white font-light">{label}</h2>
            </div>
            <p className="text-sm text-gray-300">{tracks.length} songs</p>
          </div>

          <ScrollArea className="px-4 h-[calc(100vh-300px)] overflow-y-auto">
            {tracks.map((track, index) => (
              <div
                key={`${track.uri}-${index}`} // ensure unique key
                className="flex items-center justify-between py-3 text-white border-b border-white/10 cursor-pointer hover:bg-white/10 transition"
                onClick={() => playTrack(track)}
              >
                <div className="truncate">{track.name}</div>
                <Play className="w-4 h-4 text-green-400" />
              </div>
            ))}
          </ScrollArea>

          <div className="p-6">
            <Button onClick={loadMore} disabled={isLoading} className="w-full">
              {isLoading ? "Loading..." : "Load More"}
            </Button>
          </div>
        </Card>

        {/* 3D Player */}
        <div className="flex-1 flex flex-col justify-center items-center gap-12">
          {currentTrack && (
            <>
              <div
                ref={polaroidRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="w-96 h-[500px]"
              >
                <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
                  <ambientLight intensity={0.8} />
                  <pointLight position={[5, 5, 5]} />
                  <PolaroidCard
                    songTitle={currentTrack.name}
                    artistName={currentTrack.artists.map((a: any) => a.name).join(", ")}
                    albumCoverUrl={currentTrack.album.images[0].url}
                    mousePosition={mousePosition}
                  />
                </Canvas>
              </div>

              <Card className="bg-black/60 p-6 border-white/20">
                <div className="text-center text-white mb-4">
                  <h3 className="text-xl">{currentTrack.name}</h3>
                  <p className="text-sm text-gray-300">
                    {currentTrack.artists.map((a: any) => a.name).join(", ")}
                  </p>
                </div>
                <div className="flex gap-6 justify-center">
                  <Button onClick={() => skipTrack("prev")}>
                    <SkipBack />
                  </Button>
                  <Button onClick={togglePlayPause}>
                    {isPlaying ? <Pause /> : <Play />}
                  </Button>
                  <Button onClick={() => skipTrack("next")}>
                    <SkipForward />
                  </Button>
                </div>

                {/* Optional audio fallback */}
                {currentTrack?.preview_url && (
                  <audio autoPlay controls className="hidden" src={currentTrack.preview_url} />
                )}
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
