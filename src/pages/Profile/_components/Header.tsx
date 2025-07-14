import { FaArrowLeft, FaBars } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './header.css';
interface HeaderProps {
  title: string;
}
const Header: React.FC<HeaderProps> = ({ title }) => {
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };
  const openMenu = () => {
    alert('Menü wird noch implementiert 😉');
  };
  return (
    <div className="header-bar">
      <FaArrowLeft className="icon" onClick={goBack} />
      <div className="header-title">{title}</div>
      <FaBars className="icon" onClick={openMenu} />
    </div>
  );
};
export default Header;
