export default function LoadingDetail() {
  return (
    <div className={`flex flex-col gap-[1rem]`}>
      {/* Backdrop */}
      <div
        className={`animate-pulse bg-gray-400 bg-opacity-20 max-h-[100vh] overflow-hidden z-0 relative before:absolute before:inset-0 before:bg-gradient-to-t before:from-base-dark-gray before:z-0 aspect-video md:opacity-[60%] lg:max-h-[80vh]`}
      ></div>

      <div className={`z-10 -mt-[20vh] md:-mt-[50vh]`}>
        <div
          className={`mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-24 gap-4 px-4 pb-[2rem] md:pb-[5rem]`}
        >
          {/* Poster */}
          <section
            className={`animate-pulse bg-gray-400 bg-opacity-20 lg:col-span-6 hidden lg:flex flex-col gap-4 md:max-w-full self-start sticky top-20 aspect-poster rounded-xl overflow-hidden shadow-2xl`}
          ></section>

          {/* Overview */}
          <section className={`lg:col-span-13 flex flex-col gap-2`}>
            <div className={`flex flex-col md:flex-row gap-4 lg:gap-0`}>
              {/* Poster */}
              <figure
                className={`animate-pulse bg-gray-400 bg-opacity-20 w-[50vw] md:w-[25vw] lg:hidden aspect-poster rounded-lg overflow-hidden self-start shadow-xl relative mx-auto md:mx-0 mb-2`}
              ></figure>
              <div className={`flex flex-col gap-2 lg:w-full`}>
                {/* Title Logo */}
                <div
                  className={`rounded-lg animate-pulse bg-gray-400 bg-opacity-20 h-[100px] w-full max-w-[300px] mx-auto md:mx-0`}
                ></div>
                {/* Release Date & Runtime */}
                {[...Array(2).keys()].map((i) => (
                  <div
                    key={i}
                    className={`rounded-lg animate-pulse bg-gray-400 bg-opacity-20 h-[24px] w-[150px]`}
                  ></div>
                ))}
                {/* Genres */}
                <ul className={`flex gap-1`}>
                  {[...Array(3).keys()].map((i) => (
                    <li
                      key={i}
                      className={`rounded-full animate-pulse bg-gray-400 bg-opacity-20 h-[36px] w-[100px]`}
                    ></li>
                  ))}
                </ul>
                {/* Director */}
                <div className={`flex items-center gap-2 w-[160px]`}>
                  <figure
                    className={`animate-pulse bg-gray-400 bg-opacity-20 h-[40px] w-[40px] aspect-square rounded-full`}
                  ></figure>
                  <div className={`w-full flex flex-col gap-1`}>
                    <div
                      id="name"
                      className={`rounded-lg animate-pulse bg-gray-400 bg-opacity-20 h-[20px] w-full`}
                    ></div>
                    <div
                      id="character"
                      className={`rounded-lg animate-pulse bg-gray-400 bg-opacity-20 h-[16px] w-[70%]`}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Overview */}
            <div className={`[&_*]:rounded-lg`}>
              <div
                id="title"
                className={`mt-2 animate-pulse bg-gray-400 bg-opacity-20 h-[28px] w-[140px] mb-2`}
              ></div>
              <div
                id="description"
                className={`animate-pulse bg-gray-400 bg-opacity-20 h-[120px]`}
              ></div>
            </div>

            {/* Media */}
            <figure
              className={`rounded-lg aspect-video animate-pulse bg-gray-400 bg-opacity-20`}
            ></figure>

            {/* Reviews */}
            <div>
              <div
                id="title"
                className={`mt-2 rounded-lg animate-pulse bg-gray-400 bg-opacity-20 h-[28px] w-[140px] mb-2`}
              ></div>
              <ul className={`flex flex-col gap-2`}>
                {[...Array(3).keys()].map((i) => (
                  <li
                    id="reviewCard"
                    key={i}
                    className={`flex flex-col gap-2 bg-gray-400 bg-opacity-10 p-4 rounded-xl`}
                  >
                    <div className={`flex items-center justify-between`}>
                      <div className={`flex items-center gap-2 w-[160px]`}>
                        <figure
                          className={`animate-pulse bg-gray-400 bg-opacity-20 h-[40px] w-[40px] aspect-square rounded-full`}
                        ></figure>
                        <div className={`w-full flex flex-col gap-1`}>
                          <div
                            id="name"
                            className={`rounded-lg animate-pulse bg-gray-400 bg-opacity-20 h-[20px] w-full`}
                          ></div>
                          <div
                            id="character"
                            className={`rounded-lg animate-pulse bg-gray-400 bg-opacity-20 h-[16px] w-[70%]`}
                          ></div>
                        </div>
                      </div>

                      {/* Rating */}
                      <div
                        id="rating"
                        className={`rounded-lg animate-pulse bg-gray-400 bg-opacity-20 h-[20px] w-[80px]`}
                      ></div>
                    </div>

                    {/* Review Content */}
                    <div
                      id="reviewContent"
                      className={`rounded-lg animate-pulse bg-gray-400 bg-opacity-20 h-[120px]`}
                    ></div>
                  </li>
                ))}
              </ul>
            </div>
          </section>
          {/* Casts */}
          <section className={`lg:col-span-5`}>
            <div className={`sticky top-20`}>
              <div
                id="title"
                className={`rounded-lg animate-pulse bg-gray-400 bg-opacity-20 h-[28px] w-[140px] mb-4`}
              ></div>
              <ul
                id="casts"
                className={`flex lg:flex-col gap-4 overflow-hidden`}
              >
                {[...Array(5).keys()].map((i) => (
                  <li
                    key={i}
                    className={`flex flex-col lg:flex-row items-center gap-2 min-w-[120px] lg:w-full`}
                  >
                    <figure
                      className={`animate-pulse bg-gray-400 bg-opacity-20 h-[50px] w-[50px] aspect-square rounded-full`}
                    ></figure>
                    <div
                      className={`w-full flex flex-col items-center lg:items-start gap-1`}
                    >
                      <div
                        id="name"
                        className={`rounded-lg animate-pulse bg-gray-400 bg-opacity-20 h-[24px] w-full`}
                      ></div>
                      <div
                        id="character"
                        className={`rounded-lg animate-pulse bg-gray-400 bg-opacity-20 h-[20px] w-[70%]`}
                      ></div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
