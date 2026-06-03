
import "./globals.css";
import { AuthProvider } from "../context/AuthContext.js";
import QueryProvider from "../Provider/QueryProvider.js";

export const metadata = {
  title: "Cinesocial-A platform for cinephiles",
  description: "Cinesocial is a movie-focused social media platform where users can share their love for films, discover new movies, and connect with fellow movie enthusiasts. Join our community to get personalized movie recommendations, read and write reviews, participate in discussions, and create your own watchlist. Whether you're a casual viewer or a cinephile, Cinesocial is the perfect place to explore the world of cinema together.",
  keywords : "movies, social, social media, chat, online community, cinesocial, movie recommendations, movie reviews, movie discussions, movie ratings, movie watchlist, movie community",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
      >
        <QueryProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
