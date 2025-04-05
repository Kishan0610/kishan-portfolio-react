import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, orderBy, doc, updateDoc } from "firebase/firestore";
import { Calendar, ArrowUpRight, ThumbsUp } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link } from "react-router-dom";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "blogs"), orderBy("date", "desc"));
      const querySnapshot = await getDocs(q);
      const blogsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Ensure all required fields exist
        title: doc.data().title || "Untitled Blog",
        excerpt: doc.data().excerpt || "",
        image: doc.data().image || "https://via.placeholder.com/400x200?text=Blog+Image",
        date: doc.data().date || new Date(),
        likes: doc.data().likes || 0,
        link: doc.data().link || "#"
      }));

      setBlogs(blogsData);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
    AOS.init({ 
      once: true,
      duration: 600,
      easing: 'ease-out-cubic'
    });
  }, []);

  // Pagination
  const indexOfLastBlog = currentPage * itemsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - itemsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(blogs.length / itemsPerPage);

  const handleLike = async (id, currentLikes) => {
    try {
      const blogRef = doc(db, "blogs", id);
      await updateDoc(blogRef, { likes: currentLikes + 1 });
      setBlogs(blogs.map(blog => 
        blog.id === id ? { ...blog, likes: currentLikes + 1 } : blog
      ));
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  return (
    <section className="min-h-screen py-16 px-[5%] sm:px-[10%] bg-[#030014] text-white" id="Blog">
      {/* Header */}
      <header className="text-center mb-12">
        <h2
          className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]"
          data-aos="fade-up"
        >
          Blogs
        </h2>
        <p
          className="mt-2 text-gray-400 max-w-2xl mx-auto text-base sm:text-lg"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          Insights, tutorials, and updates from my journey as a developer.
        </p>
      </header>

      {/* Blog Posts */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton 
              key={i} 
              height={400} 
              className="rounded-2xl" 
              baseColor="#1e1b4b" 
              highlightColor="#4a044e"
            />
          ))}
        </div>
      ) : currentBlogs.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentBlogs.map((blog, index) => (
              <article
                key={blog.id}
                className="relative group bg-gray-900/50 backdrop-blur-lg rounded-2xl p-6 border border-white/10 overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:border-purple-500/30"
                data-aos="fade-up"
                data-aos-delay={index * 50}
              >
                {/* Blog Image */}
                <div className="relative h-48 rounded-lg overflow-hidden mb-4">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/400x200?text=Image+Not+Found";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Blog Content */}
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-white line-clamp-2">{blog.title}</h3>
                  
                  <div className="flex items-center text-gray-400 text-sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>
                      {blog.date?.toDate().toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>

                  <p className="text-gray-400 text-sm line-clamp-3">{blog.excerpt}</p>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => handleLike(blog.id, blog.likes)}
                      className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                      aria-label="Like this post"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>{blog.likes} Likes</span>
                    </button>

                    <Link
                      to={`/blog/${blog.id}`}
                      className="flex items-center text-[#a855f7] hover:text-[#6366f1] transition-colors"
                    >
                      <span className="mr-2">Read More</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12 gap-4" data-aos="fade-up">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-50 transition-all"
              >
                Previous
              </button>
              <span className="flex items-center px-4">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-50 transition-all"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div 
          className="text-center text-gray-400 py-16"
          data-aos="fade-up"
        >
          No blog posts available yet. Check back soon!
        </div>
      )}
    </section>
  );
};

export default Blog;