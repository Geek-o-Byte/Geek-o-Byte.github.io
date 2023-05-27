const Navbar = () => {
    return(
      <nav className="sticky top-0 left-0 z-50 bg-white h-16 flex items-center">
        <ul className="flex justify-center w-full">
          <li className="mx-4"><a href="/" className="px-3 py-2 text-gray-800 hover:text-gray-600">Home</a></li>
          <li className="mx-4"><a href="/blog" className="px-3 py-2 text-gray-800 hover:text-gray-600">Blog</a></li>
          <li className="mx-4"><a href="/about" className="px-3 py-2 text-gray-800 hover:text-gray-600">About</a></li>
        </ul>
      </nav>
    )
}

export default Navbar;