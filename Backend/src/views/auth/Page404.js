import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { onMounted, appLogo } from '../../helpers/frontend';

import { connect } from 'react-redux';
import { setSidenavActiveIndex } from '../../actions/app.actions';


function Page404(props) {
  
  /* eslint-disable */
	useEffect(() => { onMounted(); props.setSidenavActiveIndex(0) }, []);
  /* eslint-enable */

  return (
    <section className="auth-01 section-padding">
      <div className="bg-img" style={{ backgroundImage: `url('/assets/img/bg/01.jpg')` }}></div>
      <div className="container">
        <div className="auth-container bradius box-shadow">
          <div className="auth-body bg-white">
            <div className="title">
              <img className="logo" src={appLogo()} alt="Logo" />
              <div className="text">
                <h5 className="fw-900 lh-sm">404 Error</h5>
                <p className="fw-600 op-70">Back Office System</p>
              </div>
            </div>
            <p className="fw-500 text-center mt-6">
              ไม่พบหน้าที่คุณค้นหาในระบบของเรา <br />
              กรุณาลองใหม่อีกครั้ง
            </p>
            <div className="btns pt-2">
              <Link to="/" className="btn btn-action btn-p btn-lg w-full">
                กลับสู่หน้าแรก
              </Link>
            </div>
          </div>
          <div className="auth-footer bg-s color-white">
            <p className="xxs fw-300 text-center">
              © 2022 Tech Origin Co., Ltd. <span className="xs-hide">All rights reserved.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

Page404.defaultProps = {
	
};
Page404.propTypes = {
	setSidenavActiveIndex: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  
});

export default connect(mapStateToProps, {
  setSidenavActiveIndex: setSidenavActiveIndex
})(Page404);