import Image from 'next/image'
import Navbar from './components/Navbar'

export default function Home() {
  return (
    <main className="">
      <Navbar/>
      <div className='flex justify-center my-6'>
        <span className='text-4xl max-w-6xl py-36'>
          Hi, I&rsquo;m Max Maslov 
          <br/>
          <br/>
          I&nbsp;am a&nbsp;software engineer and&nbsp;ML researcher and this is&nbsp;my&nbsp;home page where&nbsp;I live and talk about myself, my&nbsp;projects and other interesting stuff. Detailed information about me&nbsp;is&nbsp;in&nbsp;the tab&nbsp;&mdash; about me
          <br/>
          <br/>
          Enjoy your stay
        </span>
      </div>
    </main>
  )
}
