import Sidebar from '@/Components/Sidebar';
import Loader from '@/Components/Loader';
import ClientCommunity from './ClientCommunity';

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  'https://cinesocial-xzt4.onrender.com/';

const Page = async ({ params }) => {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  try {
    const res = await fetch(
      `${API_BASE}/api/get-community/${slug}`,
      {
        cache: 'no-store',
      }
    );

    if (!res.ok) {
      return (
        <div className="min-h-screen bg-[#050505] text-white">
          <Sidebar />

          <main className="lg:pl-[17rem] min-h-screen px-4 sm:px-6 lg:px-10">
            <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center">

              <div
                className="
                w-full max-w-2xl
                rounded-[28px]
                border border-white/10
                bg-[#0B0B0B]
                px-8 py-14
                text-center
                "
              >
                <div
                  className="
                  mx-auto mb-6
                  flex h-16 w-16
                  items-center justify-center
                  rounded-2xl
                  border border-white/10
                  bg-white/[0.03]
                  "
                >
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                </div>

                <h1 className="text-3xl font-semibold tracking-tight">
                  Community Not Found
                </h1>

                <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/45">
                  This community may have been removed,
                  renamed, or the invite link is invalid.
                </p>

                <button
                  className="
                  mt-8 rounded-2xl
                  border border-white/10
                  bg-white/[0.04]
                  px-6 py-3
                  text-sm font-medium text-white/80
                  transition-all duration-300
                  hover:bg-white/[0.08]
                  "
                >
                  Back to Communities
                </button>
              </div>
            </div>
          </main>
        </div>
      );
    }

    const data = await res.json();
    const community = data.community || null;

    if (!community) {
      return (
        <div className="min-h-screen bg-[#050505] text-white">
          <Sidebar />

          <main className="lg:pl-[17rem] min-h-screen px-4 sm:px-6 lg:px-10">
            <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center">

              <div
                className="
                w-full max-w-2xl
                rounded-[28px]
                border border-white/10
                bg-[#0B0B0B]
                px-8 py-14
                text-center
                "
              >
                <div
                  className="
                  mx-auto mb-6
                  flex h-16 w-16
                  items-center justify-center
                  rounded-2xl
                  border border-white/10
                  bg-white/[0.03]
                  "
                >
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                </div>

                <h1 className="text-3xl font-semibold tracking-tight">
                  Community Not Found
                </h1>

                <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/45">
                  This community may have been removed,
                  renamed, or the invite link is invalid.
                </p>

                <button
                  className="
                  mt-8 rounded-2xl
                  border border-white/10
                  bg-white/[0.04]
                  px-6 py-3
                  text-sm font-medium text-white/80
                  transition-all duration-300
                  hover:bg-white/[0.08]
                  "
                >
                  Back to Communities
                </button>
              </div>
            </div>
          </main>
        </div>
      );
    }

    return (
      <div className="h-screen overflow-hidden bg-[#050505] text-white">
        <Sidebar />

        <main
          className="
          lg:pl-[17rem]
          h-screen
          overflow-hidden
          "
        >
          <div className="flex h-full flex-col">

            {/* TOP HEADER */}
            <header
              className="
              z-30
              border-b border-white/10
              bg-[#090909]
              "
            >
              <div
                className="
                mx-auto
                flex h-[84px]
                w-full
                items-center justify-between
                px-4 sm:px-6 lg:px-8
                "
              >

                {/* LEFT */}
                <div className="flex items-center gap-4 min-w-0">

                  {/* COMMUNITY IMAGE */}
                  <div
                    className="
                    relative
                    h-14 w-14
                    shrink-0
                    overflow-hidden
                    rounded-2xl
                    border border-white/10
                    bg-[#111111]
                    "
                  >
                    <img
                      src={
                        community.communityBanner ||
                        '/avatar1.jpg'
                      }
                      alt={community.title}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* COMMUNITY INFO */}
                  <div className="min-w-0">

                    <div className="flex items-center gap-3">

                      <h1
                        className="
                        truncate
                        text-[20px] sm:text-[24px]
                        font-semibold
                        tracking-tight
                        "
                      >
                        {community.title}
                      </h1>

                      <div
                        className="
                        hidden sm:flex
                        items-center gap-2
                        rounded-full
                        border border-emerald-500/15
                        bg-emerald-500/10
                        px-3 py-1
                        "
                      >
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />

                        <span
                          className="
                          text-[11px]
                          font-medium
                          text-emerald-300
                          "
                        >
                          Active
                        </span>
                      </div>
                    </div>

                    <div
                      className="
                      mt-1
                      flex items-center gap-3
                      text-sm text-white/40
                      "
                    >
                      <span>
                        {community.membersCount || 1} members
                      </span>

                      <span className="h-1 w-1 rounded-full bg-white/20" />

                      <span className="truncate">
                        Created by{' '}
                        {community.admin?.username || 'Admin'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="hidden lg:flex items-center gap-3">

                  {/* ONLINE USERS */}
                  <div
                    className="
                    flex items-center gap-3
                    rounded-2xl
                    border border-white/10
                    bg-[#0F0F0F]
                    px-4 py-2.5
                    "
                  >
                    <div className="flex -space-x-2">

                      <div
                        className="
                        h-8 w-8 rounded-full
                        border-2 border-[#0F0F0F]
                        bg-zinc-700
                        "
                      />

                      <div
                        className="
                        h-8 w-8 rounded-full
                        border-2 border-[#0F0F0F]
                        bg-zinc-600
                        "
                      />

                      <div
                        className="
                        h-8 w-8 rounded-full
                        border-2 border-[#0F0F0F]
                        bg-zinc-500
                        "
                      />
                    </div>

                    <div>
                      <p className="text-[11px] text-white/35">
                        Online Members
                      </p>

                      <p className="text-sm text-white/75">
                        {community?.onlineMembers?.length || 0} online
                      </p>
                    </div>
                  </div>

                  {/* COMMUNITY TYPE */}
                  <div
                    className="
                    rounded-2xl
                    border border-white/10
                    bg-[#0F0F0F]
                    px-4 py-3
                    text-sm text-white/70
                    "
                  >
                    Public Community
                  </div>
                </div>
              </div>
            </header>

            {/* CHAT LAYOUT */}
            <section
              className="
              flex-1
              overflow-hidden
              bg-[#050505]
              "
            >
              <div
                className="
                mx-auto
                flex h-full
                max-w-[1800px]
                "
              >

                {/* OPTIONAL RIGHT SIDEBAR */}
                <aside
                  className="
                  hidden xl:flex
                  w-[320px]
                  shrink-0
                  flex-col
                  border-l border-white/10
                  bg-[#090909]
                  "
                >
                  {/* SECTION */}
                  <div className="border-b border-white/10 p-6">

                    <h2 className="text-sm font-medium text-white/80">
                      About Community
                    </h2>

                    <p
                      className="
                      mt-3 text-sm
                      leading-relaxed
                      text-white/45
                      "
                    >
                      {community.description}
                    </p>
                  </div>

                  {/* TAGS */}
                  <div className="p-6">

                    <h2 className="text-sm font-medium text-white/80">
                      Topics
                    </h2>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {community.tags?.map((tag, index) => (
                        <span
                          key={index}
                          className="
                          rounded-full
                          border border-white/10
                          bg-white/[0.03]
                          px-3 py-1.5
                          text-xs text-white/60
                          "
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </aside>

                {/* CHAT AREA */}
                <div className="flex-1 overflow-hidden">

                  <div
                    className="
                    h-full
                    border-x border-white/10
                    bg-[#080808]
                    "
                  >
                    <ClientCommunity
                      initialCommunity={community}
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    );
  } catch (err) {
    return (
      <div className="min-h-screen bg-[#050505] text-white">
        <Sidebar />

        <main
          className="
          lg:pl-[17rem]
          min-h-screen
          flex items-center justify-center
          px-4
          "
        >
          <div
            className="
            w-full max-w-md
            rounded-[28px]
            border border-white/10
            bg-[#0B0B0B]
            px-8 py-10
            "
          >
            <Loader message="Failed to load community" />
          </div>
        </main>
      </div>
    );
  }
};

export default Page;