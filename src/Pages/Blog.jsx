import React, { useEffect, useState } from "react";
import { db } from "../firebase"; // Import Firebase configuration
import { collection, getDocs } from "firebase/firestore";
import { FileText, Calendar, ArrowUpRight } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

const Blog = () => {
  const [blogs, setBlogs] = useState([]); // State to store blog posts
  const [loading, setLoading] = useState(true); // State to manage loading state

  // Fetch blog posts from Firebase Firestore
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "blogs")); // Replace "blogs" with your Firestore collection name
        const blogsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBlogs(blogsData);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Initialize AOS for animations
  useEffect(() => {
    AOS.init({
      once: true,
    });
  }, []);

  return (
    <div className="min-h-screen py-16 px-[5%] sm:px-[10%] bg-[#030014] text-white" id="Blog">
      {/* Header */}
      <div className="text-center mb-12">
        <h2
          className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]"
          data-aos="fade-up"
          data-aos-duration="600"
        >
          Blog
        </h2>
        <p
          className="mt-2 text-gray-400 max-w-2xl mx-auto text-base sm:text-lg"
          data-aos="fade-up"
          data-aos-duration="800"
        >
          Insights, tutorials, and updates from my journey as a developer.
        </p>
      </div>

      {/* Blog Posts */}
      {loading ? (
        <div className="text-center text-gray-400">Loading blog posts...</div>
      ) : blogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="relative group bg-gray-900/50 backdrop-blur-lg rounded-2xl p-6 border border-white/10 overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              data-aos="fade-up"
              data-aos-duration="1000"
            >
              {/* Blog Image */}
              <div className="relative h-48 rounded-lg overflow-hidden mb-4">
                <img
                  src={blog.image || "https://via.placeholder.com/400x200?text=Blog+Image"}
                  alt={blog.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/400x200?text=Image+Not+Found";
                  }}
                />
              </div>

              {/* Blog Title */}
              <h3 className="text-xl font-bold text-white mb-2">{blog.title}</h3>

              {/* Blog Metadata */}
              <div className="flex items-center text-gray-400 text-sm mb-4">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{new Date(blog.date?.toDate()).toLocaleDateString()}</span>
              </div>

              {/* Blog Excerpt */}
              <p className="text-gray-400 text-sm mb-4">{blog.excerpt}</p>

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
        <div className="text-center text-gray-400">No blog posts available.</div>
      )}
    </div>
  );
};

export default Blog;