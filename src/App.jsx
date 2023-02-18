import Copyright from "./components/Copyright";
import FilmSlider from "./components/FilmSlider";
import Footer from "./components/Footer";
import Genres from "./components/Genres";
import HomeSlider from "./components/HomeSlider";
import Trending from "./components/Trending";

const App = () => {
  return (
    <div id="app" className="bg-base-dark-gray min-h-screen text-white">
      <Copyright />
      <div id="website">
        <nav>
          <h1 className="sr-only">Popcorn Prespective</h1>
        </nav>
        <main className="pb-8">
          <HomeSlider />
          <section id="genres">
            <Genres />
          </section>
          <section id="popular">
            <FilmSlider />
          </section>
          <section id="trending">
            <Trending />
          </section>
        </main>
        <footer>
          <Footer />
        </footer>
      </div>
    </div>
  );
};

export default App;
