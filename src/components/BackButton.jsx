import { useNavigate } from "react-router-dom";
import Button from "./Button";


export default function BackButton() {
    const navigate = useNavigate();

    return (
        <Button
          type='back'
          onClick={(e) => {
            e.preventDefault(); //it reloads the page as it is a form element
            navigate(-1) //to move -(num) steps back
          }}>
          &larr; Back
        </Button>
  )
}
