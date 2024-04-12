
import "@fortawesome/fontawesome-svg-core/styles.css";
import Link from "next/link";
import Image from "next/image";


const HomeComponent = () => {
  return (
    <div className="flex h-screen bg-gradient-to-r from-neutral to-base-100">
      <div
        className="m-auto bg-base-100 p-12 shadow-lg rounded-lg flex bg-gradient-to-r from-base-100 to-neutral"
        style={{ width: "90%" }}
      >
        <div
          className="flex flex-col justify-center items-start border-r border-base-300 pr-12"
          style={{ width: "50%" }}
        >
          <div className="flex items-center mb-8">
            <img
              src="/logo.png"
              alt="My Unique Story Logo"
              style={{ width: "64px", height: "auto" }}
            />
            <span className="text-base-content font-semibold text-lg ml-3">
              My Unique Story
            </span>
          </div>

          <h1 className="text-5xl font-bold mb-4 text-base-content">
            Discover Your Imagination
          </h1>
          <p className="text-base-content mb-8">
            Explore the magical world of storytelling, create your own unique
            stories & share them with friends and family.
          </p>
          <div className="flex mt-4">
            <Link href="/login" className="btn btn-outline btn-secondary mr-2">
              Log In
            </Link>
            <Link
              href="/login?form=signup"
              className="btn btn-outline btn-primary"
            >
              Sign Up
            </Link>
          </div>
        </div>
        <div className="pl-12" style={{ width: "50%" }}>
          <div>
            <img
              src="/images/landing.png"
              alt="Placeholder image representing a book cover"
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}


export default HomeComponent;