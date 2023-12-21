export default function DetailsLoading() {
  const loadingPulse = `animate-pulse bg-gray-400 bg-opacity-20`;

  return (
    <div className={`flex flex-col gap-[1rem] relative -mt-[66px]`}>
      {/* Backdrop */}
      <div
        className={`${loadingPulse} max-h-[100vh] overflow-hidden z-0 absolute inset-0 w-full before:absolute before:inset-0 before:bg-gradient-to-t before:from-base-100 before:z-0 aspect-video md:opacity-[60%] lg:max-h-[80dvh]`}
      ></div>

      <div className={`z-10 mt-[30%] md:mt-[200px]`}>
        <div
          className={`mx-auto max-w-none grid grid-cols-1 md:grid-cols-12 lg:grid-cols-24 gap-4 px-4`}
        >
          {/* Poster */}
          <section className={`md:col-[1/4] lg:col-[1/6] lg:row-[1/3]`}>
            <div
              className={`${loadingPulse} flex w-[50vw] md:w-full mx-auto md:m-0 sticky top-20 flex-col gap-4 aspect-poster rounded-xl overflow-hidden self-start shadow-xl`}
            ></div>
          </section>

          {/* Info */}
          <section className={`md:col-[4/13] lg:col-[6/20]`}>
            <div className={`flex flex-col gap-2 lg:w-full`}>
              {/* Title Logo */}
              <div
                className={`rounded-lg ${loadingPulse} h-[100px] sm:h-[150px] w-full !max-w-[350px] mx-auto md:mx-0`}
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
              <div className={`flex items-center gap-2 w-[160px]`}>
                <figure
                  className={`${loadingPulse} h-[40px] w-[40px] aspect-square rounded-full`}
                ></figure>
                <div className={`w-full flex flex-col gap-1`}>
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
          <section className={`md:col-[1/9] lg:col-[6/20] flex`}>
            <div className={`flex flex-col gap-2 w-full`}>
              {/* Overview */}
              <div className={`[&_*]:rounded-lg`}>
                <div
                  id="title"
                  className={`mt-2 ${loadingPulse} h-[28px] w-[140px] mb-2`}
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
                className={`rounded-lg aspect-video ${loadingPulse}`}
              ></figure>
              {/* Reviews */}
              <div>
                <div
                  id="title"
                  className={`mt-2 rounded-lg ${loadingPulse} h-[28px] w-[140px] mb-2`}
                ></div>
                <ul className={`flex flex-col gap-2`}>
                  {[...Array(3).keys()].map((i) => (
                    <li
                      id="reviewCard"
                      key={i}
                      className={`flex flex-col gap-2 bg-gray-400 bg-opacity-10 p-4 rounded-xl`}
                    >
                      <div className={`flex items-start justify-between`}>
                        <div className={`flex items-center gap-2 w-[160px]`}>
                          <figure
                            className={`${loadingPulse} h-[40px] w-[40px] aspect-square rounded-full`}
                          ></figure>
                          <div className={`w-full flex flex-col gap-1`}>
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
                className={`rounded-lg ${loadingPulse} h-[28px] w-[140px] mb-4`}
              ></div>
              <ul
                id="casts"
                className={`flex md:flex-col gap-4 overflow-hidden`}
              >
                {[...Array(5).keys()].map((i) => (
                  <li
                    key={i}
                    className={`flex flex-col md:flex-row items-center gap-2 min-w-[120px] md:w-full`}
                  >
                    <figure
                      className={`${loadingPulse} h-[50px] w-[50px] aspect-square rounded-full`}
                    ></figure>
                    <div
                      className={`w-full flex flex-col items-center md:items-start gap-1`}
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
