// import ProgressBar from 'react-animated-progress-bar';
// import ProgressBar from "@ramonak/react-progress-bar";
// function Progress({ value = 0 }) {
//     return (
//         <div style={{ margin: "20px" }}>
//             <ProgressBar completed={50} />
//         </div>
//     );
// }

// export default Progress;

const ProgressBar = (props) => {
    const { bgcolor, completed } = props;

    const containerStyles = {
        height: 35,
        width: '80%',
        backgroundColor: "#e0e0de",
        opacity: 0.8,
        borderRadius: 50,
        margin: '25px auto auto auto',
        boxShadow: '0px 0px 5px 1px grey',
    }

    const fillerStyles = {
        height: '100%',
        width: `${completed}%`,
        backgroundColor: bgcolor,
        borderRadius: 'inherit',
        textAlign: 'right',
        display: 'flex',
        boxShadow: '0px 0px 22px 1px green',
        justifyContent: 'right',
    }

    const labelStyles = {
        padding: 5,
        color: 'white',
        fontWeight: 'bold',
    }

    return (
        <div style={containerStyles}>
            <div style={fillerStyles}>
                <span style={labelStyles}>{`${completed}%`}&nbsp;STABLED</span>
            </div>
        </div>
    );
};

export default ProgressBar;
