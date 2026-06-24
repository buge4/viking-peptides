import Header from '../components/Header'
import Hero from '../components/Hero'
import Categories from '../components/Categories'
import ProductCatalog from '../components/ProductCatalog'
import Science from '../components/Science'
import About from '../components/About'
import Contact from '../components/Contact'
import Footer from '../components/Footer'

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Categories />
        <ProductCatalog />
        <Science />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
