const Label = (props:any) => {
    let labelLetter: string = props.name[0]
    return(
        <div className="rounded-full p-1 text-white bg-blue-700 text-center mt-2">
            {labelLetter}
        </div>
    )
}

export default Label