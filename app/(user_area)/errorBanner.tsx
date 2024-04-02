import React, { useEffect } from "react";

const ErrorBanner = ({message, setError}:{message:string, setError:React.Dispatch<React.SetStateAction<string>>}) => {

    useEffect(()=>{
        setTimeout(()=> setError(''), 5000)
    },[setError])

    return(
        <div className="error_container">
            {message}
        </div>
    )
}
export default ErrorBanner