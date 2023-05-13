const Navbar = () => {
    return(
    <nav className="sticky top-0 left-0 z-50 bg-white">
        <ul className='flex justify-center my-6'>
          <li><a href='/' className='p-3'>Home</a></li>
          <li><a href='/blog' className='p-3'>Blog</a></li>
          <li><a href='/about' className='p-3'>About</a></li>
        </ul>
      </nav>
    )
}

export default Navbar;