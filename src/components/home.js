import "./home.css";
import logo from '../cp_logo.png';

function Home(){
    return(
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Welcome to Campus Poll where every student vote/opinion Counts.
                </p>
            </header>
        </div>
    )
}

export default Home;