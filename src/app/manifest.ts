import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Play In Code — программирование для детей 7–16",
    short_name: "Play In Code",
    description:
      "Индивидуальные онлайн-курсы программирования для детей 7–16 лет: Scratch, Roblox, Python.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#60C849",
    icons: [
      {
        src: "/icon.png",
        sizes: "480x480",
        type: "image/png",
      },
      {
        src: "/apple-icon.png",
        sizes: "480x480",
        type: "image/png",
      },
    ],
  };
}
