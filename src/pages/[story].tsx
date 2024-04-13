import React, { useEffect, useState } from "react";

import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import AsideComponent from "../components/AsideComponent";
import { Book } from "../lib/interfaces";
import styles from "../components/styleoption.module.css";
import Image from "next/image";
import Head from "next/head";

const StoryComponent = () => {
  const [book, setBook] = useState<Book | null>(null);
  const [fontStyle, setFontStyle] = useState("IndieFlower");
  const [fontSize, setFontSize] = useState(20);
  const [currentParagraphIndex, setCurrentParagraphIndex] = useState(1);
  const router = useRouter();
  const { story: bookId } = router.query;
  const { data: session } = useSession();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isAsideOpen, setIsAsideOpen] = useState(true);

  const setToIndieFlower = () => setFontStyle("IndieFlower");
  const setToOpenDyslexic = () => setFontStyle("OpenDyslexic");
  const increaseFontSize = () => {
    setFontSize((currentSize) => {
      const maxSize = 25; // Set your maximum size here
      if (currentSize < maxSize) {
        return currentSize + 1;
      } else {
        return currentSize;
      }
    });
  };

  const decreaseFontSize = () =>
    setFontSize((currentSize) => Math.max(currentSize - 1, 12));

  const toggleAside = () => {
    setIsAsideOpen(!isAsideOpen);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowRight":
          setCurrentParagraphIndex((prevIndex) =>
            Math.min(prevIndex + 1, book?.paragraphs?.length ?? 1)
          );
          break;
        case "ArrowLeft":
          setCurrentParagraphIndex((prevIndex) => Math.max(prevIndex - 1, 1));
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [book?.paragraphs?.length ?? 1]);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        if (bookId && session) {
          const isAdmin = (session.user as { isAdmin?: boolean })?.isAdmin;
          const url = isAdmin ? `/api/admin/${bookId}` : `/api/${bookId}`;
          console.log("Fetching book from URL:", url);
          const response = await fetch(url);
          if (response.ok) {
            console.log("Response:", response.status);
            const data = await response.json();
            //console.log('Received book data:', data);
            setBook(data);
            setIsBookmarked(data.isBookmarked);
          } else if (response.status === 403) {
            router.push("/Unauthorized/forbidden");
          } else {
            router.push("/404/notfound");
          }
        }
      } catch (error) {
        console.error("Error fetching book:", error);
      }
    };

    if (session) {
      fetchBook();
    }
  }, [bookId, session]);

  useEffect(() => {
    const fetchBookmark = async () => {
      try {
        if (bookId && session) {
          const response = await fetch(`/api/${bookId}`);
          if (response.ok) {
            const data = await response.json();
            setIsBookmarked(data.isBookmarked);
          } else {
            setIsBookmarked(false);
          }
        }
      } catch (error) {
        console.error("Error fetching bookmark:", error);
        setIsBookmarked(false);
      }
    };

    if (session) {
      fetchBookmark();
    }
  }, [bookId, session]);

  const handleFlagClick = async (event: any) => {
    event.preventDefault();

    try {
      if (bookId && session) {
        const response = await fetch("/api/flagged/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ bookId }),
        });
        if (response.ok) {
          alert("Book flagged successfully");
          router.push("/dashboard");
        }
      }
    } catch (error) {
      console.error("Error flagging book:", error);
    }
  };

  const handleDeleteClick = async (event: any) => {
    event.preventDefault();

    try {
      if (bookId && session) {
        const response = await fetch(`/api/admin/${bookId}`, {
          method: "DELETE",
        });
        if (response.ok) {
          router.push("/dashboard");
        } else {
          throw new Error("Failed to delete book");
        }
      }
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  const handleBookmarkClick = async (event: any) => {
    event.preventDefault();
    try {
      if (bookId && session) {
        const response = await fetch(`/api/${bookId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ bookId }),
        });
        if (response.ok) {
          setIsBookmarked(!isBookmarked);
        }
        console.log(response);
      }
    } catch (error) {
      console.error("Error updating bookmark:", error);
    }
  };

  if (!session) return <div>Unauthorized</div>;
  if (!book) return <div>Loading...</div>;

  console.log(book.paragraphs.length);
  let finalIndex = book.paragraphs.length;
  let totalPages = book?.paragraphs?.length;
  let lastParagraph = book.paragraphs[finalIndex - 1].paragraph.length;

  if (lastParagraph == 0) {
    book.paragraphs.pop();
    totalPages--;
  }

  console.log(book.paragraphs.length);

  console.log(
    "Current image URL:",
    book.paragraphs?.[currentParagraphIndex - 1]?.image || "No Image"
  );

  //console.log(book.paragraphs[currentParagraphIndex - 1].paragraph.length)

  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Indie+Flower&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div className="flex h-screen bg-base-200 text-base-content">
        <AsideComponent isOpen={isAsideOpen} toggleAside={toggleAside} />
        <main
          className={`flex-1 overflow-y-auto transition-all duration-300 ${
            isAsideOpen ? "ml-64" : "ml-0"
          }`}
        >
          <div className="p-4 h-full flex flex-col">
            <div className="flex justify-between items-center">
              {/* Left Section - Text Style and Text Size */}
              <div className="flex">
                {/* Text Style Section */}
                <div className="flex flex-col items-center mr-4">
                  <div className="flex">
                    <button
                      onClick={setToIndieFlower}
                      className="btn btn-outline btn-primary btn-sm mr-2"
                      style={{ fontFamily: "'Indie Flower', cursive" }}
                    >
                      Cursive
                    </button>
                    <button
                      onClick={setToOpenDyslexic}
                      className="btn btn-outline btn-primary btn-sm"
                      style={{
                        fontFamily: "'OpenDyslexic', Arial, sans-serif",
                      }}
                    >
                      Simple
                    </button>
                  </div>
                  <span className="text-xs text-gray-400">Text Style</span>
                </div>

                {/* Text Size Section */}
                <div className="flex flex-col items-center mr-4">
                  <div className="flex items-center">
                    <button
                      onClick={decreaseFontSize}
                      className="btn btn-outline btn-primary btn-sm mr-2"
                    >
                      -
                    </button>
                    <span className="text-sm">{fontSize}px</span>
                    <button
                      onClick={increaseFontSize}
                      className="btn btn-outline btn-primary btn-sm ml-2"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-gray-400">Text Size</span>
                </div>
              </div>

              {/* Right Section - Bookmark and Flag */}
              <div className="flex items-center">
                <button
                  className={`${styles.bookmarkButton} ${
                    isBookmarked ? styles.bookmarkButtonActive : ""
                  }`}
                  onClick={handleBookmarkClick}
                >
                  {isBookmarked ? "Bookmarked" : "Bookmark"}
                </button>

                <button
                  className="text-error text-sm ml-2"
                  onClick={handleFlagClick}
                >
                  Flag Story
                </button>
                {(session.user as { isAdmin?: boolean })?.isAdmin && (
                  <button
                    className="text-error text-sm ml-2"
                    onClick={handleDeleteClick}
                  >
                    Delete Story
                  </button>
                )}
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="text-center">
                <div className="text-base-content font-bold text-xl p-2">
                  {book.title}
                </div>
              </div>
              <div className="flex-1 w-full overflow-y-auto">
                {book.paragraphs?.[currentParagraphIndex - 1] && (
                  <div className="flex justify-center items-center p-2">
                    <Image
                      alt=""
                      width={512}
                      height={512}
                      src={
                        book.paragraphs?.[
                          currentParagraphIndex - 1
                        ].image?.toString() ??
                        book.paragraphs?.[0].image?.toString() ??
                        ""
                      }
                    />
                  </div>
                )}
                <p
                  className={`${styles.storyContent} text-base-content text-sm border border-base-300 p-2`}
                  style={{
                    fontFamily:
                      fontStyle === "IndieFlower"
                        ? "Indie Flower"
                        : "Open Dyslexic",
                    fontSize: `${fontSize}px`,
                  }}
                >
                  {book.paragraphs?.[currentParagraphIndex - 1].paragraph}
                </p>
              </div>
            </div>
            <div className="flex justify-evenly items-center mt-2">
              <button
                onClick={() =>
                  setCurrentParagraphIndex((prev) => Math.max(prev - 1, 0))
                }
                className="btn btn-sm btn-outline btn-secondary"
                disabled={currentParagraphIndex === 1}
              >
                Back
              </button>
              <div className="text-base-content text-sm">
                Page {currentParagraphIndex} of {totalPages}
              </div>
              <button
                onClick={() =>
                  setCurrentParagraphIndex((prev) =>
                    Math.min(prev + 1, totalPages)
                  )
                }
                className="btn btn-sm btn-outline btn-secondary"
              >
                Next
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default function StoryPage(props) {
  return <StoryComponent />;
}
