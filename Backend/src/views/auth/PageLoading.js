import CircularProgress from '@mui/material/CircularProgress';

import { connect } from 'react-redux';


function PageLoading(props) {
  return (
    <section className="page-loading">
      <div className="wrapper color-p">
        <CircularProgress color="inherit" size={60} thickness={4} />
      </div>
    </section>
  );
}

PageLoading.defaultProps = {
	
};
PageLoading.propTypes = {
  
};

const mapStateToProps = (state) => ({
  
});

export default connect(mapStateToProps, {
  
})(PageLoading);