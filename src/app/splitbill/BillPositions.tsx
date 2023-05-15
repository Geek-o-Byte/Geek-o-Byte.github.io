'use client'

import BillPostion from "./BillPosition"

const positions = ['Borsh', 'Salad', 'Giros']

const BillPostions = () => {
    return(
        <div className="max-w-lg shrink-0">
            <ul className="grid w-full gap-6 grid-cols-1 shrink-0">
            {positions.map(position => (
                <BillPostion name={position}/>
            ))}
            </ul>
        </div>
    )
}

export default BillPostions;