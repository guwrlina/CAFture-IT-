import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-green-600 text-white">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">LeafScan</Link>
        <nav>
          <ul className="flex space-x-4">
            <li><Link href="/" className="hover:underline">Home</Link></li>
            <li><Link href="#about" className="hover:underline">About</Link></li>
            <li><Link href="#contact" className="hover:underline">Contact</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

