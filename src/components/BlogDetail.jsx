import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, ExternalLink, Calendar, ThumbsUp, ChevronRight,
  BookOpen, Clock, User, MessageSquare, Tag, Share2
} from "lucide-react";
import Swal from 'sweetalert2';
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'prism-react-renderer';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [viewCount, setViewCount] = useState(0);

  // Fetch blog data
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const docRef = doc(db, "blogs", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const blogData = {
            id: docSnap.id,
            ...docSnap.data(),
            // Ensure all fields exist
            title: docSnap.data().title || "Untitled Blog",
            content: docSnap.data().content || "",
            excerpt: docSnap.data().excerpt || "",
            date: docSnap.data().date || new Date(),
            likes: docSnap.data().likes || 0,
            tags: docSnap.data().tags || [],
            author: docSnap.data().author || "Anonymous",
            readTime: docSnap.data().readTime || "5 min read",
            image: docSnap.data().image || "https://via.placeholder.com/800x400?text=Blog+Image"
          };
          setBlog(blogData);
          
          // Increment view count
          await updateDoc(docRef, {
            views: (docSnap.data().views || 0) + 1
          });
          setViewCount((docSnap.data().views || 0) + 1);
        } else {
          console.log("No such document!");
          navigate('/404');
        }
      } catch (error) {
        console.error("Error getting document:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load blog post',
          confirmButtonText: 'OK',
          confirmButtonColor: '#3085d6',
          background: '#030014',
          color: '#ffffff'
        });
        navigate('/blogs');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
    window.scrollTo(0, 0);
  }, [id, navigate]);

  const handleLike = async () => {
    try {
      const docRef = doc(db, "blogs", id);
      await updateDoc(docRef, {
        likes: (blog.likes || 0) + 1
      });
      setBlog(prev => ({
        ...prev,
        likes: (prev.likes || 0) + 1
      }));
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareBlog = () => {
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        text: blog.excerpt,
        url: window.location.href,
      }).catch(console.error);
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      Swal.fire({
        icon: 'success',
        title: 'Link Copied!',
        text: 'Blog link has been copied to clipboard',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6',
        background: '#030014',
        color: '#ffffff'
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030014] flex items-center justify-center">
        <div className="text-center space-y-6 animate-fadeIn">
          <div className="w-16 h-16 md:w-24 md:h-24 mx-auto border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          <h2 className="text-xl md:text-3xl font-bold text-white">Loading Blog Post...</h2>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-[#030014] flex items-center justify-center">
        <div className="text-center space-y-6">
          <h2 className="text-xl md:text-3xl font-bold text-white">Blog Post Not Found</h2>
          <button
            onClick={() => navigate('/blogs')}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white hover:opacity-90 transition-opacity"
          >
            Back to Blogs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030014] px-[2%] sm:px-0 relative overflow-hidden">
      {/* Background animations */}
      <div className="fixed inset-0">
        <div className="absolute -inset-[10px] opacity-20">
          <div className="absolute top-0 -left-4 w-72 md:w-96 h-72 md:h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
          <div className="absolute top-0 -right-4 w-72 md:w-96 h-72 md:h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-72 md:w-96 h-72 md:h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
        </div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />
      </div>

      <div className="relative">
        
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-16">
          <button
            onClick={() => navigate(-1)}
            className="group inline-flex items-center space-x-1.5 md:space-x-2 px-3 md:px-5 py-2 md:py-2.5 bg-white/5 backdrop-blur-xl rounded-xl text-white/90 hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20 text-sm md:text-base"
          >
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back</span>
          </button>
          {/* Back button and breadcrumbs */}
          <div className="flex items-center space-x-2 md:space-x-4 mb-8 md:mb-12 animate-fadeIn mt-4">
            
            <div className="flex items-center space-x-1 md:space-x-2 text-sm md:text-base text-white/50">
              <span>Blogs</span>
              <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
              <span className="text-white/90 truncate">{blog.title}</span>
            </div>
          </div>

          {/* Blog Header */}
          <div className="mb-10 md:mb-16 animate-slideInLeft">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {blog.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 text-xs md:text-sm bg-purple-900/30 text-purple-300 rounded-full border border-purple-500/20"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent leading-tight mb-4">
              {blog.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm md:text-base text-gray-400">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{blog.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{blog.date.toDate().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{blog.readTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>{viewCount} views</span>
              </div>
            </div>
          </div>

          {/* Blog Image */}
          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl group mb-10 md:mb-16 animate-slideInRight">
            <div className="absolute inset-0 bg-gradient-to-t from-[#030014] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-64 md:h-96 object-cover transform transition-transform duration-700 will-change-transform group-hover:scale-105"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/800x400?text=Blog+Image";
              }}
            />
            <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/10 transition-colors duration-300 rounded-2xl" />
          </div>

          {/* Blog Content */}
          <div className="prose prose-invert max-w-none mb-16">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                code({node, inline, className, children, ...props}) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <div className="relative">
                      <CopyToClipboard text={String(children).replace(/\n$/, '')} onCopy={handleCopy}>
                        <button className="absolute right-2 top-2 z-10 px-2 py-1 text-xs bg-white/10 rounded hover:bg-white/20 transition-colors">
                          {copied ? 'Copied!' : 'Copy'}
                        </button>
                      </CopyToClipboard>
                      <SyntaxHighlighter
                        language={match[1]}
                        style={undefined}
                        customStyle={{
                          background: '#0a0a1a',
                          borderRadius: '0.5rem',
                          padding: '1.25rem',
                          margin: '1rem 0'
                        }}
                        showLineNumbers
                        lineNumberStyle={{
                          color: '#6b7280',
                          paddingRight: '1rem'
                        }}
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    </div>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
                h1: ({node, ...props}) => <h1 className="text-3xl md:text-4xl font-bold mb-4 mt-8 text-white" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-2xl md:text-3xl font-bold mb-3 mt-6 text-white" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-xl md:text-2xl font-bold mb-2 mt-5 text-white" {...props} />,
                p: ({node, ...props}) => <p className="text-gray-300 mb-4 leading-relaxed" {...props} />,
                a: ({node, ...props}) => <a className="text-blue-400 hover:text-blue-300 underline" target="_blank" rel="noopener noreferrer" {...props} />,
                blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-purple-500 pl-4 italic bg-white/5 py-2 my-4" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4 space-y-1" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4 space-y-1" {...props} />,
                li: ({node, ...props}) => <li className="text-gray-300" {...props} />,
                img: ({node, ...props}) => (
                  <div className="my-6 rounded-lg overflow-hidden border border-white/10">
                    <img 
                      className="w-full h-auto object-contain max-h-[500px] mx-auto" 
                      loading="lazy" 
                      {...props} 
                    />
                  </div>
                ),
                table: ({node, ...props}) => (
                  <div className="overflow-x-auto my-4">
                    <table className="w-full border-collapse" {...props} />
                  </div>
                ),
                th: ({node, ...props}) => (
                  <th className="border border-white/20 bg-white/10 px-4 py-2 text-left" {...props} />
                ),
                td: ({node, ...props}) => (
                  <td className="border border-white/10 px-4 py-2" {...props} />
                ),
              }}
            >
              {blog.content}
            </ReactMarkdown>
          </div>

          {/* Blog Footer */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-t border-white/10 pt-8 mb-16">
            <div className="flex items-center gap-4">
                <button
                    onClick={handleLike}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
                >
                    <ThumbsUp className="w-5 h-5" />
                    <span>{blog.likes} Likes</span>
                </button>

                <button
                    onClick={shareBlog}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                    <Share2 className="w-5 h-5" />
                    <span>Share</span>
                </button>
            </div>

            
            <div className="flex items-center gap-2 text-gray-400">
              <MessageSquare className="w-5 h-5" />
              <span>Comments coming soon</span>
            </div>
          </div>

          {/* Author Bio (optional) */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 mb-16">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                {blog.author.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{blog.author}</h3>
                <p className="text-sm text-gray-400">Blog Author</p>
              </div>
            </div>
            <p className="text-gray-300">
              Thanks for reading! If you enjoyed this post, consider liking it or sharing it with others 
              who might find it useful. Stay tuned for more content about web development, programming, 
              and technology.
            </p>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .prose {
          color: #e5e7eb;
        }
        .prose a {
          transition: color 0.2s ease;
        }
        .prose code:not([class*="language-"]) {
          background: rgba(79, 70, 229, 0.2);
          color: #a5b4fc;
          padding: 0.2em 0.4em;
          border-radius: 0.2em;
          font-size: 0.9em;
        }
        .prose pre {
          position: relative;
          overflow-x: auto;
        }
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 10s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-fadeIn {
          animation: fadeIn 0.7s ease-out;
        }
        .animate-slideInLeft {
          animation: slideInLeft 0.7s ease-out;
        }
        .animate-slideInRight {
          animation: slideInRight 0.7s ease-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default BlogDetail;