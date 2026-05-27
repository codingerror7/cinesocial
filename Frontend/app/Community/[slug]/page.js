import Navbar2 from '@/Components/Navbar2';
import Sidebar from '@/Components/Sidebar';
import MobileTopBar from '@/Components/MobileTopBar';
import Loader from '@/Components/Loader';
import ClientCommunity from './ClientCommunity';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

const Page = async ({ params }) => {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  // Server-side fetch of community data — avoids reading promise `params` in a client component
  try {
    const res = await fetch(`${API_BASE}/api/community/${slug}`, { cache: 'no-store' });
    if (!res.ok) {
      return (
        <div className="min-h-screen bg-[#070707] text-white">
          <Navbar2 /><MobileTopBar /><Sidebar />
          <main className="lg:pl-[17rem] min-h-screen pt-20 px-4 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-3xl font-semibold">Not Found</h1>
              <p className="mt-2 text-white/50">Community not found</p>
            </div>
          </main>
        </div>
      );
    }

    const data = await res.json();
    const community = data.community || null;

    if (!community) {
      return (
        <div className="min-h-screen bg-[#070707] text-white">
          <Navbar2 /><MobileTopBar /><Sidebar />
          <main className="lg:pl-[17rem] min-h-screen pt-20 px-4 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-3xl font-semibold">Not Found</h1>
              <p className="mt-2 text-white/50">Community not found</p>
            </div>
          </main>
        </div>
      );
    }

    return (
      <div className="min-h-screen w-full overflow-hidden bg-[#070707] text-white">
       
        <MobileTopBar />
        <Sidebar />
        <main className="lg:pl-[17rem] h-screen overflow-hidden">
          <div className="flex h-full flex-col">
            <header className="top-30 border-b border-white/10 bg-[#0B0B0B]/95">
              <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-4 min-w-0">
                  <img src={community.communityBanner || "/avatar1.jpg"} alt={community.title} className="h-14 w-14 rounded-2xl border border-white/10 object-cover" />
                  <div className="min-w-0">
                    <h1 className="truncate text-2xl font-semibold">{community.title}</h1>
                    <p className="text-sm text-white/45">{community.membersCount || 1} members • By {community.admin?.username}</p>
                  </div>
                </div>
                <div className="text-sm text-emerald-300">Open community</div>
              </div>
            </header>
            <div className="flex-1 overflow-hidden">
              <ClientCommunity initialCommunity={community} />
            </div>
          </div>
        </main>
      </div>
    );
  } catch (err) {
    return <Loader message="Failed to load community" />;
  }
};

export default Page;
