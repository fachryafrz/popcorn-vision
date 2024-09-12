export default function DetailsLoading() {
  const loadingPulse = `animate-pulse bg-gray-400 bg-opacity-20`;

  return (
    <div className={`relative flex flex-col gap-[1rem] md:-mt-[66px]`}>
      {/* Backdrop */}
      <div
        className={`${loadingPulse} absolute inset-0 z-0 aspect-video max-h-[100vh] w-full overflow-hidden before:absolute before:inset-0 before:z-0 before:bg-gradient-to-t before:from-base-100 md:opacity-[60%] lg:max-h-[80dvh]`}
      ></div>

      <div className={`z-10 mt-[30%] md:mt-[200px]`}>
        <div
          className={`mx-auto grid max-w-none grid-cols-1 gap-4 px-4 md:grid-cols-12 lg:grid-cols-24`}
        >
          {/* Poster */}
          <section className={`md:col-[1/4] lg:col-[1/6] lg:row-[1/3]`}>
            <div
              className={`${loadingPulse} sticky top-20 mx-auto flex aspect-poster w-[50vw] flex-col gap-4 self-start overflow-hidden rounded-xl shadow-xl md:m-0 md:w-full`}
            ></div>
          </section>

          {/* Info */}
          <section className={`md:col-[4/13] lg:col-[6/20]`}>
            <div className={`flex flex-col gap-2 lg:w-full`}>
              {/* Title Logo */}
              <div
                className={`rounded-lg ${loadingPulse} mx-auto h-[100px] w-full !max-w-[350px] sm:h-[150px] md:mx-0`}
              ></div>
              {/* Release Date & Runtime */}
              {[...Array(2).keys()].map((i) => (
                <div
                  key={i}
                  className={`rounded-lg ${loadingPulse} h-[24px] w-[150px]`}
                ></div>
              ))}
              {/* Genres */}
              <ul className={`flex gap-1`}>
                {[...Array(3).keys()].map((i) => (
                  <li
                    key={i}
                    className={`rounded-full ${loadingPulse} h-[36px] w-[100px]`}
                  ></li>
                ))}
              </ul>
              {/* Director */}
              <div className={`flex w-[160px] items-center gap-2`}>
                <figure
                  className={`${loadingPulse} aspect-square h-[40px] min-w-[40px] rounded-full`}
                ></figure>
                <div className={`flex w-full flex-col gap-1`}>
                  <div
                    id="name"
                    className={`rounded-lg ${loadingPulse} h-[20px] w-full`}
                  ></div>
                  <div
                    id="character"
                    className={`rounded-lg ${loadingPulse} h-[16px] w-[70%]`}
                  ></div>
                </div>
              </div>
            </div>
          </section>

          {/* Overview */}
          <section className={`flex md:col-[1/9] lg:col-[6/20]`}>
            <div className={`flex w-full flex-col gap-2`}>
              {/* Overview */}
              <div className={`[&_*]:rounded-lg`}>
                <div
                  id="title"
                  className={`mt-2 ${loadingPulse} mb-2 h-[28px] w-[140px]`}
                ></div>
                <div id="description" className={`flex flex-col gap-1`}>
                  {[...Array(2).keys()].map((i) => (
                    <div
                      key={i}
                      className={`rounded-lg ${loadingPulse} h-[24px]`}
                    ></div>
                  ))}
                  <div
                    className={`rounded-lg ${loadingPulse} h-[24px] w-[90%]`}
                  ></div>
                </div>
              </div>
              {/* Media */}
              <figure
                className={`aspect-video rounded-lg ${loadingPulse}`}
              ></figure>
              {/* Reviews */}
              <div>
                <div
                  id="title"
                  className={`mt-2 rounded-lg ${loadingPulse} mb-2 h-[28px] w-[140px]`}
                ></div>
                <ul className={`flex flex-col gap-2`}>
                  {[...Array(3).keys()].map((i) => (
                    <li
                      id="reviewCard"
                      key={i}
                      className={`flex flex-col gap-2 rounded-xl bg-gray-400 bg-opacity-10 p-4`}
                    >
                      <div className={`flex items-start justify-between`}>
                        <div className={`flex w-[160px] items-center gap-2`}>
                          <figure
                            className={`${loadingPulse} aspect-square h-[40px] min-w-[40px] rounded-full`}
                          ></figure>
                          <div className={`flex w-full flex-col gap-1`}>
                            <div
                              id="name"
                              className={`rounded-lg ${loadingPulse} h-[20px] w-full`}
                            ></div>
                            <div
                              id="character"
                              className={`rounded-lg ${loadingPulse} h-[16px] w-[70%]`}
                            ></div>
                          </div>
                        </div>
                        {/* Rating */}
                        <div
                          id="rating"
                          className={`rounded-lg ${loadingPulse} h-[20px] w-[80px]`}
                        ></div>
                      </div>
                      {/* Review Content */}
                      <div
                        id="reviewContent"
                        className={`rounded-lg ${loadingPulse} h-[120px]`}
                      ></div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
          {/* Casts */}
          <section className={`md:col-[9/13] lg:col-[20/25] lg:row-[1/3]`}>
            <div className={`sticky top-20`}>
              <div
                id="title"
                className={`rounded-lg ${loadingPulse} mb-4 h-[28px] w-[140px]`}
              ></div>
              <ul
                id="casts"
                className={`flex gap-4 overflow-hidden md:flex-col`}
              >
                {[...Array(5).keys()].map((i) => (
                  <li
                    key={i}
                    className={`flex min-w-[120px] flex-col items-center gap-2 md:w-full md:flex-row`}
                  >
                    <figure
                      className={`${loadingPulse} aspect-square h-[50px] min-w-[50px] rounded-full`}
                    ></figure>
                    <div
                      className={`flex w-full flex-col items-center gap-1 md:items-start`}
                    >
                      <div
                        id="name"
                        className={`rounded-lg ${loadingPulse} h-[24px] w-full`}
                      ></div>
                      <div
                        id="character"
                        className={`rounded-lg ${loadingPulse} h-[20px] w-[70%]`}
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
