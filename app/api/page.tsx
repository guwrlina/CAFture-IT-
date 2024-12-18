import Header from '../components/Header'
import Footer from '../components/Footer'
import LeafDiseaseDetection from '../components/LeafDiseaseDetection'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Leaf Disease Detection and Analysis</h1>
        <LeafDiseaseDetection />
      </main>
      <Footer />
    </div>
  )
}

