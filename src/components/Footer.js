import {useContext} from "react";
import {ThemeContext} from "../context/Theme";


export default function Footer() {

  const [{theme}] = useContext(ThemeContext);

  return (
    <>
      <footer className="footer" style={{filter:theme.filter}}>
        <cite>
        © Groupomania 2022
        </cite>
        </footer>
    </>
  );
}
