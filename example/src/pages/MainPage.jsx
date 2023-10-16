import { message } from "../../../index";

function MainPage() {
  return (
    <div>
      
        <button onClick={() => message.success("a")}>test</button>
    
    </div>
  );
}

export default MainPage;
