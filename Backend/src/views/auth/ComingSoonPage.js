import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { onMounted } from '../../helpers/frontend';
import Footer from '../../components/Footer';

import { connect } from 'react-redux';
import { setSidenavActiveIndex } from '../../actions/app.actions';


function ComingSoonPage(props) {
  const params = useParams();
  const pageIndex = params['*']? params['*']: 0;

  /* eslint-disable */
	useEffect(() => { onMounted(); }, []);
	useEffect(() => {
    props.setSidenavActiveIndex(pageIndex? Number(pageIndex): 0);
  }, [pageIndex]);
  /* eslint-enable */

  return (
    <div className="app-container app-container-bg">
      <div className="bg-img" style={{ backgroundImage: `url('/assets/img/bg/coming-soon.jpg')` }}></div>
      
      <Footer />
    </div>
  );
}

ComingSoonPage.defaultProps = {
	
};
ComingSoonPage.propTypes = {
  setSidenavActiveIndex: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  
});

export default connect(mapStateToProps, {
  setSidenavActiveIndex: setSidenavActiveIndex
})(ComingSoonPage);