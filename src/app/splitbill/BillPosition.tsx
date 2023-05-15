import Label from "./Label"
import useStore from "./billPositionStore"

const BillPostion = (props: any) => {
    const {user, addUser, removeUser} = useStore()
    let positionClicked = false
    const positionClick = () => {
        if (positionClicked){
            addUser()
            positionClicked = true
        }
        else{
            removeUser()
            positionClicked = false
        }
    }
    const showLabel = () => {
        if (user != null){
            return <div>
                <hr />
                <Label name={user}></Label>
                </div>
        }
    }
    return(
        <li>
            <input type="checkbox" id={props.name} value="" className="hidden peer" onClick={addUser}/>
            <label htmlFor={props.name} className="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                <div className="block">
                    <svg className="mb-2 text-red-600 w-7 h-7" fill="currentColor" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M185.7 268.1h76.2l-38.1-91.6-38.1 91.6zM223.8 32L16 106.4l31.8 275.7 176 97.9 176-97.9 31.8-275.7zM354 373.8h-48.6l-26.2-65.4H168.6l-26.2 65.4H93.7L223.8 81.5z"/></svg>
                    <div className="w-full text-lg font-semibold">{props.name}</div>
                    <div className="w-full text-sm">4$</div>
                    {showLabel()}
                </div>
            </label>
        </li>
    )
}

export default BillPostion