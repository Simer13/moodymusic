interface YouTubeSearchItem {
  id: {
    videoId: string;
  };
  snippet: {
    liveBroadcastContent?: string;
  };
}

export async function fetchYoutubeVideoId(query: string): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
  if (!apiKey) {
    console.error("YouTube API key is missing.");
    return "dQw4w9WgXcQ";
  }

  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=5&key=${apiKey}`
    );
    if (!res.ok) throw new Error(`YouTube API error: ${res.status}`);
    const data = await res.json();

    const video = Array.isArray(data?.items)
      ? (data.items as YouTubeSearchItem[]).find((item) => !item.snippet?.liveBroadcastContent)
      : null;

    return video?.id?.videoId || "dQw4w9WgXcQ";
  } catch (err) {
    console.error("Failed to fetch YouTube video:", err);
    return "dQw4w9WgXcQ";
  }
}
