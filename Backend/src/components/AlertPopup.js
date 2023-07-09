import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';

import { connect } from 'react-redux';
import { alertChange, alertLoading } from '../actions/alert.actions';
import { updateSettings } from '../actions/app.actions';


function AlertPopup(props) {
  const location = useLocation();
	const [currentPath, setCurrentPath] = useState('/');

  const classActive = () => {
    if(props.alert.status) return 'active';
    else return '';
  };
  const classType = () => {
    if(props.alert.type) {
      if(props.alert.type === 'Info') return 'info';
      else if(props.alert.type === 'Success') return 'success';
      else if(props.alert.type === 'Warning') return 'warning';
      else if(props.alert.type === 'Danger') return 'danger';
    }
    return '';
  };
  
	const [offsetY, setOffsetY] = useState(0);
	const backToTop = (e) => {
    e.preventDefault();
		window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
	};
  
  /* eslint-disable */
	useEffect(() => { props.updateSettings(); }, []);
	useEffect(() => {
    if(currentPath !== location.pathname){
      setCurrentPath(location.pathname);
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);
	useEffect(() => {
		setOffsetY(window.pageYOffset);
		const handleScroll = () => {
			setOffsetY(window.pageYOffset);
		}
		window.addEventListener('scroll', handleScroll);
		return function cleanup() {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  /* eslint-enable */

  return (
    <>
      <div className={`alert-popup ${classActive()} ${classType()}`}>
        <div className="wrapper">
          <div className="text-container">
            <h6>{props.alert.type}</h6>
            <p>{props.alert.message}</p>
            {Object.keys(props.alert.errors).length? (
              <ul>
                {Object.keys(props.alert.errors).map((k, i) => (
                  <li key={i}>{props.alert.errors[k]}</li>
                ))} 
              </ul>
            ): (<></>)}
          </div>
        </div>
      </div>
      <div id="global-loader" className={`${props.alert.loading? 'active': ''}`}>
        <div className="loader color-p">
          <CircularProgress color="inherit" size={60} thickness={4} />
        </div>
			</div>
		  <div id="back-to-top" className={`${offsetY > 50? 'active': ''}`} onClick={backToTop}>
        <em className="fa fa-long-arrow-up"></em>
      </div>
    </>
  );
}

AlertPopup.defaultProps = {
  
};
AlertPopup.propTypes = {
	alertChange: PropTypes.func.isRequired,
  alertLoading: PropTypes.func.isRequired,
  updateSettings: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
	alert: state.alert
});

export default connect(mapStateToProps, {
  alertChange: alertChange,
  alertLoading: alertLoading,
  updateSettings: updateSettings
})(AlertPopup);