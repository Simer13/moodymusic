export const fetchPexelsImage = async (query: string) => {
  try {
    const res = await fetch(`https://api.pexels.com/v1/search?query=${query}&per_page=1`, {
      headers: {
        Authorization: process.env.NEXT_PUBLIC_PEXELS_API_KEY!,
      },
      cache: "force-cache", // Optional: speeds up repeated queries
    });

    const data = await res.json();
    const image = data?.photos?.[0]?.src?.large2x;

    return image || "/fallback.jpg"; // Add a fallback image in public/
  } catch (error) {
    console.error("Pexels fetch error:", error);
    return "/fallback.jpg";
  }
};
