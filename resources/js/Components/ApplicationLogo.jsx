import logo from '@/assets/logo_alonso.png';
export default function ApplicationLogo(props) {
    return (
        <img src={logo} alt={props.alt} {...props} />
    );
}
