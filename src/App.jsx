import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ReactGA from "react-ga4";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Copyright from "./components/Copyright";

// Images
import logo from "/popcorn.png";

// Pages
import HomeMovies from "./pages/HomeMovies";
import HomeTVShows from "./pages/HomeTVShows";
import MovieDetail from "./pages/MovieDetail";
import Search from "./pages/Search";

const GA_TRACKING_ID = "G-L0V4DXC6HK";
ReactGA.initialize(GA_TRACKING_ID);

const App = () => {
  // Get current date and other date-related variables
  const currentDate = new Date();
  const today = currentDate.toISOString().slice(0, 10);
  const firstDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    2
  )
    .toISOString()
    .slice(0, 10);
  const thirtyDaysAgo = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 1,
    2
  )
    .toISOString()
    .slice(0, 10);
  const currentYear = currentDate.getFullYear();
  const endOfYear = new Date(currentYear, 11, 32).toISOString().slice(0, 10);

  return (
    <Router>
      <div id="app" className="bg-base-dark-gray min-h-screen text-white">
        <div id="website">
          {/* Navbar component */}
          <Navbar logo={logo} />

          {/* Main content */}
          <main className="pb-8">
            <Switch>
              {/* Home page */}
              <Route exact path="/">
                <HomeMovies
                  today={today}
                  currentYear={currentYear}
                  firstDate={firstDate}
                  endOfYear={endOfYear}
                  thirtyDaysAgo={thirtyDaysAgo}
                />
              </Route>

              {/* Search page */}
              <Route exact path="/search">
                <Search apiUrl={`/movie/now_playing`} logo={logo} />
              </Route>
              <Route
                exact
                path="/search/:query"
                render={({ match }) => (
                  <Search
                    apiUrl={`/movie/now_playing`}
                    query={match.params.query}
                  />
                )}
              />

              {/* Movie detail page */}
              <Route
                path="/movies/:id"
                render={({ match }) => (
                  <MovieDetail id={match.params.id} logo={logo} />
                )}
              />

              {/* TV Series */}
              <Route exact path="/tv">
                <HomeTVShows
                  today={today}
                  currentYear={currentYear}
                  firstDate={firstDate}
                  endOfYear={endOfYear}
                  thirtyDaysAgo={thirtyDaysAgo}
                />
              </Route>

              {/* Search page */}
              <Route exact path="/tv/search">
                <Search apiUrl={`/tv/airing_today`} logo={logo} />
              </Route>
              <Route
                exact
                path="/tv/search/:query"
                render={({ match }) => (
                  <Search
                    apiUrl={`/movie/now_playing`}
                    query={match.params.query}
                  />
                )}
              />

              {/* TV Series detail page */}
              <Route
                path="/tv/:id"
                render={({ match }) => (
                  <MovieDetail id={match.params.id} logo={logo} />
                )}
              />
            </Switch>
          </main>

          {/* Footer component */}
          <footer>
            <Footer logo={logo} />
          </footer>
        </div>

        {/* Copyright component */}
        <Copyright />
      </div>
    </Router>
  );
};

export default App;
