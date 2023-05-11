import Image from 'next/image'
import Navbar from './components/Navbar'

export default function Home() {
  return (
    <main className="">
      
      <div className='flex justify-center my-6'>
        <span className='text-4xl max-w-6xl py-28'>
          Hi, I&rsquo;m Max Maslov 
          <br/>
          <br/>
          I&nbsp;am a&nbsp;software engineer and&nbsp;ML researcher and this is&nbsp;my&nbsp;home page where&nbsp;I live and talk about myself, my&nbsp;projects and other interesting stuff. Detailed information about me&nbsp;is&nbsp;in&nbsp;the tab&nbsp;&mdash; about me
          <br/>
          <br/>
          Links: <a href="https://www.linkedin.com/in/max-maslov-60b961253" className='bg-[#0072b1] rounded-lg p-2 text-white'>linkedin</a>&nbsp;<a href="https://github.com/Geek-o-Byte" className='p-2 text-white bg-zinc-900 rounded-lg'>github</a>
          <br/>
          <br/>
          Enjoy your stay
        </span>
      </div>
    </main>
  )
}
