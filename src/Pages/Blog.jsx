import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  updateDoc,
} from "firebase/firestore";
import { Calendar, ArrowUpRight, ThumbsUp } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Blog = () => {
  const [blogs, setBlogs] = useState([]); // Blog data
  const [loading, setLoading] = useState(true); // Loading state
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const itemsPerPage = 6;

  // ✅ Fetch all blogs from Firebase
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "blogs"), orderBy("date", "desc"));
      const querySnapshot = await getDocs(q);
      const blogsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setBlogs(blogsData);
      console.log("Blogs fetched:", blogsData);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Initial data load for blogs
  useEffect(() => {
    fetchBlogs(); // Fetch all blogs initially
  }, []);

  // ✅ Initialize AOS for animations
  useEffect(() => {
    AOS.init({ once: true });
  }, []);

  // ✅ Pagination Logic
  const indexOfLastBlog = currentPage * itemsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - itemsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

  // ✅ Pagination Change
  const nextPage = () => setCurrentPage(currentPage + 1);
  const prevPage = () => setCurrentPage(currentPage - 1);

  // ✅ Handle Like Button
  const handleLike = async (id, likes) => {
    try {
      const blogRef = doc(db, "blogs", id);
      await updateDoc(blogRef, { likes: likes + 1 });
      const updatedBlogs = blogs.map((blog) =>
        blog.id === id ? { ...blog, likes: likes + 1 } : blog
      );
      setBlogs(updatedBlogs);
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  return (
    <div
      className="min-h-screen py-16 px-[5%] sm:px-[10%] bg-[#030014] text-white"
      id="Blog"
    >
      {/* Header */}
      <div className="text-center mb-12">
        <h2
          className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]"
          data-aos="fade-up"
          data-aos-duration="600"
        >
          Blogs
        </h2>
        <p
          className="mt-2 text-gray-400 max-w-2xl mx-auto text-base sm:text-lg"
          data-aos="fade-up"
          data-aos-duration="800"
        >
          Insights, tutorials, and updates from my journey as a developer.
        </p>
      </div>

      {/* ✅ Blog Posts */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} height={300} className="rounded-lg" />
          ))}
        </div>
      ) : currentBlogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentBlogs.map((blog) => (
            <div
              key={blog.id}
              className="relative group bg-gray-900/50 backdrop-blur-lg rounded-2xl p-6 border border-white/10 overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              data-aos="fade-up"
              data-aos-duration="1000"
            >
              {/* Blog Image */}
              <div className="relative h-48 rounded-lg overflow-hidden mb-4">
                <img
                  src={
                    blog.image ||
                    "https://via.placeholder.com/400x200?text=Blog+Image"
                  }
                  alt={blog.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/400x200?text=Image+Not+Found";
                  }}
                />
              </div>

              {/* Blog Title */}
              <h3 className="text-xl font-bold text-white mb-2">{blog.title}</h3>

              {/* Blog Metadata */}
              <div className="flex items-center text-gray-400 text-sm mb-4">
                <Calendar className="w-4 h-4 mr-2" />
                <span>
                  {new Date(blog.date?.toDate()).toLocaleDateString()}
                </span>
              </div>

              {/* Blog Excerpt */}
              <p className="text-gray-400 text-sm mb-4">{blog.excerpt}</p>

              {/* Like Button */}
              <div className="flex items-center gap-4 mb-4">
                <button
                  onClick={() => handleLike(blog.id, blog.likes || 0)}
                  className="flex items-center gap-2 text-gray-400 hover:text-white"
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>{blog.likes || 0} Likes</span>
                </button>
              </div>

              {/* Read More Button */}
              <a
                href={blog.link || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-[#a855f7] hover:text-[#6366f1] transition-colors"
              >
                <span className="mr-2">Read More</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400">
          No blog posts available.
        </div>
      )}

    </div>
  );
};

export default Blog;
