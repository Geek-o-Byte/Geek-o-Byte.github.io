import Image from "next/image"
import profilePic from '../public/images/me.jpg'

const CV = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl">
        <div className="text-center mb-6">
          <img className="rounded-full mx-auto w-48 h-48" src={'/me.jpg'} alt="Profile" />
          <h1 className="text-2xl font-bold mt-4">Max Maslov</h1>
          <h2 className="text-lg text-gray-600">Software Developer</h2>
        </div>
        
        <div className="mt-8">
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-2">Education</h3>
            <p className="text-gray-600">ITMO University</p>
            <p className="text-gray-600">Neurotechnology and Programming</p>
            <p className="text-gray-600">Bachelor's Degree</p>
            <p className="text-gray-600">2020 - 2024</p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-2">Experience</h3>
            <p className="text-gray-600">Software Developer Intern</p>
            <p className="text-gray-600">ITMO University</p>
            <p className="text-gray-600">2020 - 2021</p>
            <ul className="list-disc list-inside ml-6">
              <li className="text-gray-600">Developed web applications using Django and Flask frameworks</li>
              <li className="text-gray-600">Implemented frontend interfaces with HTML, CSS, and JavaScript</li>
              <li className="text-gray-600">Worked on database design and management using PostgreSQL</li>
            </ul>
          </div>
          
          <h3 className="text-lg font-bold mb-3">Skills</h3>
          <ul className="list-disc list-inside mb-6">
            <li>Programming Languages: Python, C++</li>
            <li>Machine Learning: Scikit-learn, TensorFlow, Keras</li>
            <li>Frontend: HTML, CSS, JavaScript, React, Vue.js</li>
            <li>Backend: Python (Django, Flask, FastAPI), Node.js</li>
            <li>Databases: PostgreSQL, MySQL</li>
            <li>Data Analysis: Python (NumPy, Pandas, Matplotlib)</li>
            <li>Version Control: Git</li>
          </ul>
          
          <h3 className="text-lg font-bold mb-3">Projects</h3>
          <ul className="list-disc list-inside mb-6">
            <li>Splitbill App</li>
            <li>ManagerAI System</li>
            <li>AI Font Generator</li>
          </ul>
          
          <h3 className="text-lg font-bold mb-3">Languages</h3>
          <ul className="list-disc list-inside mb-6">
            <li>English - Proficient (C1)</li>
            <li>Russian - Native</li>
          </ul>
          
          <h3 className="text-lg font-bold mb-3">Contacts</h3>
          <ul className="list-disc list-inside mb-6">
            <li>Email: [first name]miriko@gmail.com</li>
            <li>LinkedIn: <a href="https://www.linkedin.com/in/max-maslov/" className="text-blue-500">Max Maslov</a></li>
            <li>GitHub: <a href="https://github.com/geek-o-byte" className="text-blue-500">geek-o-byte</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}



export default function Page(){
    return(
    <div> 
        <div className=" relative mt-[300px]">
            <CV/>
        </div>
    </div>)
}