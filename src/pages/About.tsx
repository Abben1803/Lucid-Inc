
import AsideComponent from '../components/AsideComponent';
import "../app/globals.css";
import '@fortawesome/fontawesome-svg-core/styles.css';


export default function About() {

    return (
        <div className="flex h-screen bg-base-200 text-base-content">
          <AsideComponent />
          <main className="flex-1 overflow-y-auto">
            <div className="p-8">
              <h1 className="text-4xl font-bold mb-4">About M.U.S.</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <p className="text-lg mb-6">
                    M.U.S. (My Unique Stories) is a captivating platform that empowers young minds to unleash their creativity and embark on enchanting storytelling adventures. With M.U.S., children can easily craft their own stories, complete with vivid illustrations, and share them with a community of fellow young authors.
                  </p>
                  <p className="text-lg mb-6">
                    My mission is to foster a love for storytelling, encourage imagination, and provide a safe and nurturing environment for children to express themselves through the power of words and visuals. We believe that every child has a unique voice and boundless potential waiting to be discovered.
                  </p>
                  <div className="flex items-center">
                    <div className="avatar">
                      <div className="w-16 rounded-full">
                        <img src="/path/to/founder-avatar.jpg" alt="Founder" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-lg font-semibold">Ashraf Ben</p>
                      <p className="text-base">Software Dev</p>
                    </div>
                  </div>
                </div>
                <div>
                  <img src="/images/3b6c168f-75f3-44f9-a4f5-b9cbb726c23f.png" alt="About M.U.S." className="w-full rounded-lg shadow-lg" />
                </div>
              </div>
            </div>
          </main>
        </div>
    );
}