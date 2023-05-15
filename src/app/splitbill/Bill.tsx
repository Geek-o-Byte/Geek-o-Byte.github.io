import BillPostions from "./BillPositions"
import FinalButton from "./FinalButton"

const Bill = () => {
    return(
        <div className="flex justify-center mt-6">
            <div className="basis-1/4">
                <h2 className="text-xl">Hi, User 👋</h2>
                <hr />
                <p className="text-md my-3">Your positions</p>
                <BillPostions/>
                <FinalButton/>
            </div>
        </div>
    )
}

export default Bill