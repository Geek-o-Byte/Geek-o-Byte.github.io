import Image from "next/image"
import profilePic from '../public/images/me.jpg'

export default function Page(){
    return(
    <div> 
        <div className="flex flex-col items-center max-w-xl">
            <img src={'/me.jpg'} className="rounded-full" width={300}/>
            <p className="text-2xl">Max Maslov</p>
        </div>
        <p>Education</p>
    </div>)
}